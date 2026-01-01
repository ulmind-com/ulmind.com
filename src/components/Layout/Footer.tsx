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
import { useLocation, useNavigate } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => location.pathname === href;

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/ULMiND__official" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/mehraki/" },
    { icon: Twitter, href: "https://x.com/ULMINDOfficial" },
    { icon: Facebook, href: "https://www.facebook.com/ULmind.in" },
    { icon: Mail, href: "mailto:contact@ulmind.com" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Methodology", href: "/methodology" },
    { name: "Projects", href: "/projects" },
    { name: "Career", href: "/career" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    "Web Development",
    "Mobile App Development",
    "Cloud Solutions",
    "DevOps Services",
    "AI/ML Development",
    "Consulting",
  ];

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/ULmindLogo.png"
              alt="ULMiND Logo"
              className="h-12 object-contain"
            />

            <p className="text-sm font-semibold text-black dark:text-white">
              Transforming ideas into powerful digital solutions using cutting-edge
              technology and innovative design.
            </p>

            {/* Address / Contact */}
            <div className="space-y-2 text-sm">
              {/* Location */}
              <div className="group flex items-center gap-2 font-semibold text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-colors">
                <MapPin className="w-4 h-4 transition-colors group-hover:text-red-500" />
                <a
                  href="https://maps.app.goo.gl/4SWnV8AYyViDG6YF9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-2 border-red-500"
                >
                  Haldia, West Bengal, India
                </a>
              </div>

              {/* Phone */}
              <div className="group flex items-center gap-2 font-semibold text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-colors">
                <Phone className="w-4 h-4 transition-colors group-hover:text-red-500" />
                <a
                  href="tel:+918537861040"
                  className="border-b-2 border-red-500"
                >
                  +91 85378 61040
                </a>
              </div>

              {/* Email */}
              <div className="group flex items-center gap-2 font-semibold text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-colors">
                <Mail className="w-4 h-4 transition-colors group-hover:text-red-500" />
                <a
                  href="mailto:contact@ulmind.com"
                  className="border-b-2 border-red-500"
                >
                  contact@ulmind.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => navigate(link.href)}
                      className={`
                        relative text-sm transition-colors
                        ${
                          active
                            ? "text-red-500"
                            : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"
                        }
                        after:content-['']
                        after:absolute after:left-0 after:-bottom-1
                        after:h-[2px] after:w-full after:bg-red-500
                        after:origin-left after:transition-transform after:duration-300
                        ${
                          active
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
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
              Our Services
            </h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li
                  key={service}
                  className="text-sm text-black dark:text-white"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
              Connect With Us
            </h3>
            <p className="text-sm text-black dark:text-white mb-4">
              Follow us for updates and insights.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ULMiND. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <button className="hover:text-red-500 transition">Privacy Policy</button>
            <button className="hover:text-red-500 transition">Terms of Service</button>
            <button className="hover:text-red-500 transition">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
