import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { getClientsAPI, updateClientStageAPI, authFetch, Client } from "../../lib/api";
import { Plus, Loader2, Search } from "lucide-react";
import {
  DndContext, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent, useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DynamicAddModal, ModalField } from "../../components/DynamicAddModal";
import { formatINR } from "./useCrmClients";

const CRM_STAGES = ["Lead", "Qualified", "Prospect", "Proposal Sent", "Negotiation", "Won", "Active Client", "Closed Lost"];

const STAGE_COLORS: Record<string, string> = {
  "Lead": "#38bdf8",
  "Qualified": "#818cf8",
  "Prospect": "#a78bfa",
  "Proposal Sent": "#f59e0b",
  "Negotiation": "#fb923c",
  "Won": "#10b981",
  "Active Client": "#34d399",
  "Closed Lost": "#ef4444",
};

const SortableCard = ({ client, onOpen }: { client: Client; onOpen: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: client._id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card">
      <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px 0", color: "#fff" }}>{client.companyName}</h4>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px 0" }}>{client.contactEmail}</p>
      <p style={{ fontSize: 13, color: "#10b981", fontWeight: 600, margin: "0 0 12px 0" }}>{formatINR(client.revenue)}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span className="admin-badge admin-badge-info">{client.status}</span>
        {/* A plain button, so opening the profile never competes with dragging. */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          style={{
            background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)",
            color: "#38bdf8", cursor: "pointer", fontSize: 11, fontWeight: 600,
            padding: "4px 8px", borderRadius: 5,
          }}
        >
          Open
        </button>
      </div>
    </div>
  );
};

/** A real dnd-kit drop target. The old code used a plain <div id={stage}>,
 *  which dnd-kit never sees — so dropping into an empty column did nothing. */
const StageColumn: React.FC<{
  stage: string;
  clients: Client[];
  onOpen: (id: string) => void;
}> = ({ stage, clients, onOpen }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const total = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const color = STAGE_COLORS[stage] || "#38bdf8";

  return (
    <div className="kanban-column admin-glass-panel" style={{ minWidth: 300, maxWidth: 300 }}>
      <div className="kanban-column-header" style={{ borderBottom: `2px solid ${color}44` }}>
        <span style={{ fontWeight: 600, fontSize: 14, color }}>{stage}</span>
        <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
          {clients.length}
        </span>
      </div>
      <div style={{ fontSize: 11, color: "#64748b", padding: "4px 0 10px" }}>{formatINR(total)}</div>

      <div
        ref={setNodeRef}
        style={{
          display: "flex", flexDirection: "column", gap: 12, minHeight: 160,
          borderRadius: 8, padding: 4,
          background: isOver ? `${color}14` : "transparent",
          outline: isOver ? `1px dashed ${color}66` : "none",
          transition: "background 0.15s",
        }}
      >
        <SortableContext items={clients.map((c) => c._id)} strategy={verticalListSortingStrategy}>
          {clients.map((client) => (
            <SortableCard key={client._id} client={client} onOpen={() => onOpen(client._id)} />
          ))}
        </SortableContext>
        {clients.length === 0 && (
          <div style={{ color: "#475569", fontSize: 12, textAlign: "center", padding: "24px 0" }}>
            Drop a lead here
          </div>
        )}
      </div>
    </div>
  );
};

const PipelinePage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const fetchClients = useCallback(async () => {
    try {
      const data = await getClientsAPI();
      setClients(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const clientId = String(active.id);
    const overId = String(over.id);

    // `over` is either a column (droppable id === stage name) or another card.
    const newStage = CRM_STAGES.includes(overId)
      ? overId
      : clients.find((c) => c._id === overId)?.crm_data?.stage || null;

    if (!newStage) return;

    const moving = clients.find((c) => c._id === clientId);
    if (!moving || moving.crm_data?.stage === newStage) return;

    const previousStage = moving.crm_data?.stage;
    setClients((prev) => prev.map((c) =>
      c._id === clientId ? { ...c, crm_data: { ...c.crm_data, stage: newStage } } : c
    ));

    try {
      await updateClientStageAPI(clientId, newStage);
      toast.success(`${moving.companyName} → ${newStage}`);
    } catch (err) {
      console.error("Failed to update stage", err);
      toast.error("Could not move the lead — reverting");
      setClients((prev) => prev.map((c) =>
        c._id === clientId ? { ...c, crm_data: { ...c.crm_data, stage: previousStage } } : c
      ));
    }
  };

  const visible = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter((c) =>
      c.companyName?.toLowerCase().includes(q) ||
      c.contactEmail?.toLowerCase().includes(q) ||
      c.industry?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const leadFields: ModalField[] = [
    { name: "companyName", label: "Company Name", type: "text", required: true },
    { name: "contactName", label: "Contact Name", type: "text" },
    { name: "contactEmail", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "text" },
    { name: "industry", label: "Industry", type: "text" },
    { name: "revenue", label: "Estimated Deal Value (₹)", type: "number", defaultValue: 0 },
    {
      name: "stage", label: "Pipeline Stage", type: "select", required: true, defaultValue: "Lead",
      options: CRM_STAGES.map((s) => ({ label: s, value: s })),
    },
  ];

  const handleAddLead = async (data: any) => {
    const { stage, ...clientData } = data;
    const res = await authFetch("/clients/", {
      method: "POST",
      body: JSON.stringify({
        ...clientData,
        status: "Active",
        crm_data: { stage: stage || "Lead", tags: [] },
      }),
    });
    if (!res.ok) throw new Error("Failed to create lead");
    toast.success("Lead added to pipeline");
    fetchClients();
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Pipeline Board</h3>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            Drag a card to move a lead between stages — the change saves automatically.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={14} color="#64748b" style={{ position: "absolute", left: 10 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter leads..."
              style={{
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "8px 12px 8px 30px", color: "#fff", fontSize: 13,
                outline: "none", minWidth: 200,
              }}
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8,
              background: "#38bdf8", border: "none", color: "#000", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
            }}
          >
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
          {CRM_STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              clients={visible.filter((c) => (c.crm_data?.stage || "Lead") === stage)}
              onOpen={(id) => navigate(`/admin/crm/clients/${id}`)}
            />
          ))}
        </div>
      </DndContext>

      <DynamicAddModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Lead"
        fields={leadFields}
        onSubmit={handleAddLead}
        submitText="Add Lead"
      />
    </motion.div>
  );
};

export default PipelinePage;
