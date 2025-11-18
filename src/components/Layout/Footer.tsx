import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/ULMiND__official', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/mehraki/', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Mail, href: 'mailto:ULMiNDpvtltd@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Team', href: '#team' },
    { name: 'Methodology', href: '#methodology' },
    { name: 'Career', href: '#career' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    'Web Development',
    'Mobile App Development',
    'Cloud Solutions',
    'DevOps Services',
    'AI/ML Development',
    'Consulting',
  ];

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-auto h-12 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/ULMiNDLogo.png"
                  alt="ULMiND Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Transforming ideas into powerful digital solutions using cutting-edge technology and innovative design.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Haldia, West Bengal, India</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+91 85378 61040</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>ULMiNDpvtltd@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-muted-foreground hover:text-primary smooth-transition text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-muted-foreground text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Follow us for the latest updates and insights from the world of technology.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white smooth-transition"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} ULMiND. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button className="hover:text-primary smooth-transition">Privacy Policy</button>
              <button className="hover:text-primary smooth-transition">Terms of Service</button>
              <button className="hover:text-primary smooth-transition">Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};