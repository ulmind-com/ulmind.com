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
        once: true,
        amount: 0.1
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};