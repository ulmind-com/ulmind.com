import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import {
  MapPin,
  Clock,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CTASection } from "@/components/Sections/CTASection";
import BlurBlob from "@/components/BlurBlob";
import CareerApplicationForm from "@/components/CareerApplicationForm";

/* ════════════════════════════════════════════════
   Job Data
   ════════════════════════════════════════════════ */

const jobOpenings = [
  {
    id: 1,
    title: "Java Developer",
    department: "Backend Development",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    skills: ["Java", "Spring Boot", "Microservices", "SQL", "REST API"],
    description: "We're looking for a Java developer to build scalable backend services.",
    fullDescription: "At ULMIND, our Java Developers form the core of our technical backend team. You will be responsible for defining, designing, and implementing high-availability, mission-critical microservices and backend systems. Your day-to-day will involve collaborating with cross-functional engineering teams, architecting scalable data pipelines, optimizing database performance, and writing clean, scalable Java code. If you are passionate about building robust, secure, and fast backend services that power modern web applications, this role is for you.",
    requirements: [
      "2+ years of proven hands-on experience in Software Development and specifically Java (Java 11+ preferred).",
      "Deep expertise in the Spring ecosystem (Spring Boot, Spring MVC, Spring Security, Spring Data).",
      "Strong understanding of Object-Oriented Programming (OOP) concepts, Design Patterns, and clean architecture.",
      "Experience in designing, building, and consuming RESTful APIs and building robust microservices.",
      "Solid understanding of relational databases (MySQL, PostgreSQL) and NoSQL databases (MongoDB, Redis).",
      "Proficiency with version control (Git) and CI/CD pipelines (Jenkins, GitHub Actions, Docker).",
      "Experience with testing frameworks (JUnit, Mockito) to ensure code reliability.",
      "Excellent analytical, problem-solving, and cross-team communication skills."
    ],
    degrees: [
      "B.Tech / B.E. / M.Tech in Computer Science, Information Technology, or a related technical field.",
      "Relevant certifications in Java Development (e.g., Oracle Certified Professional) or Cloud platforms (AWS/Azure) are a strong plus."
    ],
    accent: "cyan",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "Git"],
    description: "Work across frontend and backend to build complete, scalable web applications.",
    fullDescription: "As a Full Stack Developer at ULMIND, you will play a critical role in bringing our innovative web applications to life. You will be responsible for the entire software development lifecycle—from conceptualizing and designing responsive user interfaces to architecting robust, scalable backend services. You'll work in an agile environment alongside UI/UX designers, product managers, and fellow engineers to deliver seamless, high-performance digital experiences. We value developers who are product-minded and care deeply about the end-user experience.",
    requirements: [
      "3+ years of professional experience as a Full Stack Developer or in a similar comprehensive engineering role.",
      "Expertise in modern frontend frameworks and libraries, specifically React.js, Next.js, and state management.",
      "Strong proficiency in backend development using Node.js, Express.js, and designing RESTful or GraphQL APIs.",
      "Deep understanding of web fundamentals: HTML5, modern CSS (Tailwind CSS), and JavaScript/TypeScript.",
      "Extensive experience with both relational (PostgreSQL, MySQL) and NoSQL (MongoDB) databases.",
      "Familiarity with containerization (Docker), cloud deployment architectures, and modern CI/CD practices.",
      "Experience in writing clean, well-tested code using Jest, Cypress, or similar testing frameworks.",
      "Ability to troubleshoot, debug, and optimize performance across the entire web stack."
    ],
    degrees: [
      "B.Sc / B.Tech in Computer Science, Engineering, or a highly relevant quantitative field.",
      "Demonstrable portfolio of complex full-stack web applications deployed to production."
    ],
    accent: "violet",
  },
  {
    id: 3,
    title: "Mobile App Developer",
    department: "Mobile Development",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    skills: ["React Native", "Flutter", "Android", "iOS"],
    description: "Build high-quality mobile applications for Android and iOS platforms.",
    fullDescription: "We are seeking a passionate Mobile App Developer to lead the development of ULMIND's next-generation mobile applications. In this role, you will be responsible for creating high-quality, pixel-perfect, and highly performant mobile experiences for both iOS and Android platforms. You will work closely with our design and product teams to translate beautiful UI/UX designs into functional, smooth, and interactive applications. Your work will directly impact how our users interact with our digital products on the go.",
    requirements: [
      "2+ years of professional experience in mobile app development with a strong portfolio of apps published on the App Store and Google Play.",
      "Exceptional proficiency in cross-platform development frameworks, primarily React Native or Flutter.",
      "Strong understanding of mobile UI design principles, human interface guidelines, and material design.",
      "Experience integrating with RESTful APIs, third-party libraries, Firebase, and payment gateways.",
      "Proficient in state management solutions (Redux, MobX, Provider, or Riverpod).",
      "Knowledge of native build tools (XCode, Android Studio) and the ability to write native bridging code.",
      "Experience with offline storage, threading, and performance tuning for mobile environments.",
      "Familiarity with mobile CI/CD pipelines (Fastlane, Bitrise, or GitHub Actions)."
    ],
    degrees: [
      "Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.",
      "Specialized certifications in mobile development (React Native/Flutter) are a bonus."
    ],
    accent: "emerald",
  },
  {
    id: 4,
    title: "Graphics Designer",
    department: "Design",
    location: "Remote",
    type: "Part-time / Full-time",
    experience: "2+ years",
    skills: ["Photoshop", "Illustrator", "Figma", "Brand Design"],
    description: "Create visually appealing designs for web, social media, and branding.",
    fullDescription: "As a Graphics Designer at ULMIND, your creativity and visual flair will directly shape our brand's identity and user perception. You will conceptualize and create stunning visual assets across a wide range of mediums—from digital marketing campaigns, social media content, and website illustrations to brand collateral and UI mockups. We are looking for an imaginative designer who possesses a keen eye for aesthetics, typography, and color theory, and who can translate abstract concepts into compelling visual stories.",
    requirements: [
      "2+ years of proven professional experience as a Graphic Designer, Visual Designer, or Brand Designer.",
      "A strong, diverse portfolio showcasing a wide range of design projects (branding, digital, print, and social media).",
      "Expert-level proficiency in industry-standard design tools including Adobe Creative Suite (Photoshop, Illustrator) and Figma.",
      "Deep understanding of visual hierarchy, layout principles, typography, and color psychology.",
      "Experience in creating assets for modern digital platforms with a strong grasp of required specifications.",
      "Basic understanding of UI/UX principles and the ability to collaborate effectively with frontend developers.",
      "Excellent time management skills with the ability to handle multiple creative projects simultaneously.",
      "Strong communication skills to articulate design decisions and receive constructive feedback gracefully."
    ],
    degrees: [
      "B.F.A / B.Des in Graphic Design, Visual Arts, Fine Arts, or a related creative discipline.",
      "A comprehensive digital portfolio link must be provided alongside your application."
    ],
    accent: "rose",
  },
  {
    id: 5,
    title: "Video Editor",
    department: "Media & Content",
    location: "Remote",
    type: "Part-time / Contract",
    experience: "2+ years",
    skills: ["Premiere Pro", "After Effects", "Motion Graphics"],
    description: "Edit promotional videos, reels, and digital marketing content.",
    fullDescription: "ULMIND is looking for a talented and creative Video Editor to produce engaging, high-quality video content that resonates with our audience. You will be responsible for assembling recorded footage, applying cinematic edits, adding motion graphics, and finalizing audio to create compelling promotional videos, social media reels, and corporate presentations. The ideal candidate has a strong storytelling instinct, impeccable timing, and a deep understanding of how to capture and retain viewer attention in the fast-paced digital landscape.",
    requirements: [
      "2+ years of professional experience as a Video Editor, Content Creator, or Motion Graphics Artist.",
      "A standout showreel/portfolio demonstrating exceptional video editing, pacing, and storytelling abilities.",
      "Advanced proficiency with industry-standard editing software, particularly Adobe Premiere Pro and After Effects.",
      "Strong skills in color grading, audio mixing, and sound design to ensure broadcast-quality output.",
      "Experience in creating dynamic motion graphics, lower thirds, and animated typography.",
      "In-depth knowledge of current video trends across platforms like YouTube, Instagram Reels, and TikTok.",
      "Solid understanding of various video formats, codecs, and optimal export settings for different platforms.",
      "Ability to work efficiently under tight deadlines while maintaining a high standard of creative quality."
    ],
    degrees: [
      "Bachelor's degree in Film Studies, Cinematography, Media Production, or a related field.",
      "Demonstrable practical experience and a strong portfolio often outweigh formal educational requirements."
    ],
    accent: "amber",
  },
];

