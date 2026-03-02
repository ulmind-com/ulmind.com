import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Methodology", href: "/methodology" },
  { name: "Projects", href: "/projects" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-6 right-6 z-50"
    >
      <div
        className={`glass-card rounded-2xl border border-white/20 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "bg-background/80 shadow-elegant" : "bg-background/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer h-12 w-auto max-w-[260px]"
            >
              <img
                src="/ULmindLogo.png"
                alt="ULMiND Logo"
                className="h-full object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`
                      relative font-medium transition-colors duration-300
                      ${
                        active
                          ? "text-red-500"
                          : "text-foreground hover:text-red-500"
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
                    {item.name}
                  </button>
                );
              })}
              <ThemeToggle />
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card rounded-b-2xl border-t border-white/20 mt-2 mx-6"
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left font-medium transition-colors
                      ${
                        active
                          ? "text-red-500"
                          : "text-foreground hover:text-red-500"
                      }
                    `}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
