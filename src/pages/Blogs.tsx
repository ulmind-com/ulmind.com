import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  Clock,
  ArrowRight,
  X,
  BookOpen,
  Sparkles,
  Building2,
  Compass,
  Code2,
  Bot,
  Terminal,
  HeartPulse,
  Smartphone,
  Cloud,
  Rocket,
  SlidersHorizontal,
  Globe,
  Database,
  Cpu,
  Layers,
  Palette,
  RotateCcw,
  Rss,
} from "lucide-react";
import { getBlogsAPI, BlogPost } from "@/admin/lib/api";
import { FALLBACK_BLOGS } from "@/data/blogData";
import BlogHeroIllustration from "@/components/blog/BlogHeroIllustration";
import BlogFilterDropdown, { DropdownOption } from "@/components/blog/BlogFilterDropdown";

const INDUSTRY_OPTIONS: DropdownOption[] = [
  { label: "All Industries", value: "All Industries", icon: Compass, desc: "All domain sectors" },
  { label: "Software Engineering", value: "Software Engineering", icon: Code2, desc: "Architecture & patterns" },
  { label: "AI Integration", value: "AI Integration", icon: Bot, desc: "LLMs, RAG & Agents" },
  { label: "Custom Software", value: "Custom Software", icon: Terminal, desc: "Bespoke business apps" },
  { label: "Healthcare & Lifesciences", value: "Healthcare & Lifesciences", icon: HeartPulse, desc: "HIPAA & healthtech" },
  { label: "Mobile Development", value: "Mobile Development", icon: Smartphone, desc: "iOS, Android & Flutter" },
  { label: "Cloud & DevOps", value: "Cloud & DevOps", icon: Cloud, desc: "AWS, Docker & K8s" },
  { label: "Product Strategy", value: "Product Strategy", icon: Rocket, desc: "MVPs & Roadmaps" },
];

const SERVICE_OPTIONS: DropdownOption[] = [
  { label: "All Services", value: "All Services", icon: SlidersHorizontal, desc: "All ULMiND services" },
  { label: "Web Development", value: "Web Development", icon: Globe, desc: "Full-stack web apps" },
  { label: "Mobile Apps", value: "Mobile Apps", icon: Smartphone, desc: "Native & Cross-platform" },
  { label: "Cloud Solutions", value: "Cloud Solutions", icon: Cloud, desc: "Cloud infrastructure" },
  { label: "Backend Development", value: "Backend Development", icon: Database, desc: "High-scale APIs" },
  { label: "AI & Machine Learning", value: "AI & Machine Learning", icon: Cpu, desc: "Intelligent systems" },
  { label: "Custom Software", value: "Custom Software", icon: Layers, desc: "Enterprise tooling" },
  { label: "UI/UX Design", value: "UI/UX Design", icon: Palette, desc: "User experience & UI" },
];

const POPULAR_TAGS = [
  "#AI Integration",
  "#ChatGPT",
  "#Custom Software",
  "#Mobile Dev",
  "#Healthcare Tech",
  "#Cloud Security",
  "#React Native",
  "#ISO 9001:2015",
];

