import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown,
  Code2, Smartphone, Server, Database, Cloud, Palette, Search, Brain, Share2
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { OfferPopup } from "@/components/OfferBanner";

const serviceItems = [
  { name: "Web Development",           icon: Code2,     desc: "React, Next.js & Node.js apps",        color: "#FF4D4D", href: "/services/web-development" },
  { name: "Mobile App Development",    icon: Smartphone,desc: "iOS & Android solutions",              color: "#FF6B35", href: "/services/mobile-apps" },
  { name: "Cloud Solutions",           icon: Cloud,     desc: "AWS, Azure & GCP infrastructure",      color: "#2EF2E2", href: "/services/cloud" },
  { name: "Backend Development",       icon: Server,    desc: "APIs, microservices & databases",      color: "#F7C59F", href: "/services/backend-development" },
  { name: "E-commerce Solutions",      icon: Database,  desc: "Online stores with full management",   color: "#89E900", href: "/services/ecommerce-solutions" },
  { name: "AI & Machine Learning",     icon: Brain,     desc: "Intelligent automation & insights",    color: "#38BDF8", href: "/services/ai-machine-learning" },
  { name: "Graphics Design & Branding",icon: Palette,   desc: "Logos, UI design & brand identity",   color: "#A78BFA", href: "/services/graphics-design-branding" },
  { name: "Content Writing & Strategy",icon: Search,    desc: "SEO content & brand storytelling",    color: "#FB923C", href: "/services/content-writing-strategy" },
  { name: "UI/UX Design",              icon: Palette,   desc: "User-centered digital experiences",   color: "#FF4D8D", href: "/services/ui-ux-design" },
  { name: "Social Media Management",   icon: Share2,    desc: "Grow your brand across all platforms", color: "#E1306C", href: "/services/social-media-management" },
];

const navItems = [
  { name: "Home",        href: "/" },
  { name: "About",       href: "/about" },
  { name: "Team",        href: "/team" },
  { name: "Methodology", href: "/methodology" },
  { name: "Projects",    href: "/projects" },
  { name: "Merchandise", href: "/merchandise" },
  { name: "Career",      href: "/career" },
  { name: "Contact",     href: "/contact" },
];

