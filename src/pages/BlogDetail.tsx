import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ChevronRight,
  Clock,
  ArrowLeft,
  Calendar,
  Share2,
  Check,
  Copy,
  BookOpen,
  Eye,
  Sparkles,
  ArrowRight,
  Linkedin,
  Twitter,
  MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBlogBySlugAPI, getBlogsAPI, BlogPost } from "@/admin/lib/api";
import { FALLBACK_BLOGS } from "@/data/blogData";

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Load single blog post & other blogs for recommendations
  useEffect(() => {
    let mounted = true;
    const fetchPost = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // First check local fallback
      const localMatch = FALLBACK_BLOGS.find((b) => b.slug === slug || b._id === slug);
      if (localMatch) {
        setBlog(localMatch);
      }

      try {
        if (slug) {
          const remoteBlog = await getBlogBySlugAPI(slug);
          if (mounted && remoteBlog) {
            setBlog(remoteBlog);
          }
        }
        const otherBlogs = await getBlogsAPI();
        if (mounted && otherBlogs && otherBlogs.length > 0) {
          setAllBlogs(otherBlogs);
        }
      } catch (err) {
        console.warn("Could not fetch remote blog, using cache:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Extract headings for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!blog?.content) return [];
    const lines = blog.content.split("\n");
    const headings: { id: string; text: string; level: number }[] = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        headings.push({ id, text, level });
      }
    });
    return headings;
  }, [blog?.content]);

  // Related articles (matching category, excluding current)
  const relatedArticles = useMemo(() => {
    if (!blog) return [];
    return allBlogs
      .filter((b) => b.slug !== blog.slug && b._id !== blog._id)
      .slice(0, 3);
  }, [blog, allBlogs]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    if (!blog) return;
    const text = encodeURIComponent(`Read "${blog.title}" on ULMiND Tech Insights:\n`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank"
    );
  };

  const handleShareWhatsApp = () => {
    if (!blog) return;
    const text = encodeURIComponent(
      `Check out this article: "${blog.title}"\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  if (loading && !blog) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">Loading insight...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 space-y-4">
          <BookOpen size={48} className="mx-auto text-muted-foreground/40" />
          <h2 className="text-2xl font-bold text-foreground">Blog Post Not Found</h2>
          <p className="text-muted-foreground text-sm">
            The article you are looking for may have been moved, renamed, or unpublished.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/25"
          >
            <ArrowLeft size={16} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 sm:pt-24 pb-20 transition-colors duration-300 relative">
      {/* ── Fixed Reading Progress Bar At Top ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 origin-left z-50 shadow-md"
      />

      {/* ── Breadcrumb ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="opacity-50" />
          <Link to="/blogs" className="hover:text-foreground transition-colors">
            Blogs
          </Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-foreground font-semibold truncate max-w-[240px] sm:max-w-[380px]">
            {blog.title}
          </span>
        </nav>
      </div>

      {/* ── Article Header ── */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="space-y-6">
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              {blog.category}
            </span>
            {blog.service && (
              <span className="px-3 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/50">
                {blog.service}
              </span>
            )}
            {blog.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {blog.title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed border-l-2 border-amber-500 pl-4 py-1 italic">
            {blog.excerpt}
          </p>

          {/* Author & Metadata Row */}
          <div className="pt-4 border-t border-b border-border/60 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center overflow-hidden border border-amber-500/30">
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
              <div>
                <div className="font-bold text-foreground text-sm sm:text-base">
                  {blog.author}
                </div>
                <div className="text-xs text-muted-foreground">
                  {blog.authorRole || "ULMIND Engineering Lead"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-amber-500" />
                <span>{blog.readTime || "5 min read"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={15} className="text-muted-foreground" />
                <span>{(blog.views || 0).toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Featured Cover Image ── */}
      {blog.coverImage?.url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-zinc-950">
            <img
              src={blog.coverImage.url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      )}

      {/* ── Article Content Area & Sidebar Layout ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Body */}
          <article className="lg:col-span-12 space-y-8">
            {/* Markdown rendered body with custom styling */}
            <div className="prose prose-zinc dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mb-6
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/60 prose-h2:pb-2
              prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-amber-500 hover:prose-a:underline prose-a:font-semibold
              prose-strong:text-foreground prose-strong:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-500/5 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:italic
              prose-code:text-amber-500 dark:prose-code:text-amber-400 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/80 prose-pre:rounded-2xl prose-pre:p-5 prose-pre:shadow-xl
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:text-muted-foreground
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:text-muted-foreground
              prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border/60
              prose-th:border prose-th:border-border/60 prose-th:p-3 prose-th:bg-muted/50 prose-th:text-foreground prose-th:font-semibold
              prose-td:border prose-td:border-border/60 prose-td:p-3 prose-td:text-muted-foreground
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content || ""}
              </ReactMarkdown>
            </div>

            {/* Social Share & Copy Link Bar */}
            <div className="pt-8 border-t border-border/60 mt-12 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
                  Share Article:
                </span>
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="w-9 h-9 rounded-full bg-card hover:bg-muted border border-border/80 flex items-center justify-center text-foreground hover:text-amber-500 transition-colors shadow-sm"
                  title="Share on Twitter / X"
                >
                  <Twitter size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  className="w-9 h-9 rounded-full bg-card hover:bg-muted border border-border/80 flex items-center justify-center text-foreground hover:text-amber-500 transition-colors shadow-sm"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-9 h-9 rounded-full bg-card hover:bg-muted border border-border/80 flex items-center justify-center text-foreground hover:text-emerald-500 transition-colors shadow-sm"
                  title="Share on WhatsApp"
                >
                  <MessageCircle size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card hover:bg-muted border border-border/80 text-xs font-semibold text-foreground transition-all shadow-sm ml-2"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Link
                    </>
                  )}
                </button>
              </div>

              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors"
              >
                <ArrowLeft size={16} /> All Articles
              </Link>
            </div>

            {/* Author Bio Box */}
            <div className="mt-10 rounded-2xl bg-card/60 dark:bg-zinc-900/60 border border-border/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-extrabold text-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
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
              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Written by
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {blog.author}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {blog.authorRole || "Core Technologist at ULMiND"}. Writing about
                  software architectures, product scalability, and cutting-edge
                  engineering paradigms.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all whitespace-nowrap self-stretch sm:self-auto text-center"
              >
                Discuss a Project
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* ── Related Articles Section ── */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-border/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Continue Reading
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
                Recommended Insights
              </h2>
            </div>
            <Link
              to="/blogs"
              className="text-xs sm:text-sm font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((rel) => (
              <div
                key={rel.slug}
                onClick={() => navigate(`/blogs/${rel.slug}`)}
                className="group bg-card hover:bg-card/90 dark:bg-zinc-900/60 border border-border/60 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                  {rel.coverImage?.url ? (
                    <img
                      src={rel.coverImage.url}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-muted-foreground/30">
                      <BookOpen size={32} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {rel.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-foreground group-hover:text-amber-500 transition-colors line-clamp-2 mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                    {rel.excerpt}
                  </p>
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{rel.readTime || "5 min read"}</span>
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
