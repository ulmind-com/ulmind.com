import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  HeartPulse,
  Music2,
  Building2,
  Briefcase,
  UserCheck,
  Plane,
  Truck,
  Pizza,
  Home,
  Trophy,
  Heart,
  ShoppingBag,
  Factory,
  Leaf,
  Newspaper,
  Gamepad2,
  Car,
  Scale,
  Zap,
  Radio,
  Landmark,
  Umbrella,
  Rocket,
  HardHat,
  Package,
  ConciergeBell,
  Bitcoin,
  Dumbbell,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import BlurBlob from "@/components/BlurBlob";

export const industries = [
  {
    slug: "education",
    icon: GraduationCap,
    lottieFile: "/Jason/Trophy.json",
    title: "Education",
    tagline: "Learning Reimagined",
    description: "Smart platforms, LMS systems, and e-learning solutions that empower institutions and students alike.",
    accent: "#e11d48",
  },
  {
    slug: "healthcare",
    icon: HeartPulse,
    lottieFile: "/Jason/verification.json",
    title: "Healthcare",
    tagline: "Care Powered by Code",
    description: "Digital health platforms, telemedicine apps, and patient management systems built for real impact.",
    accent: "#e11d48",
  },
  {
    slug: "entertainment",
    icon: Music2,
    lottieFile: "/Jason/Star.json",
    title: "Entertainment",
    tagline: "Experiences That Captivate",
    description: "Streaming platforms, ticketing systems, and content hubs that keep audiences engaged.",
    accent: "#e11d48",
  },
  {
    slug: "banking",
    icon: Building2,
    lottieFile: "/Jason/Security status - Safe.json",
    title: "Banking",
    tagline: "Finance, Fortified",
    description: "Secure fintech solutions, digital banking dashboards, and payment gateways built to global standards.",
    accent: "#e11d48",
  },
  {
    slug: "business",
    icon: Briefcase,
    lottieFile: "/Jason/Growth Chart.json",
    title: "Business",
    tagline: "Growth by Design",
    description: "CRMs, ERP systems, automation tools, and analytics platforms that drive real business results.",
    accent: "#e11d48",
  },
  {
    slug: "job-career",
    icon: UserCheck,
    lottieFile: "/Jason/people.json",
    title: "Job / Career",
    tagline: "Connecting Talent to Opportunity",
    description: "Job boards, ATS platforms, and career portals built to match the right talent with the right roles.",
    accent: "#e11d48",
  },
  {
    slug: "travel",
    icon: Plane,
    lottieFile: "/Jason/Mission.json",
    title: "Travel",
    tagline: "Every Journey, Digitized",
    description: "Booking engines, itinerary planners, and travel apps that transform how people explore the world.",
    accent: "#e11d48",
  },
  {
    slug: "transport",
    icon: Truck,
    lottieFile: "/Jason/Green Setting Wheel.json",
    title: "Transport",
    tagline: "Logistics, Elevated",
    description: "Fleet management, last-mile delivery apps, and logistics dashboards built for operational excellence.",
    accent: "#e11d48",
  },
  {
    slug: "food",
    icon: Pizza,
    lottieFile: "/Jason/Success.json",
    title: "Food",
    tagline: "Taste Meets Technology",
    description: "Restaurant management, food delivery apps, and kitchen automation that delight every appetite.",
    accent: "#e11d48",
  },
  {
    slug: "real-estate",
    icon: Home,
    lottieFile: "/Jason/Growth Chart.json",
    title: "Real Estate",
    tagline: "Property, Reinvented",
    description: "Property listing portals, virtual tour apps, and smart CRM tools for modern real estate businesses.",
    accent: "#e11d48",
  },
  {
    slug: "sports",
    icon: Trophy,
    lottieFile: "/Jason/Trophy.json",
    title: "Sports",
    tagline: "Performance Meets Platform",
    description: "Sports analytics, live scoring apps, fan engagement platforms, and athlete management systems.",
    accent: "#e11d48",
  },
  {
    slug: "dating",
    icon: Heart,
    lottieFile: "/Jason/Star.json",
    title: "Dating",
    tagline: "Connections Built to Last",
    description: "Matchmaking platforms, swipe apps, and compatibility engines crafted for meaningful relationships.",
    accent: "#e11d48",
  },
  {
    slug: "ecommerce",
    icon: ShoppingBag,
    lottieFile: "/Jason/Success.json",
    title: "E-Commerce",
    tagline: "Retail, Redefined",
    description: "Scalable online stores, marketplace platforms, and AI-driven retail analytics that multiply sales.",
    accent: "#e11d48",
  },
  {
    slug: "manufacturing",
    icon: Factory,
    lottieFile: "/Jason/Green Setting Wheel.json",
    title: "Manufacturing",
    tagline: "Industry 4.0 Solutions",
    description: "IoT integrations, supply chain automation, and production management systems built for efficiency.",
    accent: "#e11d48",
  },
  {
    slug: "agriculture",
    icon: Leaf,
    lottieFile: "/Jason/Growth Chart.json",
    title: "Agriculture",
    tagline: "Farming the Future",
    description: "Agri-tech solutions, drone analytics apps, and smart farm management software for modern growers.",
    accent: "#e11d48",
  },
  {
    slug: "media",
    icon: Newspaper,
    lottieFile: "/Jason/Star.json",
    title: "Media & PR",
    tagline: "Publishing at Scale",
    description: "High-traffic content management systems, digital publishing platforms, and real-time audience analytics.",
    accent: "#e11d48",
  },
  {
    slug: "gaming",
    icon: Gamepad2,
    lottieFile: "/Jason/Trophy.json",
    title: "Gaming",
    tagline: "Immersive Experiences",
    description: "Robust game backend servers, low-latency matchmaking systems, and in-game economy management.",
    accent: "#e11d48",
  },
  {
    slug: "automotive",
    icon: Car,
    lottieFile: "/Jason/Mission.json",
    title: "Automotive",
    tagline: "Driving Innovation",
    description: "Connected car dashboards, smart dealership management systems, and next-gen mobility solutions.",
    accent: "#e11d48",
  },
  {
    slug: "legal",
    icon: Scale,
    lottieFile: "/Jason/verification.json",
    title: "Legal Tech",
    tagline: "Justice, Digitized",
    description: "Secure case management software, digital contracting platforms, and encrypted legal document vaults.",
    accent: "#e11d48",
  },
  {
    slug: "energy",
    icon: Zap,
    lottieFile: "/Jason/Security status - Safe.json",
    title: "Energy",
    tagline: "Powering Tomorrow",
    description: "Smart grid analytics, renewable energy monitoring, and comprehensive utility management dashboards.",
    accent: "#e11d48",
  },
  {
    slug: "telecommunications",
    icon: Radio,
    lottieFile: "/Jason/Call ringing animation.json",
    title: "Telecommunications",
    tagline: "Connecting the World",
    description: "Robust telecom billing systems, network management dashboards, and VoIP communication solutions.",
    accent: "#e11d48",
  },
  {
    slug: "government",
    icon: Landmark,
    lottieFile: "/Jason/verification.json",
    title: "Public Sector",
    tagline: "Digital Governance",
    description: "Secure civic portals, citizen engagement platforms, and e-governance administrative tools.",
    accent: "#e11d48",
  },
  {
    slug: "insurance",
    icon: Umbrella,
    lottieFile: "/Jason/Security status - Safe.json",
    title: "Insurance",
    tagline: "Risk Management, Evolved",
    description: "Automated claim processing, policy management software, and fraud detection AI for insurtech.",
    accent: "#e11d48",
  },
  {
    slug: "aviation",
    icon: Rocket,
    lottieFile: "/Jason/Mission.json",
    title: "Aviation",
    tagline: "Next-Gen Aerospace",
    description: "Flight operations software, crew scheduling systems, and predictive maintenance dashboards.",
    accent: "#e11d48",
  },
  {
    slug: "construction",
    icon: HardHat,
    lottieFile: "/Jason/Growth Chart.json",
    title: "Construction",
    tagline: "Building the Future",
    description: "Project management software, BIM integrations, and site safety compliance tools.",
    accent: "#e11d48",
  },
  {
    slug: "logistics",
    icon: Package,
    lottieFile: "/Jason/Green Setting Wheel.json",
    title: "Logistics",
    tagline: "Optimized Supply Chains",
    description: "Warehouse management systems, real-time freight tracking, and supply chain automation.",
    accent: "#e11d48",
  },
  {
    slug: "hospitality",
    icon: ConciergeBell,
    lottieFile: "/Jason/Success.json",
    title: "Hospitality",
    tagline: "Seamless Stays",
    description: "Hotel property management systems, guest experience apps, and dynamic booking engines.",
    accent: "#e11d48",
  },
  {
    slug: "crypto",
    icon: Bitcoin,
    lottieFile: "/Jason/Security status - Safe.json",
    title: "Blockchain & Web3",
    tagline: "Decentralized Future",
    description: "Secure crypto exchanges, smart contract auditing, and decentralized application (dApp) development.",
    accent: "#e11d48",
  },
  {
    slug: "fitness",
    icon: Dumbbell,
    lottieFile: "/Jason/Trophy.json",
    title: "Fitness",
    tagline: "Health Meets Tech",
    description: "Workout tracking apps, virtual coaching platforms, and wearable device integrations.",
    accent: "#e11d48",
  },
  {
    slug: "cybersecurity",
    icon: ShieldAlert,
    lottieFile: "/Jason/verification.json",
    title: "Cybersecurity",
    tagline: "Digital Fortresses",
    description: "Threat detection systems, identity management solutions, and secure access service edge (SASE) platforms.",
    accent: "#e11d48",
  },
];

