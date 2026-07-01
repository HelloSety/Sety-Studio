'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { stiffness: 600, damping: 40, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 600, damping: 40, mass: 0.5 });

  const ringX = useSpring(rawX, { stiffness: 150, damping: 20, mass: 0.8 });
  const ringY = useSpring(rawY, { stiffness: 150, damping: 20, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onEnterLink = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"]')) setHovering(true);
    };
    const onLeaveLink = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"]')) setHovering(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onEnterLink);
    document.addEventListener('mouseout', onLeaveLink);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onEnterLink);
      document.removeEventListener('mouseout', onLeaveLink);
    };
  }, [rawX, rawY, visible]);

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference bg-white rounded-full"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: clicking ? 6 : hovering ? 10 : 8,
          height: clicking ? 6 : hovering ? 10 : 8,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 36,
          height: 36,
          border: '1px solid rgba(255,255,255,0.25)',
          borderColor: hovering ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.8 : hovering ? 1.8 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