// ─── Desktop Services Mega-Dropdown ──────────────────────────────────────────
const ServicesDropdown = ({ onNavigate }: { onNavigate: (href: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();

  // ── Close + lock whenever the route changes ──────────────────────────────────
  useEffect(() => {
    if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    if (fallbackRef.current) clearTimeout(fallbackRef.current);

    setOpen(false);
    setIsNavigating(true);

    // Safety-net: if the mouse was never on the navbar, no onMouseLeave fires,
    // so reset the guard after 3 s so the dropdown works on the next hover.
    fallbackRef.current = setTimeout(() => setIsNavigating(false), 3000);
  }, [location.pathname]);

  // openMenu is blocked while a navigation is in progress
  const openMenu = () => {
    if (isNavigating) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  // Mouse leaving the wrapper = safe to allow hover again
  const closeMenu = () => {
    if (fallbackRef.current) clearTimeout(fallbackRef.current); // cancel the 3 s timer
    setIsNavigating(false);                                      // re-arm immediately
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  const handleServiceClick = (href: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
    setHoveredIdx(null);
    setIsNavigating(true); // block hover until mouse leaves the wrapper
    onNavigate(href);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      {/* Trigger button */}
      <button
        id="nav-services-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        className={`group relative flex items-center gap-1 font-medium transition-colors duration-300 ease-in-out ${
          open ? "text-red-500" : "text-foreground hover:text-red-500"
        }`}
      >
        Services
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </motion.span>
        {/* underline */}
        <span
          className={`absolute left-0 -bottom-1.5 h-[2px] w-full bg-red-500 origin-left transition-transform duration-300 ease-in-out ${
            open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      {/* Mega dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-services-dropdown"
            role="menu"
            initial={{ opacity: 0, y: 12, x: "-50%", scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  x: "-50%", scale: 1 }}
            exit={{   opacity: 0, y: 8,   x: "-50%", scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-1/2 mt-4 z-[999] w-[580px]"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            {/* Glass card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.28)] backdrop-blur-2xl bg-white dark:bg-zinc-950">
              {/* Shine accent top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

              {/* Header */}
              <div className="px-5 pt-4 pb-3 border-b border-black/5 dark:border-white/8">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-red-500/80">What we offer</p>
                <p className="text-[13px] text-foreground/60 dark:text-white/50 mt-0.5">Click to explore each service</p>
              </div>

              {/* Grid */}
              <div className="p-3 grid grid-cols-2 gap-1.5">
                {serviceItems.map((svc, idx) => {
                  const Icon = svc.icon;
                  const isHovered = hoveredIdx === idx;
                  return (
                    <motion.button
                      key={svc.name}
                      role="menuitem"
                      id={`nav-service-${svc.name.toLowerCase().replace(/[\s&/]+/g, "-")}`}
                      onClick={() => handleServiceClick(svc.href)}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="group flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 relative overflow-hidden
                        hover:bg-black/5 dark:hover:bg-white/6 border border-transparent hover:border-black/8 dark:hover:border-white/10"
                    >
                      {/* Icon bg glow */}
                      {isHovered && (
                        <motion.div
                          layoutId="svc-glow"
                          className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
                          style={{ background: svc.color }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.12 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${svc.color}20`, boxShadow: isHovered ? `0 0 12px ${svc.color}50` : "none", transition: "box-shadow 0.2s" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: svc.color }} />
                      </div>
                      {/* Text */}
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-foreground dark:text-white/90 group-hover:text-red-500 transition-colors duration-200 leading-tight">
                          {svc.name}
                        </p>
                        <p className="text-[11px] text-foreground/55 dark:text-white/45 mt-0.5 leading-relaxed">
                          {svc.desc}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div className="px-5 py-3 border-t border-black/5 dark:border-white/8 flex items-center justify-between">
                <p className="text-[12px] text-foreground/50 dark:text-white/40">All services include free consultation</p>
                <button
                  onClick={() => handleServiceClick("/contact")}
                  className="text-[12px] font-semibold text-red-500 hover:text-red-400 transition-colors duration-200 flex items-center gap-1"
                >
                  Get a quote →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ─── Main Navbar ──────────────────────────────────────────────────────────────
export const Navbar = () => {
  const [isOpen, setIsOpen]                   = useState(false);
  const [scrolled, setScrolled]               = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY); // Prevent negative elasticity on Mac
          setScrolled(currentScrollY > 50);

          if (currentScrollY < 50) {
            setIsScrollingDown(false);
          } else if (Math.abs(currentScrollY - lastScrollY) > 10) {
            // Apply threshold of 10px to prevent micro-stutters and layout thrashing
            setIsScrollingDown(currentScrollY > lastScrollY);
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileServicesOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const isActive  = (href: string) => location.pathname === href;
  const isCompact = isScrollingDown && scrolled && !isOpen;

  // Build the desktop nav items inserting Services after About
  const desktopNavItems = [
    navItems[0], // Home
    navItems[1], // About
    // Services dropdown injected here
    ...navItems.slice(2), // Team → Contact
  ];

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none"
    >
      <motion.div
        layout
        className={`relative glass-card pointer-events-auto border border-white/20 backdrop-blur-xl transition-[background-color,border-radius,box-shadow,width,max-width] duration-500 overflow-visible flex flex-col ${
          scrolled ? "bg-background/80 shadow-elegant" : "bg-background/60"
        } ${isCompact ? "rounded-full" : "rounded-3xl w-full max-w-7xl"}`}
      >
        <ShineBorder
          borderRadius={isCompact ? 9999 : 24}
          borderWidth={1.5}
          color={["#89E900", "#27187E", "#FB3640", "#004643", "#2EF2E2"]}
          className="absolute inset-0 pointer-events-none bg-transparent !p-0 border-none opacity-80"
        />

        <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3 gap-3 md:gap-6 relative z-10">

          {/* Logo */}
          <motion.div
            layout
            onClick={() => { navigate("/"); setIsOpen(false); }}
            className={`cursor-pointer flex-shrink-0 flex items-center transition-all duration-500 ml-1 ${
              isCompact ? "h-8 md:h-10" : "h-10 md:h-12"
            }`}
          >
            <motion.img
              layout
              src="/ULmindLogo.png"
              alt="ULMiND Logo"
              className="h-full w-auto object-contain"
            />
          </motion.div>

          {/* Center nav */}
          <motion.div layout className="flex flex-1 items-center justify-center overflow-visible">
            <AnimatePresence mode="popLayout" initial={false}>
              {!isCompact ? (
                <motion.div
                  key="full-nav"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1,    filter: "blur(0px)" }}
                  exit={{   opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="hidden md:flex items-center space-x-6 lg:space-x-7"
                >
                  {/* Home & About */}
                  {[navItems[0], navItems[1]].map((item) => {
                    const active = isActive(item.href);
                    return (
                      <button
                        key={item.name}
                        id={`nav-${item.name.toLowerCase()}`}
                        onClick={() => navigate(item.href)}
                        className={`group relative font-medium transition-colors duration-300 ease-in-out ${
                          active ? "text-red-500" : "text-foreground hover:text-red-500"
                        }`}
                      >
                        {item.name}
                        <span className={`absolute left-0 -bottom-1.5 h-[2px] w-full bg-red-500 origin-left transition-transform duration-300 ease-in-out ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`} />
                      </button>
                    );
                  })}

                  {/* ── Services Dropdown ── */}
                  <ServicesDropdown onNavigate={navigate} />

                  {/* Rest of nav items */}
                  {navItems.slice(2).map((item) => {
                    const active = isActive(item.href);
                    return (
                      <button
                        key={item.name}
                        id={`nav-${item.name.toLowerCase()}`}
                        onClick={() => navigate(item.href)}
                        className={`group relative font-medium transition-colors duration-300 ease-in-out ${
                          active ? "text-red-500" : "text-foreground hover:text-red-500"
                        }`}
                      >
                        {item.name}
                        <span className={`absolute left-0 -bottom-1.5 h-[2px] w-full bg-red-500 origin-left transition-transform duration-300 ease-in-out ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`} />
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                // Compact pill: "Available for work"
                <motion.div
                  key="available-status"
                  onClick={() => navigate("/contact")}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1,   filter: "blur(0px)" }}
                  exit={{   opacity: 0, scale: 0.9,  filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary/40 hover:bg-secondary/60 dark:bg-secondary/20 dark:hover:bg-secondary/40 border border-black/5 dark:border-white/10 cursor-pointer transition-colors shadow-sm"
                >
                  <span className="text-xs md:text-sm font-semibold tracking-wide text-foreground/90 whitespace-nowrap">
                    Available for work
                  </span>
                  <div className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-red-500 shadow-[0_0_8px_rgb(239,68,68)]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: theme toggle + hamburger */}
          <motion.div layout className={`flex items-center gap-2 flex-shrink-0 mr-1 ${isCompact ? "hidden md:flex" : ""}`}>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-full"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </motion.div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-350 ease-in-out ${
            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
              <div className="relative z-20 bg-white dark:bg-zinc-950 rounded-b-3xl">
              <div className="mx-4 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

              <div className="px-5 py-5 flex flex-col gap-1">
                {/* Home & About */}
                {[navItems[0], navItems[1]].map((item, index) => {
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.name}
                      id={`mobile-nav-${item.name.toLowerCase()}`}
                      onClick={() => { navigate(item.href); setIsOpen(false); setMobileServicesOpen(false); }}
                      className={`group relative w-full text-left py-3 px-3 rounded-xl text-[15px] font-[450] tracking-wide transition-all duration-200 ease-out ${
                        active
                          ? "text-red-500 bg-red-500/10"
                          : "text-foreground/80 hover:text-foreground hover:bg-foreground/8 dark:text-white/85 dark:hover:text-white dark:hover:bg-white/8"
                      }`}
                      style={{ fontVariationSettings: "'wght' 450", WebkitFontSmoothing: "antialiased" }}
                    >
                      <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full transition-all duration-200 ${
                        active ? "h-5 bg-red-500" : "h-0 bg-red-500 group-hover:h-4"
                      }`} />
                      <span className="pl-2">{item.name}</span>
                    </button>
                  );
                })}

                {/* ── Mobile Services Accordion ── */}
                <div>
                  {/* Services trigger */}
                  <button
                    id="mobile-nav-services"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="group relative w-full text-left py-3 px-3 rounded-xl text-[15px] font-[450] tracking-wide transition-all duration-200 ease-out flex items-center justify-between text-foreground/80 hover:text-foreground hover:bg-foreground/8 dark:text-white/85 dark:hover:text-white dark:hover:bg-white/8"
                    style={{ fontVariationSettings: "'wght' 450", WebkitFontSmoothing: "antialiased" }}
                  >
                    <div className="flex items-center gap-2 pl-2">
                      <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full transition-all duration-200 ${
                        mobileServicesOpen ? "h-5 bg-red-500" : "h-0 bg-red-500 group-hover:h-4"
                      }`} />
                      <span className={mobileServicesOpen ? "text-red-500" : ""}>Services</span>
                    </div>
                    <span
                      className={`mr-1 inline-flex transition-transform duration-250 ${mobileServicesOpen ? "rotate-180" : "rotate-0"}`}
                    >
                      <ChevronDown className={`h-4 w-4 ${mobileServicesOpen ? "text-red-500" : "text-foreground/50 dark:text-white/40"}`} />
                    </span>
                  </button>

                  {/* Services accordion content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileServicesOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                        <div className="ml-3 mt-1 mb-2 grid grid-cols-1 gap-1 border-l-2 border-red-500/20 pl-3">
                          {serviceItems.map((svc) => {
                            const Icon = svc.icon;
                            return (
                              <button
                                key={svc.name}
                                id={`mobile-service-${svc.name.toLowerCase().replace(/[\s&/]+/g, "-")}`}
                                onClick={() => { navigate(svc.href); setIsOpen(false); setMobileServicesOpen(false); }}
                                className="group flex items-center gap-3 py-2.5 px-2 rounded-xl text-left transition-all duration-200 hover:bg-red-500/8 dark:hover:bg-white/6"
                              >
                                <div
                                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                                  style={{ background: `${svc.color}22` }}
                                >
                                  <Icon className="w-3.5 h-3.5" style={{ color: svc.color }} />
                                </div>
                                <div>
                                  <p className="text-[13px] font-medium text-foreground/85 dark:text-white/80 group-hover:text-red-500 transition-colors duration-200 leading-tight">
                                    {svc.name}
                                  </p>
                                  <p className="text-[11px] text-foreground/50 dark:text-white/40 leading-relaxed">
                                    {svc.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                  </div>
                </div>

                {/* Rest of nav items (Team → Contact) */}
                {navItems.slice(2).map((item) => {
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.name}
                      id={`mobile-nav-${item.name.toLowerCase()}`}
                      onClick={() => { navigate(item.href); setIsOpen(false); setMobileServicesOpen(false); }}
                      className={`group relative w-full text-left py-3 px-3 rounded-xl text-[15px] font-[450] tracking-wide transition-all duration-200 ease-out ${
                        active
                          ? "text-red-500 bg-red-500/10"
                          : "text-foreground/80 hover:text-foreground hover:bg-foreground/8 dark:text-white/85 dark:hover:text-white dark:hover:bg-white/8"
                      }`}
                      style={{ fontVariationSettings: "'wght' 450", WebkitFontSmoothing: "antialiased" }}
                    >
                      <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full transition-all duration-200 ${
                        active ? "h-5 bg-red-500" : "h-0 bg-red-500 group-hover:h-4"
                      }`} />
                      <span className="pl-2">{item.name}</span>
                    </button>
                  );
                })}
              </div>
              </div>
        </div>
      </motion.div>
    </motion.nav>

    {/* Image popup — fixed overlay, separate from nav */}
    <OfferPopup />
    </>
  );
};