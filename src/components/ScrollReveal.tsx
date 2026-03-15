import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
}

export const ScrollReveal = ({ children, direction = "up" }: ScrollRevealProps) => {
  // Direction onujayi animation er starting point set korchi
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ 
        once: true, // Eta true thakle ekbari animate hobe scroll korle. False korle barbar hobe.
        amount: 0.1 // 10% section screen e aslei animation start hobe
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] // Ekta premium smooth ease effect
      }}
    >
      {children}
    </motion.div>
  );
};