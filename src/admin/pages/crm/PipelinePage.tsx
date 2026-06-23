import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getClientsAPI, updateClientStageAPI, Client } from "../../lib/api";
import { Filter, Plus, Loader2 } from "lucide-react";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from "react-router-dom";

const CRM_STAGES = ["Lead", "Qualified", "Prospect", "Proposal Sent", "Negotiation", "Won", "Active Client", "Closed Lost"];

// Sortable Card Component
const SortableCard = ({ client, onClick }: { client: Client, onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: client._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px 0", color: "#fff" }}>{client.companyName}</h4>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px 0" }}>{client.contactEmail}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className={`admin-badge admin-badge-info`}>{client.status}</span>
        <span style={{ fontSize: 11, color: "#64748b" }}>{new Date(client.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const PipelinePage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClientsAPI();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const clientId = active.id as string;
    const overId = over.id as string;

    // Check if overId is a column ID (stage name)
    const isOverColumn = CRM_STAGES.includes(overId);
    
    // Check if overId is another card
    const overClient = clients.find(c => c._id === overId);
    const newStage = isOverColumn ? overId : (overClient ? overClient.crm_data?.stage || "Lead" : null);

    if (newStage) {
      const activeClient = clients.find(c => c._id === clientId);
      if (activeClient && activeClient.crm_data?.stage !== newStage) {
        // Optimistic update
        setClients(prev => prev.map(c => c._id === clientId ? { ...c, crm_data: { ...c.crm_data, stage: newStage } } : c));
        try {
          await updateClientStageAPI(clientId, newStage);
        } catch (err) {
          console.error("Failed to update stage", err);
          fetchClients(); // Revert on failure
        }
      }
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Loader2 className="animate-spin text-slate-500" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>Pipeline Board</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="admin-btn admin-btn-ghost"><Filter size={16} /> Filter</button>
          <button className="admin-btn admin-btn-primary"><Plus size={16} /> Add Lead</button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
          {CRM_STAGES.map(stage => {
            const stageClients = clients.filter(c => (c.crm_data?.stage || "Lead") === stage);
            
            return (
              <div key={stage} className="kanban-column admin-glass-panel" style={{ minWidth: 320 }}>
                <div className="kanban-column-header">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{stage}</span>
                  <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
                    {stageClients.length}
                  </span>
                </div>
                
                {/* Column Drop Zone */}
                <div id={stage} style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 150 }}>
                  <SortableContext items={stageClients.map(c => c._id)} strategy={verticalListSortingStrategy}>
                    {stageClients.map(client => (
                      <SortableCard 
                        key={client._id} 
                        client={client} 
                        onClick={() => navigate(`/admin/crm/lead/${client._id}`)} 
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>
    </motion.div>
  );
};

export default PipelinePage;
