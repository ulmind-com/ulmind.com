import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import BlurBlob from "@/components/BlurBlob";
import { useState, useEffect } from "react";
import { getTestimonialsAPI } from "@/admin/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Metric {
  label: string;
  score: string;
}

interface Review {
  name: string;
  username: string;
  body: string;
  rating: number;
  img?: string;
  title?: string;
  location?: string;
  flag?: string;
  metrics?: Metric[];
  source?: string;
  companyLogo?: string;
  sourceLogo?: string;
}

const defaultReviews: Review[] = [
  {
    name: "Milan Kumar Mondal",
    username: "Owner, Maa Laxmirani Restaurant",
    title: "A modern site that boosted our orders",
    body: "Great experience with ULMIND, they built a modern website that improved our online ordering and brought us more customers.",
    img: "/MLR.png",
    rating: 5,
    location: "West Bengal, India",
    flag: "🇮🇳",
    metrics: [{ label: "Quality", score: "5.0" }, { label: "Support", score: "5.0" }],
    source: "Google",
  },
  {
    name: "Dibyendu Pramanik",
    username: "Owner, Jamai Da Hotel",
    title: "Improved our online presence",
    body: "A nice experience with a well-made website that improved our online presence.",
    img: "/JamaiDa.png",
    rating: 4,
    location: "West Bengal, India",
    flag: "🇮🇳",
    metrics: [{ label: "Quality", score: "4.0" }],
    source: "Google",
  },
  {
    name: "Ayan Bagdi",
    username: "Engineer, Smart Invest Solutions",
    title: "Proper guidance and quick response",
    body: "Very satisfied with the service. Proper guidance and quick response throughout the project.",
    img: "/SIS2.png",
    rating: 5,
    location: "India",
    flag: "🇮🇳",
    metrics: [{ label: "Quality", score: "5.0" }, { label: "Cost", score: "5.0" }],
    source: "Google",
  },
  {
    name: "Mithilesh Kumar Singh",
    username: "Reporter, JharkhandBihar Update",
    title: "Professional and quick delivery",
    body: "Professional and quick delivery. Excellent work.",
    img: "/JB_update.png",
    rating: 5,
    location: "Jharkhand, India",
    flag: "🇮🇳",
    source: "Google",
  },
  {
    name: "Surya Dutta",
    username: "Professor, Smart Invest Solutions",
    title: "Clear guidance and honest advice",
    body: "Clear guidance and honest advice at every step.",
    img: "/SIS.png",
    rating: 4,
    location: "India",
    flag: "🇮🇳",
    metrics: [{ label: "Quality", score: "4.0" }],
    source: "Google",
  },
  {
    name: "Shatadip Mukherjee",
    username: "Medical Representative, Smart Invest Solutions",
    title: "Very good guidance & services",
    body: "Very good guidance & services. Highly recommended.",
    img: "/SIS3.png",
    rating: 5,
    location: "India",
    flag: "🇮🇳",
    source: "Google",
  },
];

/* ⭐ Star renderer */
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        className={cn("h-5 w-5", i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600")}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 1.5l2.47 5.26 5.78.78-4.23 4.02 1.05 5.69L10 14.9l-5.07 2.65 1.05-5.69L1.75 7.54l5.78-.78L10 1.5z" />
      </svg>
    ))}
  </div>
);

/* Review source badge — known brand mark, custom logo, or plain text */
const SourceBadge = ({ source, sourceLogo }: { source?: string; sourceLogo?: string }) => {
  if (sourceLogo) {
    return <img src={sourceLogo} alt={source || "source"} className="h-7 max-w-[90px] object-contain object-right" />;
  }
  switch (source?.toLowerCase()) {
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-label="Google">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
      );
    case "trustpilot":
      return (
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#00B67A]" fill="currentColor" aria-hidden="true">
            <path d="M10 1.5l2.47 5.26 5.78.78-4.23 4.02 1.05 5.69L10 14.9l-5.07 2.65 1.05-5.69L1.75 7.54l5.78-.78L10 1.5z" />
          </svg>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Trustpilot</span>
        </div>
      );
    case "clutch":
      return <span className="text-base font-extrabold tracking-tight text-[#FF3D2E]">Clutch</span>;
    default:
      return source ? (
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{source}</span>
      ) : null;
  }
};

