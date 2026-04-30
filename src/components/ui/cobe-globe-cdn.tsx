"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

interface CdnMarker {
  id: string
  location: [number, number]
  region: string
}

interface CdnArc {
  id: string
  from: [number, number]
  to: [number, number]
}

interface GlobeCdnProps {
  markers?: CdnMarker[]
  arcs?: CdnArc[]
  className?: string
  speed?: number
  color?: string
  isActive?: boolean
}

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

const defaultMarkers: CdnMarker[] = []
const defaultArcs: CdnArc[] = []

export function GlobeCdn({
  markers = defaultMarkers,
  arcs = defaultArcs,
  className = "",
  speed = 0.003,
  color = "#ca8af0",
  isActive = true,
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const smoothDragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const rgb = hexToRgb(color)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent | PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const currentPhi = dragOffset.current.phi
      const currentTheta = dragOffset.current.theta
      
      // Transfer the offset to the permanent refs
      phiOffsetRef.current += currentPhi
      thetaOffsetRef.current += currentTheta
      
      // Adjust smooth offset to compensate for the jump in permanent refs
      // This keeps the sum (permanent + smooth) identical at the moment of release
      smoothDragOffset.current.phi -= currentPhi
      smoothDragOffset.current.theta -= currentTheta
      
      // Reset the raw drag offset
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    // @ts-ignore
    e.target?.releasePointerCapture?.(e.pointerId || (e as PointerEvent).pointerId)
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        // Increased sensitivity to match the blue globe (using /200 instead of /300 and /1000)
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 200,
          theta: (e.clientY - pointerInteracting.current.y) / 200,
        }
      }
    }
    const onUp = (e: PointerEvent) => handlePointerUp(e as any)
    canvas.addEventListener("pointermove", handlePointerMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width, height: width,
        phi: 0, theta: 0.2, dark: 1, diffuse: 1.5,
        mapSamples: 16000, mapBrightness: 6,
        baseColor: [rgb[0] * 0.3, rgb[1] * 0.3, rgb[2] * 0.3],
        markerColor: rgb,
        glowColor: [rgb[0] * 0.1, rgb[1] * 0.1, rgb[2] * 0.1],
        markerElevation: 0.02,
        markers: markers.map((m) => ({ location: m.location, size: 0.012, id: m.id })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
        arcColor: rgb,
        arcWidth: 0.5, arcHeight: 0.25, opacity: 0.7,
      })

      function animate() {
        if (isActive) {
          if (!isPausedRef.current) phi += speed
          
          // Add smooth damping for the drag interaction
          smoothDragOffset.current.phi += (dragOffset.current.phi - smoothDragOffset.current.phi) * 0.15
          smoothDragOffset.current.theta += (dragOffset.current.theta - smoothDragOffset.current.theta) * 0.15
  
          globe!.update({
            phi: phi + phiOffsetRef.current + smoothDragOffset.current.phi,
            theta: 0.2 + thetaOffsetRef.current + smoothDragOffset.current.theta,
          })
        }
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, arcs, speed, color])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pyramid-spin {
          0% { transform: rotateX(20deg) rotateY(0deg); }
          100% { transform: rotateX(20deg) rotateY(360deg); }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
      />
    </div>
  )
}
