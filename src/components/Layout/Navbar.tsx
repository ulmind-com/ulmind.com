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
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);

      if (currentScrollY < 50) {
        setIsScrollingDown(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsScrollingDown(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  // When mobile menu is open, we force expansion to fit the menu nicely.
  // We also force expansion when scrolling up.
  const isCompact = isScrollingDown && scrolled && !isOpen;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none"
    >
      <motion.div
        layout
        className={`glass-card pointer-events-auto border border-white/20 backdrop-blur-xl transition-[background-color,border-radius,box-shadow,width,max-width] duration-500 overflow-hidden flex flex-col ${scrolled ? "bg-background/80 shadow-elegant" : "bg-background/60"
          } ${isCompact
            ? "rounded-full"
            : "rounded-3xl w-full max-w-7xl"
          }`}
      >
        <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3 gap-3 md:gap-6 relative">

          {/* Logo Section */}
          <motion.div
            layout
            onClick={() => {
              navigate("/");
              setIsOpen(false);
            }}
            className={`cursor-pointer flex-shrink-0 flex items-center transition-all duration-500 ml-1 ${isCompact ? "h-8 md:h-10" : "h-10 md:h-12"
              }`}
          >
            <motion.img
              layout
              src="/ULmindLogo.png"
              alt="ULMiND Logo"
              className="h-full w-auto object-contain"
            />
          </motion.div>

          {/* Center Content Group */}
          <motion.div layout className="flex flex-1 items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {!isCompact ? (
                // Full Desktop Navigation
                <motion.div
                  key="full-nav"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="hidden md:flex items-center space-x-6 lg:space-x-8"
                >
                  {navItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <button
                        key={item.name}
                        onClick={() => navigate(item.href)}
                        className={`group relative font-medium transition-colors duration-300 ease-in-out ${active ? "text-red-500" : "text-foreground hover:text-red-500"
                          }`}
                      >
                        {item.name}
                        <span
                          className={`absolute left-0 -bottom-1.5 h-[2px] w-full bg-red-500 origin-left transition-transform duration-300 ease-in-out ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                // Compact "Available for work" state (visible on both desktop and mobile when shrunk)
                <motion.div
                  key="available-status"
                  onClick={() => navigate('/contact')}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary/40 hover:bg-secondary/60 dark:bg-secondary/20 dark:hover:bg-secondary/40 border border-black/5 dark:border-white/10 cursor-pointer transition-colors shadow-sm"
                >
                  {/* Text */}
                  <span className="text-xs md:text-sm font-semibold tracking-wide text-foreground/90 whitespace-nowrap">
                    Available for work
                  </span>
                  {/* Live Red Blinking Dot */}
                  <div className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-red-500 shadow-[0_0_8px_rgb(239,68,68)]"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Section / Mobile Triggers */}
          <motion.div layout className="flex items-center gap-2 flex-shrink-0 mr-1">
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-white/10 dark:border-white/5"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.href);
                        setIsOpen(false);
                      }}
                      className={`block w-full text-left font-medium transition-colors duration-300 ease-in-out ${active ? "text-red-500" : "text-foreground hover:text-red-500"
                        }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
};