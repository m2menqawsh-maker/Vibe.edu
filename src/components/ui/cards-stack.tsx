"use client"

import * as React from "react"
import { HTMLMotionProps, motion } from "motion/react"

import { cn } from "@/lib/utils"

interface CardStickyProps extends HTMLMotionProps<"div"> {
  index: number
  incrementY?: number
  incrementZ?: number
  topOffset?: number
}

const StackContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
})
StackContainerScroll.displayName = "StackContainerScroll"

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 10,
      incrementZ = 10,
      topOffset = 0,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const y = topOffset + index * incrementY
    const z = index * incrementZ

    return (
      <motion.div
        ref={ref}
        layout="position"
        style={{
          top: y,
          zIndex: index,
          backfaceVisibility: "hidden",
          ...style,
        }}
        className={cn("sticky", className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

CardSticky.displayName = "CardSticky"

export { StackContainerScroll, CardSticky }