const Divider = () => <div className="my-5 h-px w-full bg-gray-100 dark:bg-white/10" />;

const ReviewCard = ({
  img,
  companyLogo,
  name,
  username,
  body,
  rating,
  title,
  location,
  flag,
  metrics,
  source,
  sourceLogo,
}: Review) => {
  const maxLength = 200;
  const isLong = body.length > maxLength;
  const displayBody = isLong ? body.slice(0, maxLength) + "..." : body;
  const avatar = img || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  return (
    <Dialog>
      <figure className="relative flex w-[88vw] max-w-[460px] shrink-0 flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg sm:w-[420px] md:w-[460px] dark:border-white/10 dark:bg-neutral-900">
        {/* Top: company logo + location */}
        <div className="flex min-h-[32px] items-center justify-between gap-3">
          {companyLogo ? (
            <img src={companyLogo} alt={name} className="h-8 max-w-[160px] object-contain object-left" />
          ) : (
            <span className="truncate text-base font-bold text-gray-900 dark:text-white">{name}</span>
          )}
          {location && (
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              {location}
              {flag && <span className="text-sm leading-none">{flag}</span>}
            </span>
          )}
        </div>

        <Divider />

        {/* Headline */}
        {title && <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 dark:text-white">{title}</h3>}

        {/* Quote */}
        <blockquote className="flex-1 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
          "{displayBody}"
          {isLong && (
            <DialogTrigger asChild>
              <span className="ml-1 cursor-pointer font-semibold text-primary hover:underline">Read more</span>
            </DialogTrigger>
          )}
        </blockquote>

        {/* Rating + metrics */}
        <div className="mt-6 flex items-end justify-between gap-4">
          <Stars rating={rating} />
          {metrics && metrics.length > 0 && (
            <div className="flex gap-5">
              {metrics.slice(0, 3).map((m, i) => (
                <div key={i} className="text-right">
                  <div className="text-lg font-extrabold leading-none text-gray-900 dark:text-white">{m.score}</div>
                  <div className="mt-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Author + source */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              className="h-11 w-11 rounded-full object-cover"
              width="44"
              height="44"
              alt={name}
              src={avatar}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
              }}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-gray-900 dark:text-white">{name}</div>
              {username && <div className="truncate text-xs text-gray-500 dark:text-gray-400">{username}</div>}
            </div>
          </div>
          <div className="shrink-0">
            <SourceBadge source={source} sourceLogo={sourceLogo} />
          </div>
        </div>
      </figure>

      {isLong && (
        <DialogContent className="z-[99999] max-h-[80vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <div className="mb-2 flex items-start gap-3">
              <img
                className="h-10 w-10 rounded-full object-cover"
                alt={name}
                src={avatar}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
                }}
              />
              <div className="flex flex-col text-left">
                <DialogTitle className="text-lg">{name}</DialogTitle>
                <p className="text-sm font-medium text-muted-foreground">{username}</p>
                <div className="mt-1">
                  <Stars rating={rating} />
                </div>
              </div>
            </div>
          </DialogHeader>
          {title && <h4 className="mb-2 text-base font-bold text-foreground">{title}</h4>}
          <div className="text-sm leading-relaxed text-foreground">{body}</div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  useEffect(() => {
    getTestimonialsAPI()
      .then((data) => {
        if (data.length > 0) {
          const formatted: Review[] = data.map((r) => ({
            name: r.name,
            username: r.username,
            body: r.body,
            rating: r.rating,
            img: r.img?.url || "/placeholder-user.jpg",
            title: r.title,
            location: r.location,
            flag: r.flag,
            metrics: r.metrics,
            source: r.source,
            companyLogo: r.companyLogo?.url,
            sourceLogo: r.sourceLogo?.url,
          }));
          setReviews(formatted);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative max-w-[100vw] overflow-hidden py-20">
      <BlurBlob position={{ top: "30%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-pink-300" opacityClass="opacity-20" />
      <BlurBlob position={{ top: "70%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-200" opacityClass="opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Real feedback from clients who trusted ULMIND with their projects.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Single row → scrolls right to left automatically */}
        <Marquee pauseOnHover className="[--duration:55s] [--gap:2rem]">
          {reviews.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};
