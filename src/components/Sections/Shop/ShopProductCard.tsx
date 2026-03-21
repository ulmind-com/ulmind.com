import { motion } from 'framer-motion';

interface ShopProductCardProps {
  category: string;
  price: number;
  name: string;
  image: string;
  delay?: number;
}

export const ShopProductCard = ({ category, price, name, image, delay = 0 }: ShopProductCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="group cursor-pointer flex-shrink-0 w-full sm:w-[320px] md:w-[400px]"
    >
      <div className="bg-[#F2F2F2] aspect-square w-full relative overflow-hidden flex flex-col justify-between p-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-center z-10 w-full text-xs font-bold uppercase tracking-widest text-[#111]">
          <span>{category}</span>
          <span>${price}</span>
        </div>

        {/* Image Container */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            src={image} 
            alt={name}
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
          />
        </div>

        {/* Bottom Title */}
        <div className="z-10 w-full font-semibold text-sm mt-auto self-end text-[#111]">
          {name}
        </div>
      </div>
    </motion.div>
  );
};
