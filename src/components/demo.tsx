"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TestimonialCard } from "./ui/testimonial-cards";
import { useState } from "react";
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
} from "./ui/animated-cards-stack"

const testimonials = [
  {
    id: 1,
    testimonial: "تبدأ المرحلة الأولى بتحديد الرؤية البصرية. ابحث في المواقع العالمية عن الأنماط التي تلهمك.",
  },
  {
    id: 2,
    testimonial: "استخدم الأدوات المساعدة لوصف الـ Vibe الذي تريده. الألوان والخطوط والمساحات هي جوهر التصميم.",
  },
  {
    id: 3,
    testimonial: "لا تقلق بشأن الكود في هذه المرحلة. التركيز الكامل يكون على 'كيف يبدو' الموقع وما هو الشعور الذي ينقله.",
  }
];

export function ShuffleCards({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [data, setData] = useState(testimonials);

  const handleShuffle = () => {
    setData((prev) => {
      const newData = [...prev];
      const first = newData.shift()!;
      newData.push(first);
      return newData;
    });
  };

  return (
    <div className="flex flex-col items-center md:items-start justify-start pt-20 md:pt-24 w-full h-auto pointer-events-none" dir="rtl">
        {(title || subtitle) && (
          <div className="mb-8 md:mb-12 text-center md:text-right max-w-xl w-full pointer-events-auto">
            {title && <h3 className="text-2xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-white drop-shadow-2xl">{title}</h3>}
            {subtitle && <p className="text-sm md:text-xl text-white/50 font-medium leading-relaxed">{subtitle}</p>}
          </div>
        )}
      
      <div className="relative h-[350px] md:h-[450px] w-full max-w-[320px] md:max-w-[380px] perspective-1000 pointer-events-auto">
        {data.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial.testimonial}
            handleShuffle={handleShuffle}
            position={index === 0 ? "front" : index === 1 ? "middle" : "back"}
          />
        ))}
      </div>
    </div>
  );
}

export interface VibeCardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  value?: string;
  label?: string;
}

export function AnimatedVibeCards({ cards, title, subtitle, align = "left", containerId }: { cards: VibeCardData[], title?: string, subtitle?: string, align?: "left" | "right", containerId?: string }) {
  const theme = "dark"

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pointer-events-none px-4 md:px-12 lg:px-24" dir="rtl">
      <ContainerScroll containerId={containerId} className="w-full h-[300vh] max-w-full">
        <div className={cn(
          "flex flex-col h-full min-h-[600px] w-full items-center md:items-start",
          align === "left" ? "md:items-end" : "md:items-start"
        )}>
          {(title || subtitle) && (
             <div className={cn(
               "mb-12 pt-16 md:pt-20 max-w-2xl text-center md:text-right z-20 sticky top-16 md:top-20 drop-shadow-2xl pointer-events-auto",
               align === "left" ? "md:mr-[10%] lg:mr-[15%]" : "md:ml-[10%] lg:ml-[15%]"
             )}>
              {title && <h3 className="text-xl md:text-5xl font-black mb-2 uppercase tracking-tight text-white">{title}</h3>}
              {subtitle && <p className="text-xs md:text-base text-white/60">{subtitle}</p>}
            </div>
          )}
          <div className={cn(
            "w-full flex sticky top-24 md:top-32 pb-24 pointer-events-none px-4 z-10 justify-center",
            align === "left" ? "md:justify-end md:pl-24 lg:pl-32" : "md:justify-start md:pr-24 lg:pr-32"
          )}>
            <CardsContainer className="h-[350px] md:h-[450px] w-[280px] md:w-[350px] pointer-events-auto">
            {cards.map((card, index) => (
              <CardTransformed
                arrayLength={cards.length}
                key={card.id || index.toString()}
                variant="dark"
                index={index + 2}
                role="article"
                aria-labelledby={`card-${card.id}-title`}
                aria-describedby={`card-${card.id}-content`}
              >
                <div className="flex flex-col items-center justify-center space-y-4 text-center h-full pt-8">
                  {card.value && (
                    <div className="text-6xl font-black text-teal-400 mb-2 font-display">
                      {card.value}
                    </div>
                  )}
                  {card.label && (
                    <div className="text-sm tracking-widest uppercase text-white/50 mb-4 font-mono">
                      {card.label}
                    </div>
                  )}
                  {card.title && (
                    <h4 id={`card-${card.id}-title`} className="text-2xl font-bold text-white mb-1">
                      {card.title}
                    </h4>
                  )}
                  {card.subtitle && (
                    <h5 className="text-sm font-semibold text-purple-400 mb-4">
                      {card.subtitle}
                    </h5>
                  )}
                  <div className={`mx-auto w-full text-base text-white/80 leading-relaxed`}>
                    <p id={`card-${card.id}-content`}>{card.description}</p>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
        </div>
      </ContainerScroll>
    </div>
  )
}

