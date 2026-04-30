"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  color?: string;
  autoRotateSpeed?: number;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

const hexToRgbString = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const DEFAULT_MARKERS = [
  { lat: 37.78, lng: -122.42, label: "San Francisco" },
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 35.68, lng: 139.69, label: "Tokyo" },
  { lat: -33.87, lng: 151.21, label: "Sydney" },
  { lat: 1.35, lng: 103.82, label: "Singapore" },
  { lat: 55.76, lng: 37.62, label: "Moscow" },
  { lat: -23.55, lng: -46.63, label: "São Paulo" },
  { lat: 19.43, lng: -99.13, label: "Mexico City" },
  { lat: 28.61, lng: 77.21, label: "Delhi" },
  { lat: 36.19, lng: 44.01, label: "Erbil" },
];

const DEFAULT_CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
  { from: [37.78, -122.42], to: [51.51, -0.13] },
  { from: [51.51, -0.13], to: [35.68, 139.69] },
  { from: [35.68, 139.69], to: [-33.87, 151.21] },
  { from: [37.78, -122.42], to: [1.35, 103.82] },
  { from: [51.51, -0.13], to: [28.61, 77.21] },
  { from: [37.78, -122.42], to: [-23.55, -46.63] },
  { from: [1.35, 103.82], to: [-33.87, 151.21] },
  { from: [28.61, 77.21], to: [36.19, 44.01] },
  { from: [51.51, -0.13], to: [36.19, 44.01] },
];

function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(x: number, y: number, z: number, angle: number): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(x: number, y: number, z: number, angle: number): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number, number] {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

export function InteractiveGlobe({
  className,
  size = 600,
  color,
  dotColor: propDotColor,
  arcColor: propArcColor,
  markerColor: propMarkerColor,
  autoRotateSpeed = 0.002,
  connections = DEFAULT_CONNECTIONS,
  markers = DEFAULT_MARKERS,
}: GlobeProps) {
  const rgbString = color ? hexToRgbString(color) : "100, 180, 255";
  const dotColor = propDotColor || `rgba(${rgbString}, ALPHA)`;
  const arcColor = propArcColor || `rgba(${rgbString}, 0.5)`;
  const markerColor = propMarkerColor || `rgba(${rgbString}, 1)`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef(0.4);
  const rotXRef = useRef(0.3);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startRotY: number;
    startRotX: number;
  }>({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const dotsRef = useRef<[number, number, number][]>([]);

  useEffect(() => {
    const dots: [number, number, number][] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < 1200; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 1200);
      dots.push([
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
      ]);
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    const scaledW = Math.round(w * dpr);
    const scaledH = Math.round(h * dpr);

    if (canvas.width !== scaledW || canvas.height !== scaledH) {
      canvas.width = scaledW;
      canvas.height = scaledH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const fov = 600;

    if (!dragRef.current.active) rotYRef.current += autoRotateSpeed;
    timeRef.current += 0.015;
    const time = timeRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.5);
    glowGrad.addColorStop(0, "rgba(60, 140, 255, 0.03)");
    glowGrad.addColorStop(1, "rgba(60, 140, 255, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100, 180, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const ry = rotYRef.current;
    const rx = rotXRef.current;

    for (const dot of dotsRef.current) {
      let [x, y, z] = [dot[0] * radius, dot[1] * radius, dot[2] * radius];
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      
      const depthAlpha = Math.max(0, 1 - (z + radius) / (2 * radius) - 0.15);
      if (depthAlpha <= 0) continue;
      
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + depthAlpha * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace("ALPHA", depthAlpha.toFixed(2));
      ctx.fill();
    }
    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      
      const depthAlpha = Math.max(0, 1 - (z + radius) / (2 * radius));
      if (depthAlpha <= 0.2) continue; // Only skip if fully behind

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const pulse = Math.sin(time * 2 + marker.lat) * 0.5 + 0.5;
      
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = markerColor.replace("1)", `${(0.2 + pulse * 0.15) * depthAlpha})`);
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = markerColor.replace("1)", `${depthAlpha})`);
      ctx.fill();
    }

  }, [dotColor, arcColor, markerColor, autoRotateSpeed, connections, markers]);

  useEffect(() => {
    let frameId: number;
    const render = () => {
      draw();
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [draw]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      rotYRef.current = dragRef.current.startRotY + (e.clientX - dragRef.current.startX) * 0.005;
      rotXRef.current = Math.max(
        -1,
        Math.min(1, dragRef.current.startRotX + (e.clientY - dragRef.current.startY) * 0.005)
      );
    };

    const handlePointerUp = () => {
      dragRef.current.active = false;
      if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startRotY: rotYRef.current,
      startRotX: rotXRef.current,
    };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full cursor-grab", className)}
      onPointerDown={onPointerDown}
      onDragStart={(e) => e.preventDefault()}
      draggable={false}
      style={{ touchAction: 'none' }}
    />
  );
}
