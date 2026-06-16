"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number; // Maximum rotation in degrees
}

export default function TiltCard({
  children,
  className = "",
  maxRotate = 10,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse coordinates relative to the card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth tilt transitions
  const springConfig = { damping: 20, stiffness: 150, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxRotate, -maxRotate]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxRotate, maxRotate]), springConfig);

  // Motion values for the radial shine background position
  const shineX = useMotionValue(0);
  const shineY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate normalized position relative to center of card (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);

    // Coordinate offset for absolute pixel positioning of shine
    shineX.set(e.clientX - rect.left);
    shineY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Convert shine positions to a dynamic CSS linear/radial gradient string
  const shineBg = useTransform(
    [shineX, shineY],
    ([x, y]) => `radial-gradient(circle 220px at ${x}px ${y}px, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.03), transparent)`
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={`relative rounded-xl overflow-hidden ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full transition-shadow duration-300"
      >
        {/* Dynamic shine layer on hover */}
        {isHovered && (
          <motion.div
            style={{ background: shineBg }}
            className="absolute inset-0 z-30 pointer-events-none"
          />
        )}
        
        {/* Children content wrapper */}
        <div style={{ transform: "translateZ(20px)" }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