/* ════════════════════════════════════════════════
   Accent colour map
   ════════════════════════════════════════════════ */

const accentMap: Record<
  string,
  {
    badge: string;
    badgeDot: string;
    skillBg: string;
    skillText: string;
    btnGrad: string;
    btnShadow: string;
    iconBg: string;
    iconText: string;
    borderHover: string;
    glowBg: string;
  }
> = {
  cyan: {
    badge: "bg-cyan-100/80 dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-200 border-cyan-200/60 dark:border-cyan-400/40",
    badgeDot: "bg-cyan-500 dark:bg-cyan-300",
    skillBg: "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200/50 dark:border-cyan-500/15",
    skillText: "text-cyan-700 dark:text-cyan-300",
    btnGrad: "from-cyan-500 to-cyan-600",
    btnShadow: "shadow-[0_0_20px_rgba(6,182,212,0.35)]",
    iconBg: "bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-600/10",
    iconText: "text-cyan-600 dark:text-cyan-400",
    borderHover: "hover:border-cyan-300/60 dark:hover:border-cyan-500/25",
    glowBg: "bg-cyan-400/20 dark:bg-cyan-500/10",
  },
  violet: {
    badge: "bg-violet-100/80 dark:bg-violet-400/20 text-violet-700 dark:text-violet-200 border-violet-200/60 dark:border-violet-400/40",
    badgeDot: "bg-violet-500 dark:bg-violet-300",
    skillBg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200/50 dark:border-violet-500/15",
    skillText: "text-violet-700 dark:text-violet-300",
    btnGrad: "from-violet-500 to-violet-600",
    btnShadow: "shadow-[0_0_20px_rgba(139,92,246,0.35)]",
    iconBg: "bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-500/20 dark:to-violet-600/10",
    iconText: "text-violet-600 dark:text-violet-400",
    borderHover: "hover:border-violet-300/60 dark:hover:border-violet-500/25",
    glowBg: "bg-violet-400/20 dark:bg-violet-500/10",
  },
  emerald: {
    badge: "bg-emerald-100/80 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-400/40",
    badgeDot: "bg-emerald-500 dark:bg-emerald-300",
    skillBg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-500/15",
    skillText: "text-emerald-700 dark:text-emerald-300",
    btnGrad: "from-emerald-500 to-emerald-600",
    btnShadow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-600/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
    borderHover: "hover:border-emerald-300/60 dark:hover:border-emerald-500/25",
    glowBg: "bg-emerald-400/20 dark:bg-emerald-500/10",
  },
  rose: {
    badge: "bg-rose-100/80 dark:bg-rose-400/20 text-rose-700 dark:text-rose-200 border-rose-200/60 dark:border-rose-400/40",
    badgeDot: "bg-rose-500 dark:bg-rose-300",
    skillBg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200/50 dark:border-rose-500/15",
    skillText: "text-rose-700 dark:text-rose-300",
    btnGrad: "from-rose-500 to-rose-600",
    btnShadow: "shadow-[0_0_20px_rgba(244,63,94,0.35)]",
    iconBg: "bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-500/20 dark:to-rose-600/10",
    iconText: "text-rose-600 dark:text-rose-400",
    borderHover: "hover:border-rose-300/60 dark:hover:border-rose-500/25",
    glowBg: "bg-rose-400/20 dark:bg-rose-500/10",
  },
  amber: {
    badge: "bg-amber-100/80 dark:bg-amber-400/20 text-amber-700 dark:text-amber-200 border-amber-200/60 dark:border-amber-400/40",
    badgeDot: "bg-amber-500 dark:bg-amber-300",
    skillBg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200/50 dark:border-amber-500/15",
    skillText: "text-amber-700 dark:text-amber-300",
    btnGrad: "from-amber-500 to-amber-600",
    btnShadow: "shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    iconBg: "bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-600/10",
    iconText: "text-amber-600 dark:text-amber-400",
    borderHover: "hover:border-amber-300/60 dark:hover:border-amber-500/25",
    glowBg: "bg-amber-400/20 dark:bg-amber-500/10",
  },
};

