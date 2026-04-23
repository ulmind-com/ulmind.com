import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react";
// Link ta ekhane import kora holo
import { useLocation, useNavigate, Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => location.pathname === href;

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/ulmind_official", name: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/ulmind", name: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/ULMINDOfficial", name: "Twitter" },
    { icon: Facebook, href: "https://www.facebook.com/ulmind.official", name: "Facebook" },
    { icon: Mail, href: "mailto:contact@ulmind.com", name: "Email" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Technology Stack", href: "/technologies" },
    { name: "Team", href: "/team" },
    { name: "Methodology", href: "/methodology" },
    { name: "Projects", href: "/projects" },
    { name: "Career", href: "/career" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Web Development", href: "/services/web-development" },
    { name: "Mobile App Development", href: "/services/mobile-apps" },
    { name: "Cloud Solutions", href: "/services/cloud" },
    { name: "Backend Development", href: "/services/backend-development" },
    { name: "E-commerce Solutions", href: "/services/ecommerce-solutions" },
    { name: "AI & Machine Learning", href: "/services/ai-machine-learning" },
    { name: "Graphics Design & Branding", href: "/services/graphics-design-branding" },
    { name: "Content Writing & Strategy", href: "/services/content-writing-strategy" },
    { name: "UI/UX Design", href: "/services/ui-ux-design" },
    { name: "Social Media Management", href: "/services/social-media-management" },
  ];

  return (
    <footer className="relative border-t overflow-hidden">
      {/* Background Image and Adaptive Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Abstract Technology Background"
          className="w-full h-full object-cover opacity-60 dark:opacity-40"
        />
        {/* Light mode overlay (almost white, blurred) / Dark mode overlay (almost dark blue/black, blurred) */}
        <div className="absolute inset-0 bg-white/95 dark:bg-[#020b16]/95 backdrop-blur-xl transition-colors duration-300" />

        {/* Huge ULMIND Background Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[16vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-900/[0.08] to-zinc-900/[0.02] dark:from-white/[0.08] dark:to-white/[0.02] uppercase select-none leading-none pb-12">
            ULMIND
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/ULmindLogo.png"
              alt="ULMiND Logo"
              className="h-12 object-contain"
            />

            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
              Transforming ideas into powerful digital solutions using cutting-edge
              technology and innovative design.
            </p>

            {/* Address / Contact */}
            <div className="space-y-3 pt-2 text-sm">
              {/* Location */}
              <div className="group flex items-start gap-3 text-zinc-800 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                <MapPin className="w-5 h-5 shrink-0 transition-colors group-hover:text-red-500 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/4SWnV8AYyViDG6YF9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold leading-snug"
                >
                  Bankura, West Bengal, India
                </a>
              </div>

              {/* Phone */}
              <div className="group flex items-center gap-3 text-zinc-800 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                <Phone className="w-5 h-5 shrink-0 transition-colors group-hover:text-red-500" />
                <a
                  href="tel:+918537861040"
                  className="font-semibold"
                >
                  +91 85378 61040
                </a>
              </div>

              {/* Email */}
              <div className="group flex items-center gap-3 text-zinc-800 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                <Mail className="w-5 h-5 shrink-0 transition-colors group-hover:text-red-500" />
                <a
                  href="mailto:contact@ulmind.com"
                  className="font-semibold"
                >
                  contact@ulmind.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => navigate(link.href)}
                      className={`
                        relative text-sm font-medium transition-colors
                        ${active
                          ? "text-red-500"
                          : "text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-500"
                        }
                        after:content-['']
                        after:absolute after:left-0 after:-bottom-1
                        after:h-[2px] after:w-full after:bg-red-500
                        after:origin-left after:transition-transform after:duration-300
                        ${active
                          ? "after:scale-x-100"
                          : "after:scale-x-0 hover:after:scale-x-100"
                        }
                      `}
                    >
                      {link.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="group flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-500 transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/0 group-hover:bg-red-500 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              Connect With Us
            </h3>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-10">
              Follow us for updates and insights.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <div key={i} className="relative group/social">
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-white/20 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white hover:border-transparent transition-all shadow-sm backdrop-blur-md relative z-10"
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                  
                  {/* Premium Animated Tooltip */}
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2 scale-75 opacity-0 group-hover/social:scale-100 group-hover/social:opacity-100 group-hover/social:-translate-y-1 transition-all duration-300 pointer-events-none z-20 origin-bottom">
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_4px_20px_rgba(239,68,68,0.3)] whitespace-nowrap backdrop-blur-md border border-red-400/50 flex items-center justify-center">
                      {social.name}
                      {/* Triangle Pointer */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-500 rotate-45 border-r border-b border-red-400/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 bg-black/5 dark:bg-white/5 border-t border-black/10 dark:border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ULMiND. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-red-500 transition">
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link to="/terms-of-service" className="hover:text-red-500 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};