import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import Lottie from 'lottie-react';

export type ActionAnimationType = 'success' | 'delete';

interface AdminActionContextType {
  triggerActionAnimation: (type?: ActionAnimationType) => void;
}

const AdminActionContext = createContext<AdminActionContextType | undefined>(undefined);

export const useAdminAction = () => {
  const context = useContext(AdminActionContext);
  if (!context) {
    throw new Error('useAdminAction must be used within an AdminActionProvider');
  }
  return context;
};

export const AdminActionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAnimType, setCurrentAnimType] = useState<ActionAnimationType>('success');
  const animDataRef = useRef<Record<ActionAnimationType, any>>({ success: null, delete: null });
  const [activeAnimData, setActiveAnimData] = useState<any>(null);

  const loadLottie = async (type: ActionAnimationType) => {
    if (animDataRef.current[type]) return animDataRef.current[type];
    try {
      const url = type === 'delete' ? '/Jason/delete.json' : '/Jason/blue_tick.json';
      const res = await fetch(url);
      const data = await res.json();
      animDataRef.current[type] = data;
      return data;
    } catch (err) {
      console.error(`Failed to load ${type} lottie animation:`, err);
      return null;
    }
  };

  const triggerActionAnimation = useCallback(async (type: ActionAnimationType = 'success') => {
    setCurrentAnimType(type);
    let data = animDataRef.current[type];
    if (!data) {
      data = await loadLottie(type);
    }
    setActiveAnimData(data);
    setShowAnimation(true);
    // Hide animation after 2.5 seconds
    setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
  }, []);

  return (
    <AdminActionContext.Provider value={{ triggerActionAnimation }}>
      {children}
      {showAnimation && (
        <div className="admin-action-overlay admin-animate-fade">
          <div className="admin-action-lottie-container">
            {activeAnimData ? (
              <Lottie 
                key={currentAnimType}
                animationData={activeAnimData} 
                loop={false} 
                autoplay={true}
                className="admin-action-lottie"
              />
            ) : null}
          </div>
        </div>
      )}
    </AdminActionContext.Provider>
  );
};
