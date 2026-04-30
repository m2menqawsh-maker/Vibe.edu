import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

export const InteractiveGridBackground = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 w-full h-full overflow-hidden pointer-events-none", className)}
    >
      {/* Base dim grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      {/* Mouse-revealed grid */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY }: { offsetX: any; offsetY: any }) => (
  <svg className="w-full h-full">
    <defs>
      <motion.pattern
        id="grid-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        x={offsetX}
        y={offsetY}
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground"
        />
      </motion.pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
);
