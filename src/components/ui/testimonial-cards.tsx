"use client";

import * as React from 'react';
import { motion } from 'motion/react';

interface Testimonial {
  id: number;
  testimonial: string;
  author: string;
  image?: string;
}

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: string;
}

export function TestimonialCard({ handleShuffle, testimonial, position }: TestimonialCardProps) {
  const isFront = position === "front";
  const isMiddle = position === "middle";
  const isBack = position === "back";

  // Calculate target x in pixels relative to container
  // container is 280px wide. 33% is ~92px, 66% is ~184px
  const targetX = isFront ? 0 : isMiddle ? 60 : 120;
  const targetRotate = isFront ? -6 : isMiddle ? 0 : 6;
  const targetScale = isFront ? 1 : isMiddle ? 0.95 : 0.9;
  const targetOpacity = isFront ? 1 : isMiddle ? 0.8 : 0.6;
  const targetZIndex = isFront ? 30 : isMiddle ? 20 : 10;

  return (
    <motion.div
      layout
      style={{
        zIndex: targetZIndex
      }}
      animate={{
        rotate: targetRotate,
        x: targetX,
        scale: targetScale,
        opacity: targetOpacity,
      }}
      drag="x"
      dragListener={isFront}
      dragMomentum={false}
      dragElastic={0.4}
      dragConstraints={{
        left: -300,
        right: 150,
      }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100) {
          handleShuffle();
        }
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={`absolute left-0 top-0 grid h-[400px] w-[280px] select-none place-content-center space-y-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-2xl ${
        isFront ? "cursor-grab active:cursor-grabbing border-white/20" : ""
      }`}
    >
      <div className="absolute top-8 right-8 opacity-20">
         <div className="w-10 h-10 border-t-2 border-r-2 border-[#ca8af0] rounded-tr-xl" />
      </div>

      <div className="space-y-4">
        <span className="block text-right text-xl font-bold leading-relaxed text-zinc-100" dir="rtl">
          {testimonial}
        </span>
        <div className="w-10 h-1 bg-gradient-to-l from-[#ca8af0] to-transparent ml-auto" />
      </div>

      <div className="absolute bottom-8 left-8 opacity-20">
         <div className="w-10 h-10 border-b-2 border-l-2 border-[#2dd4bf] rounded-bl-xl" />
      </div>

      {isFront && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-40">
           <div className="text-[10px] font-mono uppercase tracking-[0.2em]">Swipe left to continue</div>
        </div>
      )}
    </motion.div>
  );
}
