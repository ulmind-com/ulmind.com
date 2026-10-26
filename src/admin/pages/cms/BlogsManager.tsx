import React, { useState, useEffect, useRef } from "react";
import {
  getAdminBlogsAPI,
  createBlogAPI,
  updateBlogAPI,
  deleteBlogAPI,
  uploadCmsImageAPI,
  BlogPost,
} from "../../lib/api";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  Upload,
  Tag,
  Clock,
  Eye,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  FileText,
  User,
  Hash,
  Search,
  Filter,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  iconBtn,
  overlayStyle,
  panelStyle,
  panelHeaderStyle,
  panelFooterStyle,
  closeBtnStyle,
  DeleteModal,
} from "./StatsManager";

const ChipInput: React.FC<{
  label: string;
  accent: string;
  items: string[];
  placeholder: string;
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}> = ({ label, accent, items, placeholder, onAdd, onRemove }) => {
  const [draft, setDraft] = useState("");
  const commit = () => {
    let v = draft.trim();
    if (v) {
      if (!v.startsWith("#")) v = `#${v}`;
      onAdd(v);
      setDraft("");
    }
  };
  return (
    <div>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#94a3b8",
          display: "block",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="admin-input"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
        />
        <button
          type="button"
          onClick={commit}
          className="admin-btn admin-btn-ghost"
          style={{ padding: "0 18px", flexShrink: 0 }}
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {items.map((t) => (
            <span
              key={t}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: `${accent}1a`,
                color: accent,
                border: `1px solid ${accent}33`,
              }}
            >
              {t}
              <button
                type="button"
                onClick={() => onRemove(t)}
                style={{
                  background: "none",
                  border: "none",
                  color: accent,
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 0,
                  opacity: 0.7,
                }}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const CATEGORIES = [
  "Software Engineering",
  "AI Integration",
  "Custom Software",
  "Healthcare & Lifesciences",
  "Mobile Development",
  "Cloud & DevOps",
  "Product Strategy",
  "Cybersecurity",
  "FinTech",
];

const SERVICES = [
  "Web Development",
  "Mobile Apps",
  "Cloud Solutions",
  "Backend Development",
  "E-commerce Solutions",
  "AI & Machine Learning",
  "Custom Software",
  "UI/UX Design",
];

const BlogsManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");

  // Panel state
  const [panelMode, setPanelMode] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>({});
  const [contentTab, setContentTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setError(null);
      const data = await getAdminBlogsAPI();
      setBlogs(data);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const openAdd = () => {
    setPanelMode("add");
    setEditId(null);
    setForm({
      category: "Software Engineering",
      service: "Custom Software",
      author: "ULMIND Team",
      authorRole: "Tech Specialist",
      readTime: "5 min read",
      published: true,
      featured: false,
      tags: [],
      order: blogs.length + 1,
      views: 0,
    });
    setContentTab("write");
    setFormError(null);
  };

  const openEdit = (b: BlogPost) => {
    setPanelMode("edit");
    setEditId(b._id);
    setForm({
      ...b,
      tags: b.tags || [],
    });
    setContentTab("write");
    setFormError(null);
  };

  const closePanel = () => {
    if (!formLoading) setPanelMode(null);
  };

  const set = (patch: Partial<BlogPost>) => setForm((f) => ({ ...f, ...patch }));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const img = await uploadCmsImageAPI(file);
      set({ coverImage: img });
    } catch {
      setFormError("Cover image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.excerpt?.trim()) {
      setFormError("Excerpt is required for card preview.");
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const payload: Partial<BlogPost> = {
        title: form.title.trim(),
        slug: form.slug?.trim() || generateSlug(form.title),
        excerpt: form.excerpt.trim(),
        content: form.content || "",
        category: form.category || "Software Engineering",
        service: form.service || "Custom Software",
        tags: form.tags || [],
        author: form.author?.trim() || "ULMIND Team",
        authorRole: form.authorRole?.trim() || "Tech Specialist",
        authorAvatar: form.authorAvatar?.trim() || undefined,
        readTime: form.readTime?.trim() || calculateReadTime(form.content || ""),
        published: form.published !== false,
        featured: Boolean(form.featured),
        order: Number(form.order) || 0,
        coverImage: form.coverImage,
      };

      if (panelMode === "edit" && editId) {
        await updateBlogAPI(editId, payload);
      } else {
        await createBlogAPI(payload);
      }
      setPanelMode(null);
      await loadBlogs();
    } catch (err: any) {
      setFormError(err.message || "Failed to save blog post");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlogAPI(deleteTarget._id);
      setDeleteTarget(null);
      await loadBlogs();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const togglePublished = async (blog: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateBlogAPI(blog._id, { published: !blog.published });
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, published: !b.published } : b))
      );
    } catch (err: any) {
      alert("Failed to update status");
    }
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory !== "All" && b.category !== selectedCategory) return false;
    if (statusFilter === "Published" && !b.published) return false;
    if (statusFilter === "Draft" && b.published) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchExcerpt = b.excerpt?.toLowerCase().includes(q);
      const matchCategory = b.category?.toLowerCase().includes(q);
      const matchTags = b.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchExcerpt && !matchCategory && !matchTags) return false;
    }
    return true;
  });

  const totalPublished = blogs.filter((b) => b.published).length;
  const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    display: "block",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* ── Metric Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          className="admin-card"
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--admin-text-dim)", fontWeight: 600 }}>Total Articles</span>
            <BookOpen size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 8 }}>
            {blogs.length}
          </div>
          <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 4 }}>Live & draft content</div>
        </div>

        <div
          className="admin-card"
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--admin-text-dim)", fontWeight: 600 }}>Published Live</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 8 }}>
            {totalPublished}
          </div>
          <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>Visible to all visitors</div>
        </div>

        <div
          className="admin-card"
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(14,165,233,0.02))",
            border: "1px solid rgba(14,165,233,0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--admin-text-dim)", fontWeight: 600 }}>Total Article Views</span>
            <Eye size={18} color="#0ea5e9" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 8 }}>
            {totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: "#0ea5e9", marginTop: 4 }}>Reader interactions</div>
        </div>

        <div
          className="admin-card"
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--admin-text-dim)", fontWeight: 600 }}>Featured Stories</span>
            <Sparkles size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 8 }}>
            {blogs.filter((b) => b.featured).length}
          </div>
          <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>Top hero highlights</div>
        </div>
      </div>

      {/* ── Action Header & Filters ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text)" }}>
            Blog Articles & Tech Insights
          </h2>
          <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
            Create, update, upload cover images, configure tags & manage published stories.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="admin-btn admin-btn-primary"
          style={{
            padding: "11px 22px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            border: "none",
            boxShadow: "0 6px 20px rgba(245,158,11,0.3)",
          }}
        >
          <Plus size={18} /> New Blog Post
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div
        className="admin-card"
        style={{
          padding: 16,
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--admin-text-dim)",
            }}
          />
          <input
            className="admin-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search articles by title, keywords, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            className="admin-input"
            style={{ width: "auto", minWidth: 160 }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="admin-input"
            style={{ width: "auto", minWidth: 130 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
          </select>

          {(searchQuery || selectedCategory !== "All" || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setStatusFilter("All");
              }}
              className="admin-btn admin-btn-ghost"
              style={{ fontSize: 12, padding: "0 12px" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Content View ── */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2 size={32} className="animate-spin" color="var(--admin-text-dim)" />
        </div>
      ) : error ? (
        <div
          style={{
            padding: 20,
            background: "rgba(225,29,72,0.1)",
            border: "1px solid rgba(225,29,72,0.3)",
            borderRadius: 14,
            color: "#f87171",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <AlertCircle size={18} /> {error}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="admin-card" style={{ padding: "64px 32px", textAlign: "center" }}>
          <BookOpen
            size={48}
            style={{ margin: "0 auto 16px", color: "var(--admin-text-dim)", opacity: 0.4 }}
          />
          <h3 style={{ fontSize: 18, color: "var(--admin-text)", fontWeight: 600, marginBottom: 8 }}>
            No blogs found
          </h3>
          <p style={{ color: "var(--admin-text-dim)", fontSize: 14, marginBottom: 24 }}>
            {blogs.length === 0
              ? "Start by publishing your very first tech blog post."
              : "No blogs match the selected search or filter criteria."}
          </p>
          <button
            onClick={openAdd}
            className="admin-btn admin-btn-primary"
            style={{ padding: "11px 22px", margin: "0 auto" }}
          >
            <Plus size={16} /> Add First Blog
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: 22,
          }}
        >
          {filteredBlogs.map((b) => (
            <div
              key={b._id}
              className="admin-card"
              style={{
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: b.featured ? "1px solid rgba(245,158,11,0.4)" : undefined,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Cover Image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 190,
                  background: "rgba(15,22,41,0.8)",
                  overflow: "hidden",
                }}
              >
                {b.coverImage?.url ? (
                  <img
                    src={b.coverImage.url}
                    alt={b.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #18181b, #09090b)",
                    }}
                  >
                    <BookOpen size={36} style={{ color: "#71717a", opacity: 0.4 }} />
                    <span style={{ fontSize: 12, color: "#71717a", marginTop: 6 }}>
                      No cover image
                    </span>
                  </div>
                )}

                {/* Top Badges */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <span
                    className={`admin-badge ${b.published ? "admin-badge-success" : "admin-badge-warning"}`}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => togglePublished(b, e)}
                    title="Click to toggle publish status"
                  >
                    {b.published ? "Live" : "Draft"}
                  </span>
                  {b.featured && (
                    <span
                      style={{
                        background: "rgba(245,158,11,0.9)",
                        color: "#000",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    padding: "3px 8px",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "#fff",
                  }}
                >
                  <Eye size={12} /> {b.views || 0}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Category & Service */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#f59e0b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {b.category}
                  </span>
                  {b.service && (
                    <>
                      <span style={{ color: "var(--admin-text-dim)", fontSize: 10 }}>•</span>
                      <span style={{ fontSize: 11, color: "var(--admin-text-dim)" }}>
                        {b.service}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--admin-text)",
                    lineHeight: 1.4,
                    marginBottom: 8,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as any,
                    overflow: "hidden",
                  }}
                >
                  {b.title}
                </h3>

                {/* Excerpt */}
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--admin-text-muted)",
                    lineHeight: 1.5,
                    marginBottom: 14,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as any,
                    overflow: "hidden",
                  }}
                >
                  {b.excerpt}
                </p>

                {/* Tags */}
                {b.tags && b.tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 16,
                    }}
                  >
                    {b.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#94a3b8",
                          background: "rgba(255,255,255,0.04)",
                          padding: "2px 8px",
                          borderRadius: 6,
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {b.tags.length > 3 && (
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        +{b.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Metadata & Actions */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 14,
                    borderTop: "1px solid var(--admin-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        overflow: "hidden",
                      }}
                    >
                      {b.authorAvatar ? (
                        <img
                          src={b.authorAvatar}
                          alt={b.author}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        b.author?.charAt(0) || "U"
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>
                      <span style={{ fontWeight: 600, color: "var(--admin-text)" }}>
                        {b.author}
                      </span>
                      <span style={{ margin: "0 4px" }}>•</span>
                      <span>{b.readTime || "5 min read"}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <a
                      href={`/blogs/${b.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Live Blog"
                      style={iconBtn("var(--admin-text-dim)")}
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => openEdit(b)}
                      title="Edit Blog"
                      style={iconBtn("var(--admin-text-dim)")}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(b)}
                      title="Delete Blog"
                      style={iconBtn("#f87171", "rgba(225,29,72,0.1)")}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Slide-over Editor Panel ── */}
      {panelMode && (
        <>
          <div onClick={closePanel} style={overlayStyle} />
          <div
            style={{
              ...panelStyle,
              maxWidth: 680,
            }}
          >
            {/* Header */}
            <div style={panelHeaderStyle}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--admin-text)" }}>
                  {panelMode === "add" ? "Create New Blog Post" : "Edit Blog Post"}
                </h3>
                <p style={{ fontSize: 12, color: "var(--admin-text-dim)", marginTop: 2 }}>
                  Dynamic content saved instantly to MongoDB & synced to ulmind.com/blogs
                </p>
              </div>
              <button onClick={closePanel} style={closeBtnStyle}>
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleSave}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {formError && (
                <div
                  style={{
                    background: "rgba(225,29,72,0.1)",
                    border: "1px solid rgba(225,29,72,0.3)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontSize: 13,
                    color: "#f87171",
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {formError}
                </div>
              )}

              {/* Title & Slug */}
              <div>
                <label style={labelStyle}>Article Title *</label>
                <input
                  className="admin-input"
                  placeholder="e.g. How to Integrate ChatGPT Into Your Existing Product"
                  value={form.title || ""}
                  onChange={(e) => {
                    const title = e.target.value;
                    set({
                      title,
                      slug: form.slug || generateSlug(title),
                    });
                  }}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>
                  URL Slug (Auto-generated or custom)
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="admin-input"
                    placeholder="how-to-integrate-chatgpt-2026"
                    value={form.slug || ""}
                    onChange={(e) => set({ slug: generateSlug(e.target.value) })}
                  />
                  <button
                    type="button"
                    onClick={() => set({ slug: generateSlug(form.title || "") })}
                    className="admin-btn admin-btn-ghost"
                    style={{ flexShrink: 0, padding: "0 14px", fontSize: 12 }}
                  >
                    Regenerate
                  </button>
                </div>
                <span style={{ fontSize: 11, color: "var(--admin-text-dim)", marginTop: 4, display: "block" }}>
                  Live URL: /blogs/{form.slug || "slug-preview"}
                </span>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label style={labelStyle}>Cover Image</label>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div
                    style={{
                      width: 120,
                      height: 75,
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px dashed var(--admin-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {form.coverImage?.url ? (
                      <img
                        src={form.coverImage.url}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Upload size={20} color="var(--admin-text-dim)" />
                    )}
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImage}
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: "8px 16px", fontSize: 13 }}
                      >
                        {uploading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={14} /> Upload Image
                          </>
                        )}
                      </button>

                      {form.coverImage?.url && (
                        <button
                          type="button"
                          onClick={() => set({ coverImage: undefined })}
                          className="admin-btn admin-btn-ghost"
                          style={{ color: "#f87171", padding: "8px 14px" }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      className="admin-input"
                      style={{ fontSize: 12, padding: "8px 12px" }}
                      placeholder="Or paste external image URL..."
                      value={form.coverImage?.url || ""}
                      onChange={(e) =>
                        set({
                          coverImage: {
                            url: e.target.value,
                            public_id: form.coverImage?.public_id || "custom_url",
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Category & Service */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Category / Industry *</label>
                  <select
                    className="admin-input"
                    value={form.category || "Software Engineering"}
                    onChange={(e) => set({ category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Related Service</label>
                  <select
                    className="admin-input"
                    value={form.service || "Custom Software"}
                    onChange={(e) => set({ service: e.target.value })}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <ChipInput
                label="Tags / Hashtags (Press Enter or Comma to add)"
                accent="#f59e0b"
                items={form.tags || []}
                placeholder="e.g. #AI Integration, #ChatGPT, #Cloud"
                onAdd={(t) => set({ tags: [...(form.tags || []), t] })}
                onRemove={(t) => set({ tags: (form.tags || []).filter((x) => x !== t) })}
              />

              {/* Excerpt */}
              <div>
                <label style={labelStyle}>Short Excerpt / Teaser *</label>
                <textarea
                  className="admin-input"
                  style={{ minHeight: 70, resize: "vertical" }}
                  placeholder="2-3 sentence overview displayed on the blog card and for SEO previews..."
                  value={form.excerpt || ""}
                  onChange={(e) => set({ excerpt: e.target.value })}
                  required
                />
              </div>

              {/* Content Markdown Editor */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <label style={{ ...labelStyle, marginBottom: 0 }}>
                    Article Body (Markdown Supported)
                  </label>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => setContentTab("write")}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        background:
                          contentTab === "write"
                            ? "var(--admin-accent)"
                            : "rgba(255,255,255,0.05)",
                        color: contentTab === "write" ? "#fff" : "var(--admin-text-dim)",
                      }}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab("preview")}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        background:
                          contentTab === "preview"
                            ? "var(--admin-accent)"
                            : "rgba(255,255,255,0.05)",
                        color: contentTab === "preview" ? "#fff" : "var(--admin-text-dim)",
                      }}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {contentTab === "write" ? (
                  <textarea
                    className="admin-input"
                    style={{
                      minHeight: 260,
                      resize: "vertical",
                      fontFamily: "monospace",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                    placeholder="# Your Headline\n\nWrite your article in Markdown...\n\n### Key Takeaways\n- Point one\n- Point two"
                    value={form.content || ""}
                    onChange={(e) => {
                      const content = e.target.value;
                      set({
                        content,
                        readTime: calculateReadTime(content),
                      });
                    }}
                  />
                ) : (
                  <div
                    style={{
                      minHeight: 260,
                      maxHeight: 380,
                      overflowY: "auto",
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--admin-border)",
                      color: "var(--admin-text)",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                    className="prose prose-invert max-w-none"
                  >
                    {form.content?.trim() ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {form.content}
                      </ReactMarkdown>
                    ) : (
                      <span style={{ color: "var(--admin-text-dim)", fontStyle: "italic" }}>
                        Nothing to preview yet. Switch to "Write" tab to begin.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Author, Role & Read Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Author Name</label>
                  <input
                    className="admin-input"
                    placeholder="e.g. Sayak Dhar"
                    value={form.author || ""}
                    onChange={(e) => set({ author: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Author Role</label>
                  <input
                    className="admin-input"
                    placeholder="e.g. CTO & Co-founder"
                    value={form.authorRole || ""}
                    onChange={(e) => set({ authorRole: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Read Time</label>
                  <input
                    className="admin-input"
                    placeholder="e.g. 5 min read"
                    value={form.readTime || ""}
                    onChange={(e) => set({ readTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Publishing Controls */}
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  padding: "14px 18px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.published !== false}
                    onChange={(e) => set({ published: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: "#10b981" }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
                    Published Live
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(form.featured)}
                    onChange={(e) => set({ featured: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: "#f59e0b" }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
                    Featured (Hero spotlight)
                  </span>
                </label>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>Order:</span>
                  <input
                    type="number"
                    className="admin-input"
                    style={{ width: 70, padding: "6px 10px" }}
                    value={form.order ?? 0}
                    onChange={(e) => set({ order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Panel Footer */}
              <div style={panelFooterStyle}>
                <button
                  type="button"
                  onClick={closePanel}
                  disabled={formLoading}
                  className="admin-btn admin-btn-ghost"
                  style={{ padding: "10px 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="admin-btn admin-btn-primary"
                  style={{
                    padding: "10px 28px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "none",
                  }}
                >
                  {formLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : panelMode === "add" ? (
                    "Publish Article"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default BlogsManager;