/* ── Simple Centered Card ────────────────────────────── */
const IndustryCard: React.FC<{
  industry: (typeof industries)[0];
  index: number;
  inView: boolean;
}> = ({ industry, index, inView }) => {
  const navigate = useNavigate();
  const Icon = industry.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      onClick={() => navigate(`/industries/${industry.slug}`)}
      className="group cursor-pointer aspect-square sm:aspect-auto sm:h-48 w-full"
    >
      <div className="relative h-full w-full rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(225,29,72,0.15)] transition-all duration-300 group-hover:-translate-y-2 group-hover:border-rose-500/30 dark:group-hover:border-red-500/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        
        {/* Hover Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-500/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative z-10 mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <Icon className="w-12 h-12 text-zinc-800 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-red-500 transition-colors duration-300" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="relative z-10 text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-red-400 transition-colors duration-300">
          {industry.title}
        </h3>
      </div>
    </motion.div>
  );
};

/* ── Section ────────────────────────────── */
export const IndustriesSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background blobs */}
      <BlurBlob position={{ top: "10%", left: "5%" }} size={{ width: "500px", height: "500px" }} colorClass="bg-rose-500" opacityClass="opacity-10" />
      <BlurBlob position={{ top: "60%", left: "80%" }} size={{ width: "450px", height: "450px" }} colorClass="bg-red-400" opacityClass="opacity-10" />
      <BlurBlob position={{ top: "40%", left: "50%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-pink-300" opacityClass="opacity-5" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-rose-500/25 dark:border-red-500/25 bg-rose-500/8 dark:bg-red-500/10">
            <span className="text-rose-600 dark:text-red-400 text-[10px] font-black tracking-[0.4em] uppercase">Industries</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 dark:text-white mb-5 tracking-tighter uppercase leading-none">
            Industries{" "}
            <span className="bg-gradient-to-r from-rose-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
              We Serve
            </span>
          </h2>

          <div className="w-28 h-1.5 bg-gradient-to-r from-transparent via-rose-600 dark:via-red-500 to-transparent mx-auto rounded-full shadow-[0_0_25px_rgba(225,29,72,0.5)] mb-6" />

          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            We build precision-crafted digital solutions across 30+ industries — combining deep domain knowledge with cutting-edge technology.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {industries.slice(0, 12).map((industry, i) => (
            <IndustryCard
              key={industry.slug}
              industry={industry}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-20"
        >
          {/* See More Serve */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(225,29,72,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/industries")}
            className="group relative h-14 px-10 rounded-full font-black text-sm uppercase tracking-widest border-2 border-rose-500/50 dark:border-red-500/40 text-rose-600 dark:text-red-400 overflow-hidden transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              See More Industries
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>

          {/* Start Your Project Now */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(225,29,72,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/contact")}
            className="group relative h-14 px-10 rounded-full font-black text-sm uppercase tracking-widest bg-gradient-to-r from-rose-600 to-red-600 text-white overflow-hidden shadow-[0_0_20px_rgba(225,29,72,0.35)] border border-rose-500/30 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Start Your Project Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
