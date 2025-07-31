import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Methodology", href: "/methodology" },
  { name: "Projects", href: "/projects" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-6 right-6 z-50 transition-all duration-300"
    >
      <div className={`glass-card rounded-2xl border border-white/20 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'bg-background/80 shadow-elegant' : 'bg-background/60'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
          
           <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="h-12 w-auto max-w-[260px]">
                <img
                  src="/MerakiLogo.png"
                  alt="Meraki Logo"
                  className="h-full object-contain"
                />
              </div>
            </motion.div>


            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    if (item.href.startsWith('/#')) {
                      scrollToSection(item.href);
                    } else {
                      navigate(item.href);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-foreground hover:text-primary smooth-transition font-medium"
                >
                  {item.name}
                </motion.button>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile menu button and theme toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card rounded-b-2xl border-t border-white/20 mt-2 mx-6"
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    if (item.href.startsWith('/#')) {
                      scrollToSection(item.href);
                    } else {
                      navigate(item.href);
                    }
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 10 }}
                  className="block w-full text-left text-foreground hover:text-primary smooth-transition font-medium"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};