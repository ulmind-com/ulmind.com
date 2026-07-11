import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CinematicTimings } from '../config/Timings';

export const useTimeline = (startTrigger: boolean) => {
  const [stage, setStage] = useState<keyof typeof CinematicTimings | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!startTrigger) return;

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // We use GSAP's call() to update React state at specific times in the timeline
    // This allows our components to react to the timeline progression

    Object.entries(CinematicTimings).forEach(([key, time]) => {
      tl.call(() => {
        setStage(key as keyof typeof CinematicTimings);
      }, undefined, time);
    });

    return () => {
      tl.kill();
    };
  }, [startTrigger]);

  const skipTimeline = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1); // Jump to end
    }
  };

  return { stage, skipTimeline };
};
