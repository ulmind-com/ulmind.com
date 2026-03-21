import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShopProductCard } from './ShopProductCard';

export const ShopAccessoriesCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const slide = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const accessories = [
    {
      category: 'ACCESSORIES',
      price: 25,
      name: 'ULMind Sticker Pack',
      image: '/merchendise/ulmind_stickers.png', 
    },
    {
      category: 'ACCESSORIES',
      price: 40,
      name: 'ULMind Travel Sipper',
      image: '/merchendise/ulmind_bottle.png', 
    },
    {
      category: 'ACCESSORIES',
      price: 28,
      name: 'ULMind Matte Backpack',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', // Placeholder backup
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black tracking-tight"
          >
            Accessories
          </motion.h2>
          
          <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
            <span className="cursor-pointer hover:underline">View All</span>
            <div className="flex gap-2">
              <button 
                onClick={() => slide('left')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <button 
                onClick={() => slide('right')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {accessories.map((item, i) => (
            <div key={item.name} className="snap-start shrink-0">
               <ShopProductCard 
                 category={item.category}
                 price={item.price}
                 name={item.name}
                 image={item.image}
                 delay={i * 0.15}
               />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
