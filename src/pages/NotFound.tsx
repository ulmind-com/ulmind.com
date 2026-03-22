import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { CTASection } from '@/components/Sections/CTASection';
import BlurBlob from "@/components/BlurBlob";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <BlurBlob position={{ top: "10%", left: "10%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300 dark:bg-cyan-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "50%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-300 dark:bg-fuchsia-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "90%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-200 dark:bg-yellow-600" opacityClass="opacity-40 dark:opacity-20" />
      
      <div className="text-center max-w-md mx-auto z-10 flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* CTA */}
      <CTASection />
    </div>
  );
}
