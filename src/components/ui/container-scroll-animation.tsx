"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

export const HeroScrollAnimation = ({
  titleComponent,
  children,
  containerId
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  containerId?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLElement | null>(null);
  
  if (typeof document !== "undefined" && containerId && !scrollContainerRef.current) {
    scrollContainerRef.current = document.getElementById(containerId);
  }

  const [scrollContainerState, setScrollContainerState] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      setScrollContainerState(scrollContainerRef.current);
      return;
    }
    
    if (containerRef.current) {
      let parent = containerRef.current.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.overflowY === "auto" || style.overflowY === "scroll" || style.overflowY === "overlay") {
          setScrollContainerState(parent);
          break;
        }
        parent = parent.parentElement;
      }
    }
  }, [containerId]);

  const activeContainer = scrollContainerRef.current || scrollContainerState;

  if (!activeContainer) {
    return <div ref={containerRef} className="opacity-0 w-full min-h-[500px]" />;
  }

  return (
    <HeroScrollAnimationInner
      titleComponent={titleComponent}
      scrollContainer={activeContainer}
    >
      {children}
    </HeroScrollAnimationInner>
  );
};

const HeroScrollAnimationInner = ({
  titleComponent,
  children,
  scrollContainer,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  scrollContainer: HTMLElement;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: { current: scrollContainer },
    offset: ["start end", "end start"]
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9, 0.7] : [0.8, 1.05, 0.8];
  };

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, 20]);
  const translateX = useTransform(scrollYProgress, [0, 0.5, 1], [-50, 0, 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div
      className="h-[80rem] md:h-[100rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1200px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotateX={rotateX} rotateY={rotateY} translateX={translateX} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotateX,
  rotateY,
  translateX,
  scale,
  children,
}: {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  translateX: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        x: translateX,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-white/10 glass rounded-[30px] shadow-2xl p-2 md:p-6"
    >
      <div className=" h-full w-full overflow-hidden rounded-2xl bg-[#09090b] border border-white/5 md:rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
};