export const Blogs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [loading, setLoading] = useState(true);

  // Active filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedIndustry, setSelectedIndustry] = useState(
    searchParams.get("industry") || "All Industries"
  );
  const [selectedService, setSelectedService] = useState(
    searchParams.get("service") || "All Services"
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get("tag") || null
  );

  // Fetch blogs from API with fallback
  useEffect(() => {
    let mounted = true;
    const fetchBlogs = async () => {
      try {
        const data = await getBlogsAPI();
        if (mounted && data && data.length > 0) {
          setBlogs(data);
        }
      } catch (err) {
        console.warn("Using offline blog cache:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync state with search params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (selectedIndustry !== "All Industries") params.industry = selectedIndustry;
    if (selectedService !== "All Services") params.service = selectedService;
    if (selectedTag) params.tag = selectedTag;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedIndustry, selectedService, selectedTag]);

  // Client-side filtering for instantaneous responsiveness
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Industry match
      if (
        selectedIndustry !== "All Industries" &&
        blog.category !== selectedIndustry
      ) {
        return false;
      }

      // Service match
      if (
        selectedService !== "All Services" &&
        blog.service !== selectedService
      ) {
        return false;
      }

      // Tag filter
      if (selectedTag) {
        const normalizedTag = selectedTag.toLowerCase().replace(/^#/, "");
        const hasTag = blog.tags?.some((t) =>
          t.toLowerCase().replace(/^#/, "").includes(normalizedTag)
        );
        if (!hasTag) return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = blog.title.toLowerCase().includes(q);
        const matchExcerpt = blog.excerpt?.toLowerCase().includes(q);
        const matchAuthor = blog.author?.toLowerCase().includes(q);
        const matchCategory = blog.category?.toLowerCase().includes(q);
        const matchTags = blog.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchCategory && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [blogs, selectedIndustry, selectedService, selectedTag, searchQuery]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("All Industries");
    setSelectedService("All Services");
    setSelectedTag(null);
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedIndustry !== "All Industries" ||
    selectedService !== "All Services" ||
    selectedTag !== null;

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 sm:pt-24 pb-20 transition-colors duration-300">
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 sm:mb-3 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-foreground transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight size={13} className="opacity-50" />
          <span className="text-foreground font-semibold">Blogs</span>
        </nav>

        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          title="Subscribe to RSS Feed"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all"
        >
          <Rss size={12} className="text-amber-500" />
          <span>RSS Feed</span>
        </a>
      </div>

      {/* ── Hero Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-3 sm:space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={12} className="text-amber-500 animate-pulse" /> Engineering Knowledge & Case Studies
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.14]">
              Insights That Drive <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Better Tech Decisions
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Explore blogs on software development, product engineering, cloud,
              DevOps, AI integration, and actionable architectural lessons from
              the ULMiND engineering pod.
            </p>
          </motion.div>

          {/* Right Illustration Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <BlogHeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* ── Ultra Pro Search & Filter Controls (Completely Reimagined) ── */}
      <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="space-y-4">
          {/* Main Controls Row: Search Capsule + Standalone Dropdowns */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3.5">
            {/* ── Search Input Capsule ── */}
            <div className="relative flex-1 group">
              <div className="relative h-14 rounded-2xl bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 focus-within:shadow-lg focus-within:shadow-amber-500/10 transition-all duration-300 flex items-center px-4 gap-3">
                {/* Search Icon */}
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-focus-within:text-amber-500 group-focus-within:bg-amber-500/10 transition-colors shrink-0">
                  <Search size={17} />
                </div>

                {/* Input Text Field */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, or keywords..."
                  className="w-full bg-transparent border-none text-foreground text-sm sm:text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 font-medium"
                />

                {/* Clear (X) button when typing */}
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="w-6 h-6 rounded-full bg-zinc-150 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors shrink-0"
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}

                {/* Orange/Amber Search Action Button (Matching screenshot) */}
                <button
                  type="button"
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shrink-0"
                >
                  <Search size={14} className="stroke-[2.5]" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* ── Custom Animated Dropdown Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <BlogFilterDropdown
                title="Industry"
                icon={Building2}
                options={INDUSTRY_OPTIONS}
                selectedValue={selectedIndustry}
                onSelect={setSelectedIndustry}
                accentColor="amber"
                align="left"
              />

              <BlogFilterDropdown
                title="Service"
                icon={Sparkles}
                options={SERVICE_OPTIONS}
                selectedValue={selectedService}
                onSelect={setSelectedService}
                accentColor="orange"
                align="right"
              />
            </div>
          </div>

          {/* ── Popular Tags & Filter Badges Bar ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5 mr-1">
                <Sparkles size={12} className="text-amber-500" /> Popular:
              </span>
              {POPULAR_TAGS.map((tag) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(active ? null : tag)}
                    className={`text-xs px-3 py-1.5 rounded-xl transition-all duration-200 font-semibold border ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md shadow-amber-500/25 scale-105"
                        : "bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200/80 dark:border-zinc-800/80 shadow-sm"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Active Filters Reset Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {filteredBlogs.length} {filteredBlogs.length === 1 ? "result" : "results"} found
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold border border-red-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <RotateCcw size={12} /> Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Blog Grid (3 Columns Layout Matching Screenshot) ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-border/60 bg-card p-4 space-y-4 animate-pulse"
              >
                <div className="w-full h-48 rounded-xl bg-muted" />
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-6 w-5/6 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40 max-w-xl mx-auto">
            <BookOpen
              size={48}
              className="mx-auto text-muted-foreground/40 mb-4"
            />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No matching articles found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your search terms, changing the industry or service
              filter, or resetting your filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/25"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredBlogs.map((blog, idx) => (
                <motion.article
                  key={blog._id || blog.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                  className="group relative flex flex-col bg-card hover:bg-card/90 dark:bg-zinc-900/70 border border-border/60 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                    {blog.coverImage?.url ? (
                      <img
                        src={blog.coverImage.url}
                        alt={blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-muted-foreground/40">
                        <BookOpen size={40} />
                      </div>
                    )}

                    {/* Dark gradient shadow on bottom of image for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Category Pill Over Image */}
                    {blog.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                          {blog.category}
                        </span>
                      </div>
                    )}

                    {/* Read Time Overlay */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 backdrop-blur-md text-zinc-300">
                      <Clock size={12} />
                      {blog.readTime || "5 min read"}
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Tags row */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                            className="text-xs font-semibold text-muted-foreground hover:text-amber-500 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-200 line-clamp-2 leading-snug mb-3">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
                      {blog.excerpt}
                    </p>

                    {/* Footer Author & Action */}
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs overflow-hidden border border-amber-500/30">
                          {blog.authorAvatar ? (
                            <img
                              src={blog.authorAvatar}
                              alt={blog.author}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            blog.author?.charAt(0) || "U"
                          )}
                        </div>
                        <span className="font-semibold text-foreground/90">
                          {blog.author || "ULMIND Team"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-semibold text-amber-500 group-hover:translate-x-1 transition-transform duration-200">
                        Read More <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ── Newsletter / Consultation Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-amber-500/30 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Stay Ahead of the Curve
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get High-Impact Engineering Insights Delivered Monthly
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              No marketing noise. Only deep architectural breakdowns, cloud
              blueprints, and engineering lessons straight from our tech team.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your work email address"
                className="h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-sm text-white transition-all shadow-lg shadow-amber-500/30 whitespace-nowrap"
              >
                Join Insights
              </button>
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
};

export default Blogs;