const departmentIcons: Record<string, React.ElementType> = {
  "Backend Development": Zap,
  Engineering: Globe,
  "Mobile Development": Sparkles,
  Design: Sparkles,
  "Media & Content": Sparkles,
};



/* ════════════════════════════════════════════════
   Perks
   ════════════════════════════════════════════════ */
const perks = [
  { icon: Globe, title: "100% Remote", desc: "Work from anywhere in the world" },
  { icon: Users, title: "Great Team", desc: "Collaborate with talented people" },
  { icon: Zap, title: "Fast Growth", desc: "Accelerate your career progress" },
  { icon: Shield, title: "Job Security", desc: "Stable and long-term roles" },
];

/* ════════════════════════════════════════════════
   Career Component
   ════════════════════════════════════════════════ */

const Career = () => {
  const [selectedJob, setSelectedJob] =
    useState<(typeof jobOpenings)[0] | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] =
    useState<(typeof jobOpenings)[0] | null>(null);
  const [arrowAnimData, setArrowAnimData] = useState<object | null>(null);
  const [globeAnimData, setGlobeAnimData] = useState<object | null>(null);
  const [peopleAnimData, setPeopleAnimData] = useState<object | null>(null);
  const [thunderAnimData, setThunderAnimData] = useState<object | null>(null);
  const [securityAnimData, setSecurityAnimData] = useState<object | null>(null);

  const fetchAndRecolor = (path: string, setter: React.Dispatch<React.SetStateAction<object | null>>, forceAll = false) => {
    fetch(path)
      .then((r) => r.json())
      .then((d: any) => {
        const newColor = [0.96078, 0.03137, 0.27843, 1]; // #f50847
        const recolor = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) { obj.forEach(recolor); return; }
          if (obj.ty === 'fl' || obj.ty === 'st') {
            if (obj.c && Array.isArray(obj.c.k) && (obj.c.a === 0 || obj.c.a === undefined)) {
              if (obj.c.k.length === 4) {
                const [r, g, b] = obj.c.k;
                let shouldRecolor = false;
                if (forceAll) {
                  // forceAll: only recolor FILLS (not strokes) to preserve globe shape/borders
                  const isNearBlack = Math.max(r, g, b) < 0.15;
                  shouldRecolor = obj.ty === 'fl' && !isNearBlack;
                } else {
                  const isGreyscale = Math.max(r, g, b) - Math.min(r, g, b) < 0.05;
                  shouldRecolor = !isGreyscale;
                }
                if (shouldRecolor) obj.c.k = newColor;
              }
            }
          }
          Object.values(obj).forEach(recolor);
        };
        recolor(d);
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setter(stripped);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch('/Jason/lottieflow-arrow-08-2-ffffff-easey.json')
      .then((r) => r.json())
      .then((d: any) => {
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setArrowAnimData(stripped);
      })
      .catch(() => {});
    // Globe.json: #f50847 is baked directly into the JSON file — load with plain strip only
    fetch('/Jason/Globe.json')
      .then((r) => r.json())
      .then((d: any) => {
        const stripped = {
          ...d,
          layers: (d.layers ?? []).filter(
            (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
          ),
        };
        setGlobeAnimData(stripped);
      })
      .catch(() => {});
    fetchAndRecolor('/Jason/people.json', setPeopleAnimData);
    fetchAndRecolor('/Jason/thunddder.json', setThunderAnimData);
    fetchAndRecolor('/Jason/Security%20status%20-%20Safe.json', setSecurityAnimData);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ═══════════════════════════════════════════
          SCOPED CSS — liquid glass cards
          ═══════════════════════════════════════════ */}
      <style>{`
        .career-glass-card {
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          contain: layout style;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          transition:
            transform 0.25s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease;
        }
        /* IDLE: Strong liquid glassmorphism */
        :root .career-glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }
        .dark .career-glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }
        /* HOVER: Enhance the effect */
        :root .career-glass-card:hover {
          transform: translateZ(0) translateY(-4px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 100%);
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 12px 40px rgba(31, 38, 135, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .dark .career-glass-card:hover {
          transform: translateZ(0) translateY(-4px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .career-glass-highlight {
          position: absolute;
          top: 0; left: 20px; right: 20px;
          height: 1px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent);
          opacity: 0.6;
          pointer-events: none;
        }
        .dark .career-glass-highlight {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        }

        /* Modal glass — only used when modal is open, GPU cost isolated */
        .career-modal-glass {
          border-radius: 28px;
          overflow: hidden;
        }
        :root .career-modal-glass {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 20px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        .dark .career-modal-glass {
          background: rgba(15,20,30,0.92);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
        }

        /* Perk card — NO idle blur */
        .perk-glass-card {
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          transition:
            transform 0.22s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.22s ease;
        }
        :root .perk-glass-card {
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(255,255,255,0.80);
          box-shadow: 0 2px 14px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90);
        }
        .dark .perk-glass-card {
          background: rgba(20,28,40,0.75);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 2px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        :root .perk-glass-card:hover {
          transform: translateZ(0) translateY(-3px) scale(1.02);
          box-shadow: 0 8px 28px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
        }
        .dark .perk-glass-card:hover {
          transform: translateZ(0) translateY(-3px) scale(1.02);
          box-shadow: 0 8px 30px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-20 pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-[#020b16]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#021124] via-[#021124]/95 to-[#021124]/60" />
        </div>

        <BlurBlob
          position={{ top: "50%", left: "5%" }}
          size={{ width: "600px", height: "600px" }}
          colorClass="bg-cyan-500"
          opacityClass="opacity-30 mix-blend-screen"
          className="z-10"
        />
        <BlurBlob
          position={{ top: "50%", left: "95%" }}
          size={{ width: "600px", height: "600px" }}
          colorClass="bg-fuchsia-500"
          opacityClass="opacity-30 mix-blend-screen"
          className="z-10"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5a5f]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#ff5a5f] uppercase">
                Join Our Team
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
              Build Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a5f] to-pink-400">
                Career
              </span>
            </h1>

            <div className="w-14 h-1 bg-gradient-to-r from-[#ff5a5f] to-pink-400 mb-5 rounded-full" />

            <p className="text-sm sm:text-base lg:text-lg text-gray-300/90 leading-relaxed max-w-lg">
              We partner with leaders to unlock sustainable performance. Come
              architect the future of consulting with us and chart your
              happiness.
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { label: "Open Roles", val: `${jobOpenings.length}+` },
                { label: "Remote", val: "100%" },
                { label: "Team Size", val: "Growing" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold text-white/80"
                >
                  <span className="text-[#ff5a5f] font-black">{s.val}</span>
                  <span className="text-white/50">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden sm:block lg:ml-auto w-full"
          >
            <div className="absolute inset-0 bg-[#ff5a5f] opacity-15 blur-[60px] rounded-full scale-90 translate-y-4" />

            <div
              className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-2xl w-full border border-white/10 z-10 bg-[#0a1120]"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Our Team"
                className="w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ opacity: { duration: 0.5, delay: 0.6 }, scale: { duration: 0.5, delay: 0.6 } }}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#222a36]/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/10 hidden md:flex items-center justify-center z-20 group hover:scale-110 transition-transform"
            >
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY JOIN US — Perks
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-16 relative overflow-hidden bg-background">
        <BlurBlob
          position={{ top: "50%", left: "10%" }}
          size={{ width: "500px", height: "500px" }}
          colorClass="bg-cyan-300 dark:bg-cyan-600"
          opacityClass="opacity-25 dark:opacity-15"
        />
        <BlurBlob
          position={{ top: "50%", left: "85%" }}
          size={{ width: "500px", height: "500px" }}
          colorClass="bg-fuchsia-300 dark:bg-fuchsia-600"
          opacityClass="opacity-25 dark:opacity-15"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Why Join{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a5f] to-pink-400">
                ULMIND
              </span>
              ?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              We offer an environment where creativity thrives and talent grows.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="perk-glass-card p-5 sm:p-6 text-center"
              >
                <div className="career-glass-highlight" />
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#ff5a5f]/15 to-pink-500/10 dark:from-[#ff5a5f]/20 dark:to-pink-600/10 flex items-center justify-center mb-3 border border-[#ff5a5f]/15 dark:border-[#ff5a5f]/20">
                  {perk.title === "100% Remote" && globeAnimData ? (
                    <Lottie animationData={globeAnimData} loop autoplay className="w-20 h-20" />
                  ) : perk.title === "Great Team" && peopleAnimData ? (
                    <Lottie animationData={peopleAnimData} loop autoplay className="w-14 h-14" />
                  ) : perk.title === "Fast Growth" && thunderAnimData ? (
                    <Lottie animationData={thunderAnimData} loop autoplay className="w-14 h-14" />
                  ) : perk.title === "Job Security" && securityAnimData ? (
                    <Lottie animationData={securityAnimData} loop autoplay className="w-9 h-9" />
                  ) : (
                    <perk.icon className="w-6 h-6 text-[#ff5a5f]" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                  {perk.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          JOB OPENINGS — Liquid Glass Cards
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative overflow-hidden bg-background">
        {/* Ambient blobs */}
        <BlurBlob
          position={{ top: "10%", left: "10%" }}
          size={{ width: "600px", height: "600px" }}
          colorClass="bg-cyan-300 dark:bg-cyan-600"
          opacityClass="opacity-30 dark:opacity-15"
        />
        <BlurBlob
          position={{ top: "50%", left: "80%" }}
          size={{ width: "600px", height: "600px" }}
          colorClass="bg-fuchsia-300 dark:bg-fuchsia-600"
          opacityClass="opacity-30 dark:opacity-15"
        />
        <BlurBlob
          position={{ top: "90%", left: "20%" }}
          size={{ width: "600px", height: "600px" }}
          colorClass="bg-yellow-200 dark:bg-yellow-600"
          opacityClass="opacity-25 dark:opacity-10"
        />

        {/* Static gradient background — no infinite animations for perf */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[10%] -right-[10%] w-[700px] h-[700px] bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-500/8 dark:bg-blue-500/12 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/8 rounded-full blur-[110px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 backdrop-blur-md mb-4 shadow-sm">
              <Briefcase className="w-3.5 h-3.5 text-[#ff5a5f]" />
              <span className="text-xs font-bold tracking-widest text-[#ff5a5f] uppercase">
                Open Positions
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Current{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a5f] to-pink-400">
                Openings
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              Explore our available positions and find your perfect role.
            </p>
          </motion.div>

          {/* Job cards */}
          <div className="space-y-5">
            {jobOpenings.map((job, index) => {
              const colors = accentMap[job.accent] || accentMap.cyan;
              const DeptIcon = departmentIcons[job.department] || Briefcase;

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`career-glass-card ${colors.borderHover} group`}
                >
                  {/* Top highlight */}
                  <div className="career-glass-highlight" />

                  {/* Corner glow blob */}
                  <div
                    className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.glowBg}`}
                  />

                  <div className="relative z-10 p-5 sm:p-7">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                      {/* Left content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Icon badge */}
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colors.iconBg} border-white/60 dark:border-white/10 shadow-sm`}
                          >
                            <DeptIcon
                              className={`w-5 h-5 ${colors.iconText}`}
                            />
                          </div>

                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-tight">
                              {job.title}
                            </h3>
                            {/* Department badge */}
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border mt-1 ${colors.badge}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${colors.badgeDot}`}
                              />
                              {job.department}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 max-w-xl">
                          {job.description}{" "}
                          <button
                            onClick={() => setSelectedJobDetails(job)}
                            className={`inline-flex items-center text-xs font-bold ${colors.skillText} hover:opacity-80 transition-opacity`}
                          >
                            See More
                          </button>
                        </p>

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" /> {job.type}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Briefcase className="w-3.5 h-3.5" />{" "}
                            {job.experience}
                          </span>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${colors.skillBg} ${colors.skillText}`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Apply button */}
                      <div className="shrink-0 flex flex-col justify-start md:items-end mt-4 md:mt-0">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className={`group/btn relative inline-flex items-center justify-center px-7 py-3 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r ${colors.btnGrad} rounded-full hover:scale-105 active:scale-95 ${colors.btnShadow} hover:shadow-lg`}
                        >
                          Apply Now
                          {arrowAnimData ? (
                            <Lottie animationData={arrowAnimData} loop autoplay className="w-5 h-5 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
                          ) : (
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          JOB DETAILS MODAL
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedJobDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 sm:p-6" onClick={() => setSelectedJobDetails(null)}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0f141e] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="shrink-0 p-6 sm:p-8 border-b border-slate-100 dark:border-white/5 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 dark:opacity-5 bg-gradient-to-br ${accentMap[selectedJobDetails.accent].iconBg}`} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJobDetails(null);
                  }}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <div className="relative z-10 pr-8">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border mb-3 ${accentMap[selectedJobDetails.accent].badge}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${accentMap[selectedJobDetails.accent].badgeDot}`} />
                    {selectedJobDetails.department}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
                    {selectedJobDetails.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedJobDetails.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {selectedJobDetails.type}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {selectedJobDetails.experience}</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#ff5a5f]" /> About the Role
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedJobDetails.fullDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Requirements
                    </h4>
                    <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                      {selectedJobDetails.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" /> Qualifications / Degree
                    </h4>
                    <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                      {selectedJobDetails.degrees.map((deg, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{deg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="shrink-0 p-5 sm:p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                <button
                  onClick={() => {
                    const job = selectedJobDetails;
                    setSelectedJobDetails(null);
                    setTimeout(() => setSelectedJob(job), 150); // slight delay for smooth transition
                  }}
                  className={`w-full group/btn relative flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r ${accentMap[selectedJobDetails.accent].btnGrad} rounded-xl hover:scale-[1.02] active:scale-[0.98] ${accentMap[selectedJobDetails.accent].btnShadow} hover:shadow-xl`}
                >
                  Apply Now for this Position
                  {arrowAnimData ? (
                    <Lottie animationData={arrowAnimData} loop autoplay className="w-5 h-5 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  ) : (
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          APPLICATION MODAL — Glassmorphism
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedJob && (
          <CareerApplicationForm
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <CTASection />
    </div>
  );
};

export default Career;
