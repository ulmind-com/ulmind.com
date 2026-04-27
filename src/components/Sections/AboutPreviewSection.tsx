import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';
import { Users, Target, Award, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BlurBlob from "@/components/BlurBlob";

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Mission-Driven",
    description: "Delivering exceptional solutions that drive real business value"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Client-Centric",
    description: "Your success is our success - we work closely with you every step"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Quality Excellence",
    description: "Maintaining highest standards in code quality and delivery"
  }
];

const stats = [
  { number: "7+", label: "Projects Completed" },
  { number: "7+", label: "Happy Clients" },
  { number: "3+", label: "Years Experience" },
  { number: "8+", label: "Team Members" }
];

export const AboutPreviewSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();
  const [arrowAnimData, setArrowAnimData] = useState<object | null>(null);
  const [missionAnimData, setMissionAnimData] = useState<object | null>(null);
  const [peopleAnimData, setPeopleAnimData] = useState<object | null>(null);
  const [verificationAnimData, setVerificationAnimData] = useState<object | null>(null);

  const fetchLottie = async (path: string, setter: React.Dispatch<React.SetStateAction<object | null>>, applyColor?: boolean) => {
    try {
      const response = await fetch(path);
      const data = await response.json();

      if (applyColor) {
        const newColor = [0.96078, 0.03137, 0.27843, 1]; // #f50847
        const recolor = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) {
            obj.forEach(recolor);
            return;
          }
          if (obj.ty === 'fl' || obj.ty === 'st') {
            if (obj.c && Array.isArray(obj.c.k) && (obj.c.a === 0 || obj.c.a === undefined)) {
              if (obj.c.k.length === 4) {
                const [r, g, b] = obj.c.k;
                // Only recolor if it's NOT white, NOT black, and NOT greyscale
                const isGreyscale = Math.max(r, g, b) - Math.min(r, g, b) < 0.05;
                if (!isGreyscale) {
                  obj.c.k = newColor;
                }
              }
            }
          }
          Object.values(obj).forEach(recolor);
        };
        recolor(data);
      }

      const stripped = {
        ...data,
        layers: (data.layers ?? []).filter(
          (l: any) => l.ty !== 1 && !/^bg$/i.test(l.nm ?? '') && !/^background$/i.test(l.nm ?? '')
        ),
      };
      setter(stripped);
    } catch {}
  };

  useEffect(() => {
    fetchLottie('/Jason/lottieflow-arrow-08-2-ffffff-easey.json', setArrowAnimData);
    fetchLottie('/Jason/Mission.json', setMissionAnimData, true);
    fetchLottie('/Jason/people.json', setPeopleAnimData, true);
    fetchLottie('/Jason/verification.json', setVerificationAnimData, true);
  }, []);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BlurBlob position={{ top: "50%", left: "50%" }} size={{ width: "800px", height: "800px" }} colorClass="bg-red-500" opacityClass="opacity-15" />
      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About ULMiND
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              We are a passionate team of developers, designers, and innovators dedicated to 
              transforming your digital dreams into powerful, scalable solutions that drive business growth.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Founded with a vision to bridge the gap between innovative technology and business success, 
              we've grown from a small team to a full-service digital agency serving clients worldwide.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1" style={{ color: "#e11d48" }}>
                    {feature.title === "Mission-Driven" && missionAnimData ? (
                      <Lottie animationData={missionAnimData} loop autoplay className="w-14 h-14 -ml-3 -mt-3" />
                    ) : feature.title === "Client-Centric" && peopleAnimData ? (
                      <Lottie animationData={peopleAnimData} loop autoplay className="w-14 h-14 -ml-3 -mt-3" />
                    ) : feature.title === "Quality Excellence" && verificationAnimData ? (
                      <Lottie animationData={verificationAnimData} loop autoplay className="w-14 h-14 -ml-3 -mt-3" />
                    ) : (
                      feature.icon
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-95 group/btn"
              style={{
                background: "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)",
                boxShadow: "0 4px 24px 0 rgba(225,29,72,0.4), 0 1.5px 6px 0 rgba(159,18,57,0.25)",
              }}
            >
              Learn More About Us
              {arrowAnimData ? (
                <Lottie animationData={arrowAnimData} loop autoplay className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              ) : (
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              )}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300">
                  <div className="text-3xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e11d48 0%, #f43f5e 60%, #9f1239 100%)" }}>
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};