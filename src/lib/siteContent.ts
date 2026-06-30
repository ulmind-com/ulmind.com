/* ──────────────────────────────────────────────────────────────
   ULMiND — Public Website Content client
   Read-only fetchers for CMS-managed content (stats, reviews,
   portfolio projects). No auth required — these are public GETs.
   Mirrors the base-URL resolution used by the admin API client.
   ────────────────────────────────────────────────────────────── */

const getBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL as string;
  if (import.meta.env.DEV) return "/api/v1";
  return "https://ulmind-backend.onrender.com/api/v1";
};

export interface SiteStat {
  _id: string;
  value: string;
  label: string;
  order: number;
}

export interface SiteTestimonial {
  _id: string;
  name: string;
  username: string;
  body: string;
  rating: number;
  order: number;
  img?: { url: string; public_id: string };
}

export interface SitePortfolioProject {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  timeline: string;
  teamSize: string;
  demoUrl?: string;
  githubUrl?: string;
  languages: string[];
  technologies: string[];
  order: number;
  image?: { url: string; public_id: string };
}

const getJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${getBaseUrl()}${path}`, { mode: "cors" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export const fetchSiteStats = () => getJson<SiteStat[]>("/website-content/stats");
export const fetchSiteTestimonials = () => getJson<SiteTestimonial[]>("/website-content/testimonials");
export const fetchSitePortfolioProjects = () => getJson<SitePortfolioProject[]>("/website-content/projects");
