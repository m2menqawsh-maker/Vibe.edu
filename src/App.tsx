/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import { InteractiveGlobe as UIInteractiveGlobe } from "@/components/ui/interactive-globe";
import { StackContainerScroll, CardSticky } from "./components/ui/cards-stack";
import { HeroScrollAnimation } from "./components/ui/container-scroll-animation";
import { ChevronRight, ChevronLeft, Play, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import * as THREE from "three";
import { InteractiveGridBackground } from "./components/ui/interactive-grid-background";
import InformationDemo from "./components/testimonials-demo";
import { cn } from "@/lib/utils";
import { AnimatedVibeCards, ShuffleCards } from "./components/demo";

const TOPICS = [
  {
    url: "/earth.webp",
    color: "#ca8af0",
    name: "أساسيات Vibe Coding",
    subtitle: "لا تحتاج برمجة، تحتاج برومت",
    title: "المبدأ الأساسي",
    description: "في عصر Vibe Coding، لا تحتاج أن تعرف البرمجة — تحتاج أن تعرف كيف تجد الموارد الصحيحة.",
    bgText: "CORE",
    metrics: {
      tag: "CORE PRINCIPLE",
      title: "NO CODE\nNEEDED",
      stats: [
        { value: "100%", label: "ACCESSIBILITY", desc: "Build high-quality software using natural language without writing code." },
        { value: "10x", label: "SPEED", desc: "Deliver production-ready features faster than traditional coding." }
      ]
    },
    metrics2: {
      tag: "WORKFLOW",
      title: "RAPID\nITERATION",
      stats: [
        { value: "0.85s", label: "RESPONSE TIME" },
        { value: "28.5", label: "ITERATIONS / HR" }
      ],
      description: "Prompt-driven iteration ensures true component precision and consistent build speed, critical for complex applications."
    }
  },
  {
    url: "/Jupiter.webp",
    color: "#2dd4bf",
    name: "الإلهام البصري",
    subtitle: "لا تبدأ قبل أن ترى",
    title: "مواقع الإلهام",
    description: "استخدم منصات مثل Dribbble و Awwwards للبحث عن أفضل تصاميم الواجهات واجمع أفكاراً لمشروعك.",
    bgText: "INSP",
    metrics: {
      tag: "VISUAL STAGE",
      title: "GATHER\nIDEAS",
      stats: [
        { value: "3-5", label: "REFERENCES", desc: "Collect top-tier designs to form a clear visual direction." },
        { value: "15m", label: "RESEARCH TIME", desc: "Spend a focused 15 minutes gathering inspiration before prompting." }
      ]
    },
    metrics2: {
      tag: "CURATION",
      title: "CREATIVE\nVISION",
      stats: [
        { value: "100+", label: "DESIGN ASSETS" },
        { value: "∞", label: "POSSIBILITIES" }
      ],
      description: "Aggregating visual concepts ensures a coherent layout path and aesthetic alignment, critical for high-end user interfaces."
    }
  },
  {
    url: "/Venus.webp",
    color: "#fbbf24",
    name: "التصميم بالذكاء",
    subtitle: "أدوات UI المدعومة بالـ AI",
    title: "التصميم بالـ AI",
    description: "استخدم أدوات مثل Google Stitch و v0 لتحويل النصوص إلى تصميم واجهات كامل في ثوانٍ.",
    bgText: "GEN-X",
    metrics: {
      tag: "UI GENERATION",
      title: "AI DESIGN\nTOOLS",
      stats: [
        { value: "10s", label: "GENERATION TIME", desc: "Rapidly convert text descriptions into functional React components." },
        { value: "∞", label: "ITERATIONS", desc: "Endless possibilities to tweak and adjust the layout with follow-up prompts." }
      ]
    },
    metrics2: {
      tag: "GENERATION",
      title: "PIXEL\nPERFECT",
      stats: [
        { value: "99%", label: "ACCURACY" },
        { value: "0.5mm", label: "PRECISION" }
      ],
      description: "AI-driven layout engines provide flawless component spacing and rotation control, producing immediate and precise structural outputs."
    }
  },
  {
    url: "/Mars.webp",
    color: "#f87171",
    name: "الأصول البصرية",
    subtitle: "توليد الصور والفيديوهات",
    title: "الأصول البصرية",
    description: "اصنع صوراً وخلفيات سينمائية باستخدام Midjourney و Kling AI لجعل موقعك جذاباً واحترافياً.",
    bgText: "STEL",
    metrics: {
      tag: "ASSET CREATION",
      title: "STUNNING\nMEDIA",
      stats: [
        { value: "4K", label: "RESOLUTION", desc: "Generate high-fidelity assets outperforming traditional stock photos." },
        { value: "60fps", label: "FRAME RATE", desc: "Create seamless looping video backgrounds using AI tools." }
      ]
    },
    metrics2: {
      tag: "MULTIMEDIA",
      title: "IMMERSIVE\nDEPTH",
      stats: [
        { value: "3D", label: "SPACE MAPPING" },
        { value: "45°", label: "VIEWING ANGLE" }
      ],
      description: "Dynamically lit assets and seamless environment tracking ensure correct visual context for an extremely engaging aesthetic."
    }
  },
  {
    url: "/Neptune.webp",
    color: "#60a5fa",
    name: "مكتبات جاهزة",
    subtitle: "انسخ والصق",
    title: "مكتبات UI",
    description: "استخدم مكتبات جاهزة مثل shadcn/ui و Aceternity لبناء واجهاتك بسرعة وبدون تعقيد.",
    bgText: "TECH",
    metrics: {
      tag: "COMPONENT LIBRARIES",
      title: "COPY &\nPASTE",
      stats: [
        { value: "50+", label: "COMPONENTS", desc: "Access huge libraries of pre-built, accessible UI elements." },
        { value: "0", label: "SETUP TIME", desc: "Instantly integrate components directly into your Next.js or React app." }
      ]
    },
    metrics2: {
      tag: "ARCHITECTURE",
      title: "MODULAR\nSCALE",
      stats: [
        { value: "99.9%", label: "COMPATIBILITY" },
        { value: "1ms", label: "IMPORT TIME" }
      ],
      description: "Copy-pasting modular UI fragments guarantees identical behavior and structure, completely eliminating tedious configuration stages."
    }
  },
  {
    url: "/earth.webp",
    color: "#8af0a2",
    name: "البناء الفعلي",
    subtitle: "مواقع جاهزة في دقائق",
    title: "نشر المواقع",
    description: "انتقل من الفكرة إلى موقع منشور باستخدام أدوات مثل Lovable و Emergent.sh لبناء التطبيق.",
    bgText: "FLOW",
    metrics: {
      tag: "DEPLOYMENT",
      title: "SHIP\nFASTER",
      stats: [
        { value: "1-CLK", label: "DEPLOY", desc: "Seamless deployment to platforms like Vercel or Netlify." },
        { value: "$0", label: "STARTING COST", desc: "Launch your applications for free using modern serverless platforms." }
      ]
    },
    metrics2: {
      tag: "PRODUCTION",
      title: "GLOBAL\nREACH",
      stats: [
        { value: "300ms", label: "FIRST PAINT" },
        { value: "100%", label: "UPTIME" }
      ],
      description: "Continuous integration securely distributes the finalized code edge-to-edge, guaranteeing worldwide reliability and optimal speeds."
    }
  }
];

function CarouselItem({ index, currentIndex, url, color, count, activeSection }: any) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    let dist = (index - currentIndex) % count;
    if (dist > count / 2) dist -= count;
    if (dist < -count / 2) dist += count;

    const isActive = Math.abs(dist) < 0.1;

    let targetX = dist * 15;
    let targetY = 0;
    let targetScale = isActive ? 1 : 0.5;

    if (isActive) {
      if (activeSection === 0) {
        targetX = 0;
        targetScale = 1;
      } else if (activeSection === 1) {
        targetX = 7.5;
        targetScale = 2.8;
      } else if (activeSection === 2) {
        targetX = -7.5;
        targetScale = 3.0;
      } else if (activeSection === 3) {
        // Circular/Elliptical path for "atmospheric" section
        const orbitTime = state.clock.elapsedTime * 0.5 + index * (Math.PI * 2 / count);
        targetX = Math.cos(orbitTime) * 8;
        targetY = 22 + Math.sin(orbitTime * 0.5) * 2;
        targetScale = 0.45;
      } else if (activeSection === 4) {
        targetX = 0;
        targetY = 0;
        targetScale = 0.85;
      } else if (activeSection === 5) {
        targetX = 0;
        targetY = 0.8;
        targetScale = 0.95;
      } else if (activeSection === 6) {
        targetX = 0;
        targetY = -8;
        targetScale = 1.8;
      } else if (activeSection === 7) {
        targetX = 0;
        targetY = 10;
        targetScale = 0;
      }
    } else {
      if (activeSection >= 7) {
         targetY = 10;
         targetScale = 0;
      }
    }

    if (Math.abs(targetX - groupRef.current.position.x) > 20) {
      groupRef.current.position.x = targetX;
    }

    // Dynamic floating and rotation based on position
    const floatY = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    const finalTargetY = targetY + floatY;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 15, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, finalTargetY, 15, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 15, delta));

    // Improved rotation: Look at user (face camera) + position-based tilt
    // We add a 'bank' effect when moving laterally to make it feel more aerodynamic
    const tiltX = (groupRef.current.position.y / 20) * Math.PI * 0.3;
    const bankZ = -groupRef.current.position.x * 0.15;
    
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, tiltX, 5, delta);
    groupRef.current.rotation.y += delta * 0.2; // Continuous lazy spin
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, bankZ, 5, delta);
  });

  return (
    <group ref={groupRef} />
  )
}

function Podium({ activeSection }: { activeSection: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = activeSection === 5 ? -2.0 : -10;
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 8, delta);
  });

  return (
    <group ref={groupRef} position={[0, -10, 0]}>
      {/* Top tier */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.8, 64]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          roughness={0.05}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      {/* Top tier rim ring */}
      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.6, 128]} />
        <meshBasicMaterial color="#888888" />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, 0.405, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 1.5, 64]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Middle tier */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.8, 64]} />
        <meshPhysicalMaterial
          color="#181818"
          roughness={0.1}
          metalness={0.85}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Middle tier rim ring */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.45, 2.5, 128]} />
        <meshBasicMaterial color="#666666" />
      </mesh>

      {/* Bottom tier */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[4.0, 4.0, 1.5, 64]} />
        <meshPhysicalMaterial
          color="#141414"
          roughness={0.15}
          metalness={0.8}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {/* Bottom tier rim ring */}
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.95, 4.0, 128]} />
        <meshBasicMaterial color="#555555" />
      </mesh>
    </group>
  );
}

function Carousel({ currentIndex, activeSection }: { currentIndex: number, activeSection: number }) {
  const count = TOPICS.length;
  return (
    <group position={[0, 0, 0]}>
      {TOPICS.map((topic, i) => (
        <CarouselItem 
          key={i} 
          index={i} 
          currentIndex={currentIndex} 
          url={topic.url} 
          color={topic.color} 
          count={count} 
          activeSection={activeSection}
        />
      ))}
    </group>
  );
}

function FloatingShapes({ activeSection, mouseX, mouseY }: { activeSection: number; mouseX: any; mouseY: any }) {
  const meshBoxRef = useRef<THREE.InstancedMesh>(null);
  const meshTetraRef = useRef<THREE.InstancedMesh>(null);
  const count = 60; // 60 + 60 = 120 total shapes
  
  const dummy = useRef(new THREE.Object3D());

  // Initialize shapes data
  const shapes = useRef(
    Array.from({ length: count * 2 }).map((_, i) => {
      const initialX = (Math.random() - 0.5) * 50;
      const initialY = (Math.random() - 0.5) * 60;
      const initialZ = (Math.random() - 0.5) * 20 - 5;
      
      return {
        type: i < count ? 'box' : 'tetra',
        pos: new THREE.Vector3(initialX, initialY, initialZ),
        renderPos: new THREE.Vector3(initialX, initialY, initialZ),
        pushX: 0,
        pushY: 0,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: 0.3 + Math.random() * 0.7,
        speed: 0.01 + Math.random() * 0.03,
        interactionFactor: 5 + Math.random() * 7,
        rotSpeed: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ],
        color: new THREE.Color().setHSL(Math.random() * 0.2 + (i % 2 === 0 ? 0.7 : 0.45), 0.8, 0.6)
      };
    })
  );

  // Set initial colors once
  useEffect(() => {
    if (meshBoxRef.current && meshTetraRef.current) {
      shapes.current.forEach((shape, i) => {
        if (shape.type === 'box') {
          meshBoxRef.current!.setColorAt(i, shape.color);
        } else {
          meshTetraRef.current!.setColorAt(i - count, shape.color);
        }
      });
      meshBoxRef.current.instanceColor!.needsUpdate = true;
      meshTetraRef.current.instanceColor!.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshBoxRef.current || !meshTetraRef.current) return;

    const isLastSection = activeSection >= 7;
    const densityTargetScale = isLastSection ? 1.8 : 0.6;
    const speedFactor = isLastSection ? 3.0 : 1.0;
    
    // Normalized Mouse Coordinates translated to scene units
    const mousePos = new THREE.Vector3(mouseX.get() * 35, -mouseY.get() * 25, 0);

    shapes.current.forEach((shape, i) => {
      // 1. Natural Vertical Flow
      shape.pos.y += shape.speed * speedFactor * (delta * 60);

      // Wrap around logic - MUST teleport renderPos to avoid streaking
      if (shape.pos.y > 35) {
        shape.pos.y = -35;
        shape.pos.x = (Math.random() - 0.5) * 50;
        shape.pos.z = (Math.random() - 0.5) * 20 - 5;
        shape.renderPos.copy(shape.pos);
      }

      // 2. Repulsion Logic
      // Calculate distance between mouse and shape's current logical position
      const dist = mousePos.distanceTo(shape.pos);
      const repulsionRadius = 12; // Moderate radius
      const repulsionStrength = 8; // Max push distance
      
      let targetPushX = 0;
      let targetPushY = 0;

      if (dist < repulsionRadius) {
        const factor = Math.pow(1 - dist / repulsionRadius, 2);
        const dirX = shape.pos.x - mousePos.x;
        const dirY = shape.pos.y - mousePos.y;
        
        // Normalize direction and apply strength
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        targetPushX = (dirX / len) * factor * repulsionStrength;
        targetPushY = (dirY / len) * factor * repulsionStrength;
      }

      // Instead of instant damping towards target, we define a constant max movement speed.
      // This means the reaction doesn't depend on how fast the mouse jumps.
      const diffX = targetPushX - shape.pushX;
      const diffY = targetPushY - shape.pushY;
      const lenDiff = Math.sqrt(diffX * diffX + diffY * diffY);

      // Speed of dodging vs speed of returning
      const moveSpeed = (targetPushX !== 0 || targetPushY !== 0) ? 25 : 10;
      const maxDelta = moveSpeed * delta;

      if (lenDiff > maxDelta) {
        shape.pushX += (diffX / lenDiff) * maxDelta;
        shape.pushY += (diffY / lenDiff) * maxDelta;
      } else {
        shape.pushX = targetPushX;
        shape.pushY = targetPushY;
      }

      // 3. The render position is strictly logical pos + current evaluated push
      const targetX = shape.pos.x + shape.pushX;
      const targetY = shape.pos.y + shape.pushY;
      const targetZ = shape.pos.z + (shape.pushX * 0.1); 

      // Light damping to smooth out any small jitter, but primary movement is bounded by moveSpeed
      shape.renderPos.x = THREE.MathUtils.damp(shape.renderPos.x, targetX, 15, delta);
      shape.renderPos.y = THREE.MathUtils.damp(shape.renderPos.y, targetY, 15, delta);
      shape.renderPos.z = THREE.MathUtils.damp(shape.renderPos.z, targetZ, 15, delta);

      // 4. Update dummy and matrix
      dummy.current.position.copy(shape.renderPos);

      shape.rotation.x += shape.rotSpeed[0] * (delta * 60);
      shape.rotation.y += shape.rotSpeed[1] * (delta * 60);
      shape.rotation.z += shape.rotSpeed[2] * (delta * 60);
      dummy.current.rotation.copy(shape.rotation);

      // Scale (Density Control)
      const targetScale = shape.scale * densityTargetScale;
      const isVisibleEarly = i % 3 === 0;
      const finalTargetScale = (isLastSection || isVisibleEarly) ? targetScale : 0;
      
      dummy.current.scale.setScalar(THREE.MathUtils.damp(dummy.current.scale.x, finalTargetScale, 10, delta));

      dummy.current.updateMatrix();

      if (shape.type === 'box') {
        meshBoxRef.current!.setMatrixAt(i, dummy.current.matrix);
      } else {
        meshTetraRef.current!.setMatrixAt(i - count, dummy.current.matrix);
      }
    });

    meshBoxRef.current.instanceMatrix.needsUpdate = true;
    meshTetraRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshBoxRef} args={[null as any, null as any, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          roughness={0.2} 
          metalness={0.8} 
          transparent 
          opacity={0.6}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </instancedMesh>
      <instancedMesh ref={meshTetraRef} args={[null as any, null as any, count]} frustumCulled={false}>
        <tetrahedronGeometry args={[1]} />
        <meshStandardMaterial 
          roughness={0.2} 
          metalness={0.8} 
          transparent 
          opacity={0.6}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </instancedMesh>
    </group>
  );
}

function CanvasRings({ activeSection, mouseX, mouseY }: { activeSection: number, mouseX: any, mouseY: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const targetRotX = (mouseY.get() * 20 * Math.PI) / 180;
    const targetRotY = (mouseX.get() * 20 * Math.PI) / 180;
    
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
    groupRef.current.rotation.z -= delta * 0.1; // slow continuous rotation
    
    const targetScale = activeSection === 4 ? (isMobile ? 0.8 : 1.0) : 0; 
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, activeSection === 4 ? 6 : 15, delta));
    groupRef.current.visible = groupRef.current.scale.x > 0.01;
  });

  return (
    <group ref={groupRef}>
       {/* 3D concentric Rings hugging the globe */}
      <mesh>
        <torusGeometry args={[2.05, 0.005, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh>
        <torusGeometry args={[2.2, 0.008, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      {/* Dashed outer ring */}
      <mesh>
        <torusGeometry args={[2.5, 0.012, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} wireframe />
      </mesh>
      
      {/* 45 degree Markers */}
      {[45, 135, 225, 315].map((deg) => (
         <group key={`m-${deg}`} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <mesh position={[0, 2.5, 0]}>
               <boxGeometry args={[0.03, 0.3, 0.03]} />
               <meshBasicMaterial color="#2dd4bf" transparent opacity={0.8} />
            </mesh>
         </group>
      ))}

      {/* Axis Crosshairs */}
      <mesh>
         <boxGeometry args={[6, 0.01, 0.01]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
         <boxGeometry args={[6, 0.01, 0.01]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>
      {/* Red crosshair centers floating */}
      {[0, 90, 180, 270].map((deg) => (
         <group key={`c-${deg}`} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <mesh position={[0, 2.2, 0]}>
               <boxGeometry args={[0.03, 0.4, 0.03]} />
               <meshBasicMaterial color="#ca8af0" transparent opacity={0.8} />
            </mesh>
         </group>
      ))}
    </group>
  );
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const isScrolling = useRef(false);
  const touchStart = useRef(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const count = TOPICS.length;
  const normalizedIndex = ((currentIndex % count) + count) % count;
  const activeTopic = TOPICS[normalizedIndex];

  const handleNextBtn = () => { setCurrentIndex(prev => prev + 1); setActiveSection(0); };
  const handlePrevBtn = () => { setCurrentIndex(prev => prev - 1); setActiveSection(0); };

  const handleWheel = (e: React.WheelEvent) => {
    const scrollContainer = sectionRefs.current[activeSection];
    
    // Check if we should allow internal scrolling
    if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
      const style = window.getComputedStyle(scrollContainer);
      if (style.overflowY !== "hidden") {
        const isAtBottom = Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight) >= scrollContainer.scrollHeight - 20;
        const isAtTop = scrollContainer.scrollTop <= 20;

        // If native scroll doesn't happen because we hovered a pointer-events-none area,
        // we manually scroll the container
        if (e.deltaY > 0 && !isAtBottom) {
          scrollContainer.scrollTop += e.deltaY;
          return; 
        }
        if (e.deltaY < 0 && !isAtTop) {
          scrollContainer.scrollTop += e.deltaY;
          return; 
        }
      }
    }

    if (Math.abs(e.deltaY) < 15) return;
    
    if (isScrolling.current) return;
    
    isScrolling.current = true;
    if (e.deltaY > 0) setActiveSection(p => Math.min(p + 1, 7));
    else setActiveSection(p => Math.max(p - 1, 0));
    setTimeout(() => { isScrolling.current = false; }, 800);
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrolling.current) return;
    const touchEnd = e.changedTouches[0].clientY;
    const deltaY = touchStart.current - touchEnd;

    const scrollContainer = sectionRefs.current[activeSection];
    if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
      const style = window.getComputedStyle(scrollContainer);
      if (style.overflowY !== "hidden") {
        const isAtBottom = Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight) >= scrollContainer.scrollHeight - 20;
        const isAtTop = scrollContainer.scrollTop <= 20;

        if (deltaY > 40 && !isAtBottom) return; 
        if (deltaY < -40 && !isAtTop) return;
      }
    }

    if (Math.abs(deltaY) > 40) {
      isScrolling.current = true;
      if (deltaY > 0) setActiveSection(p => Math.min(p + 1, 7));
      else setActiveSection(p => Math.max(p - 1, 0));
      setTimeout(() => { isScrolling.current = false; }, 800);
    }
  };

  const pointerRotateX = useTransform(mouseY, [-1, 1], [15, -15]);
  const pointerRotateY = useTransform(mouseX, [-1, 1], [-15, 15]);
  const springRotateX = useSpring(pointerRotateX, { stiffness: 100, damping: 30 });
  const springRotateY = useSpring(pointerRotateY, { stiffness: 100, damping: 30 });

  return (
    <div 
      className="w-full relative font-sans text-white h-screen bg-[#09090b] overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#ca8af0]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2dd4bf]/10 blur-[120px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1506318137071-a8e063b497a1?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>

      {/* Background Layer with Technical Big Text - REMOVED */}
      <div className="absolute inset-0 z-0 bg-[#09090b]" />
      
      <InteractiveGridBackground className="opacity-40" />

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center">
        <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} className="pointer-events-auto h-full w-full">
          <ambientLight intensity={0.3} />
          {/* Strong back light from above to create Rim */}
          <spotLight position={[0, 15, -5]} intensity={30} angle={0.3} penumbra={0.5} />
          {/* Soft front light */}
          <pointLight position={[0, 2, 8]} intensity={8} distance={20} />
          {/* Side lights to enhance edges */}
          <spotLight position={[-8, 5, 3]} intensity={20} angle={0.3} penumbra={1} />
          <spotLight position={[8, 5, 3]} intensity={20} angle={0.3} penumbra={1} />
          
          <Environment preset="studio" background={false} />
          
          <React.Suspense fallback={null}>
            <Carousel currentIndex={currentIndex} activeSection={activeSection} />
            <Podium activeSection={activeSection} />
            <FloatingShapes activeSection={activeSection} mouseX={mouseX} mouseY={mouseY} />
            <CanvasRings activeSection={activeSection} mouseX={mouseX} mouseY={mouseY} />
          </React.Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
        {TOPICS.map((topic, i) => {
          let dist = (i - currentIndex) % TOPICS.length;
          if (dist > TOPICS.length / 2) dist -= TOPICS.length;
          if (dist < -TOPICS.length / 2) dist += TOPICS.length;
          const isActive = Math.abs(dist) < 0.1;
          const isVisible = Math.abs(dist) < 1.1; // Only render current and immediate neighbors for performance
          const GlobeComponent = i % 2 === 0 ? GlobeCdn : UIInteractiveGlobe;
          
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          
          // Calculate lateral movement based on activeSection
          let xValue = "0%";
          let yValue = "0";
          let scaleValue = 1;
          let opacityValue = isActive ? 1 : 0;

          if (activeSection === 1) {
            xValue = isMobile ? "-25vw" : "-50vw"; // Partially move left on mobile, full on desktop
            yValue = "0"; 
            scaleValue = isMobile ? 1.6 : 2.2; 
          } else if (activeSection === 2) {
            xValue = isMobile ? "25vw" : "50vw"; 
            yValue = "0";
            scaleValue = isMobile ? 1.6 : 2.2;
          } else if (activeSection === 3) {
            opacityValue = 0; 
          } else if (activeSection === 4) {
            xValue = "0";
            yValue = "0";
            scaleValue = isMobile ? 1.1 : 1.15; 
            opacityValue = isActive ? 1 : 0;
          } else if (activeSection === 5) {
            xValue = "0";
            yValue = isMobile ? "-40px" : "-70px"; 
            scaleValue = isMobile ? 0.95 : 1.0; 
            opacityValue = isActive ? 1 : 0;
          } else if (activeSection >= 6) {
            opacityValue = 0; 
          }

          if (!isVisible) return null;

          return (
            <motion.div
              key={i}
              animate={{
                x: xValue,
                y: yValue,
                scale: scaleValue,
                opacity: opacityValue,
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.23, 1, 0.32, 1] 
              }}
              style={{
                position: 'absolute',
                width: isMobile ? '40vh' : '60vh',
                height: isMobile ? '40vh' : '60vh',
                overflow: 'hidden',
                pointerEvents: (isActive && activeSection < 3) ? 'auto' : 'none',
              }}
            >
              <GlobeComponent isActive={isActive} className="w-full h-full" color={topic.color} />
            </motion.div>
          );
        })}
      </div>

      {/* UI Overlay Shared: Topic Interaction Controls (Elegant Asymmetrical Hero Layout) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 0 ? 1 : 0,
          zIndex: activeSection === 0 ? 150 : 0
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="h-full flex flex-col justify-between p-8 md:p-16 relative">
             {/* Decorative Corner Marker (Asymmetrical) */}
             <div className="absolute top-8 left-8 w-2 h-2 border-l border-t border-white/20" />
             
             {/* Top-Left Corner: Elegant asymmetrical info */}
              <div dir="rtl" className="flex flex-col items-center md:items-start text-center md:text-right pointer-events-auto max-w-sm mx-auto md:mx-0 mt-20 md:mt-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`title-container-${activeTopic.title}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="flex items-center gap-4 mb-3">
                         <div className="w-10 h-[1px] bg-white/20" />
                         <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em] font-light">
                           SERIES_0{normalizedIndex + 1}
                         </span>
                      </div>
                      <h2 
                        className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tighter leading-none transition-colors duration-500"
                        style={{ color: activeTopic.color }}
                      >
                        {activeTopic.title}
                      </h2>
                      <p className="text-[11px] font-sans text-white/40 max-w-[260px] leading-relaxed pr-0 border-none">
                        {activeTopic.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
              </div>

              {/* Bottom Right: Minimalist Controls (Non-symmetrical balance) */}
              <div className="flex flex-col items-end gap-8 pointer-events-auto" dir="ltr">
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrevBtn(); }} 
                      className="w-10 h-10 rounded-full border border-white/5 glass flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 group"
                    >
                        <ChevronLeft className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextBtn(); }} 
                      className="w-10 h-10 rounded-full border border-white/5 glass flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 group"
                    >
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                  
                  {/* Vertical Progress Indicator for Topics (Asymmetrical) */}
                  <div className="flex flex-col gap-1.5">
                    {TOPICS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-0.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-12 opacity-100' : 'w-4 opacity-10'}`}
                        style={{ backgroundColor: i === currentIndex ? activeTopic.color : 'white' }}
                      />
                    ))}
                  </div>
              </div>
        </div>
      </motion.div>

      {/* UI Overlay Layer 1: Hero View */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: activeSection === 0 ? 1 : 0, 
          y: activeSection === 0 ? 0 : -50,
          zIndex: activeSection === 0 ? 105 : 20
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      >
      
          {/* Promo Video Overlay - REMOVED */}
        </motion.div>

      {/* UI Overlay Layer 2: Details View */}
      <motion.div 
        ref={(el) => { sectionRefs.current[1] = el; }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 1 ? 1 : 0, 
          pointerEvents: activeSection === 1 ? "auto" : "none",
          zIndex: activeSection === 1 ? 140 : 20
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 flex text-white overflow-hidden pointer-events-none"
        id="scroll-section-1"
      >
        <div className="w-full min-h-full pointer-events-none flex flex-col justify-center md:justify-start items-center md:items-end px-6 md:px-24 py-20 md:py-0">
            <div className={activeSection === 1 ? "w-full" : "pointer-events-none opacity-0 w-full"} style={{ transition: 'opacity 0.3s' }}>
              <ShuffleCards 
                title="الإلهام البصري أولاً"
                subtitle="سر الـ Vibe Coding يبدأ من التغذية البصرية المتجددة"
              />
            </div>
        </div>
      </motion.div>

      {/* UI Overlay Layer 3: Details View 2 */}
      <motion.div 
        ref={(el) => { sectionRefs.current[2] = el; }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 2 ? 1 : 0, 
          pointerEvents: activeSection === 2 ? "auto" : "none",
          y: activeSection === 2 ? 0 : 50,
          zIndex: activeSection === 2 ? 130 : 20
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 text-white overflow-y-auto overflow-x-hidden custom-scrollbar pointer-events-none"
        id="scroll-section-2"
      >
        <div className="w-full min-h-full pointer-events-none flex flex-col items-center md:items-start pl-6 md:pl-10 pr-6 md:pr-24 py-20 md:py-0">
            <div className={activeSection === 2 ? "w-full" : "pointer-events-none w-full opacity-0"} style={{ transition: 'opacity 0.3s' }}>
              <AnimatedVibeCards 
              containerId="scroll-section-2"
              title="أدوات التصميم بالذكاء"
              subtitle="تحويل الأفكار إلى واجهات حقيقية"
              align="left"
              cards={[
                {
                   id: "card-2-1",
                   title: "Google Stitch & v0",
                   subtitle: "توليد الواجهات الفوري",
                   description: "بمجرد إدخال وصف للـ Vibe المطلوب، تقوم هذه الأدوات ببناء هيكل وألوان ومكونات الواجهة في ثوانٍ معدودة لتصبح قادرة على التفاعل.",
                },
                {
                   id: "card-2-2",
                   title: "مرونة التعديل",
                   subtitle: "Iterative Prompting",
                   description: "لا تحتاج للبحث عن الخطأ البرمجي، بل يمكنك توجيه النظام من خلال المحادثة لتعديل أجزاء دقيقة جداً بشكل فوري لضمان الجودة العالية.",
                },
                {
                   id: "card-2-3",
                   title: "الدقة المثالية",
                   subtitle: "Pixel Perfect",
                   description: "رغم السرعة الهائلة، ستحصل لى دقة متناهية تلبي معايير أفضل مصممي الواجهات العالميين وتتفوق على الأساليب التقليدية."
                }
              ]}
            />
            </div>
        </div>
      </motion.div>

      {/* UI Overlay Layer 5: HUD View */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 4 ? 1 : 0, 
          pointerEvents: activeSection === 4 ? "auto" : "none",
          scale: activeSection === 4 ? 1 : 1.05,
          zIndex: activeSection === 4 ? 50 : 20
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 z-20 flex pointer-events-none items-center justify-center overflow-hidden"
      >
          {/* Left Metrics HUD */}
          <div className="absolute left-[5%] md:left-[10%] top-[20%] md:top-[30%] flex flex-col items-start min-w-[140px] md:min-w-[200px]">
             <div className="flex flex-col items-start relative ml-[40px] md:ml-[70px]">
               <div className="text-[8px] md:text-[10px] font-mono tracking-widest text-[#a1a1aa] mb-2 uppercase">
                 زمن الاستجابة
               </div>
               <div className="absolute w-[1px] h-4 md:h-6 bg-white/30 left-0 -bottom-3 md:-bottom-5" />
             </div>
             
             <div className="flex items-center gap-2 md:gap-4 mt-4">
                <div className="w-[1px] md:w-[2px] h-8 md:h-12 bg-white" />
                <div className="flex flex-col">
                  <div className="text-2xl md:text-4xl font-display font-bold leading-none mb-1 text-white">
                    ٩٩.٩<span className="text-lg md:text-xl">٪</span>
                  </div>
                  <div className="text-[8px] md:text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase mt-1">
                    كفاءة الأداء الرقمي
                  </div>
                </div>
             </div>
          </div>

          <div className="absolute left-[5%] md:left-[10%] top-[45%] md:top-[50%] text-[8px] md:text-[10px] font-mono tracking-widest text-[#71717a]">
            معدل الدقة المعرفية: ٩٩.٩٨٪
          </div>

          {/* Right Metrics HUD */}
          <div className="absolute right-[5%] md:right-[10%] bottom-[20%] md:bottom-[30%] flex flex-col items-end min-w-[140px] md:min-w-[200px]">
             <div className="flex items-center gap-2 md:gap-4">
                <div className="flex flex-col text-right">
                  <div className="text-2xl md:text-4xl font-display font-bold leading-none mb-1 text-white">
                    ذكاء توليدي
                  </div>
                  <div className="text-[8px] md:text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase mt-1">
                    تحليل الأنماط الذكي
                  </div>
                </div>
                <div className="w-[1px] md:w-[2px] h-8 md:h-12 bg-white" />
             </div>

             <div className="flex flex-col items-end relative mr-[40px] md:mr-[70px] mt-4">
               <div className="absolute w-[1px] h-4 md:h-6 bg-white/30 right-0 -top-3 md:-top-5" />
               <div className="text-[8px] md:text-[10px] font-mono tracking-widest text-[#a1a1aa] mt-2 uppercase">
                 تكامل البيانات النسبي
               </div>
             </div>
          </div>

          <div className="absolute right-[5%] md:right-[10%] top-[45%] md:top-[50%] text-[8px] md:text-[10px] font-mono tracking-widest text-[#71717a]">
            الحالة: تطور مستقر
          </div>

      </motion.div>

      {/* UI Overlay Layer 6: Podium View */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 5 ? 1 : 0, 
          pointerEvents: activeSection === 5 ? "auto" : "none",
          y: activeSection === 5 ? 0 : (activeSection > 5 ? -50 : 50),
          zIndex: activeSection === 5 ? 50 : 20
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 z-20 flex flex-col pointer-events-none"
      >
        <div className="mt-32 md:mt-40 w-full flex flex-col items-center">
        </div>

        <div className="absolute top-[35%] md:top-[45%] w-full px-6 md:px-24 flex flex-col md:flex-row justify-between items-center gap-64 md:gap-0 -translate-y-1/2">
            <div className="flex flex-col text-right md:text-left max-w-[180px] md:max-w-[200px] border-r md:border-r-0 md:border-l border-white/20 pr-4 md:pr-0 md:pl-6 py-4 glass rounded-l-xl md:rounded-l-none md:rounded-r-xl">
                <div className="text-[9px] md:text-[10px] font-mono tracking-widest text-[#ca8af0] mb-2 uppercase">ذكاء فائق</div>
                <div className="text-xl md:text-2xl font-display font-bold text-white mb-2 md:mb-3 tracking-tight">نواة ذكية</div>
                <p className="text-[10px] md:text-xs text-white/40 leading-relaxed">بنية تحتية مصممة خصيصاً لمعالجة الـ Vibes وتحويلها لواقع رقمي.</p>
            </div>
            
            <div className="flex flex-col text-right max-w-[180px] md:max-w-[200px] border-r border-white/20 pr-4 md:pr-6 py-4 glass rounded-l-xl">
                <div className="text-[9px] md:text-[10px] font-mono tracking-widest text-[#2dd4bf] mb-2 uppercase">سهولة مطلقة</div>
                <div className="text-xl md:text-2xl font-display font-bold text-white mb-2 md:mb-3 tracking-tight">بيئة متكاملة</div>
                <p className="text-[10px] md:text-xs text-white/40 leading-relaxed">نظام يربط جميع أدواتك في واجهة واحدة متناغمة وسهلة الاستخدام.</p>
            </div>
        </div>
      </motion.div>

      {/* UI Overlay Layer 7: Information (New Section 6) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 6 ? 1 : 0, 
          y: activeSection === 6 ? 0 : 30,
          zIndex: activeSection === 6 ? 50 : 20
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
      >
        <div className="w-full pointer-events-none flex flex-col h-full justify-center overflow-hidden pt-16">
          <div className={cn("flex flex-col items-center w-full", activeSection === 6 ? "pointer-events-auto" : "pointer-events-none")}>
            <div className="text-center mb-12 shrink-0 px-4 md:px-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" dir="rtl">لماذا تحتاج مبادئ <span className="text-gradient">Vibe Coding</span>؟</h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto" dir="rtl">غيّر نظرتك وعزز قدراتك التقنية مع هذه الحقائق التي توضح الإمكانيات المخفية لمستقبل تطوير الواجهات.</p>
            </div>
            <div className="flex-1 min-h-0 relative w-full">
              <InformationDemo />
            </div>
          </div>
        </div>
      </motion.div>

      {/* UI Overlay Layer 8: Final View sticky cards (Index 7) */}
      <motion.div 
        ref={(el) => { sectionRefs.current[7] = el; }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 7 ? 1 : 0, 
          pointerEvents: activeSection === 7 ? "auto" : "none",
          y: activeSection === 7 ? 0 : 50,
          zIndex: activeSection === 7 ? 50 : 20
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 overflow-y-auto"
      >
        <div className="container min-h-screen px-6 text-white text-center flex flex-col items-center">
          <div className="sticky top-0 z-50 w-screen left-1/2 -ml-[50vw] pt-20 pb-4 bg-gradient-to-b from-[#09090b] via-[#09090b]/95 to-transparent">
            <div className="w-full max-w-4xl mx-auto px-6">
              <h5 className="text-xs uppercase tracking-widest text-[#ca8af0] mb-2" dir="rtl">خارطة الطريق</h5>
              <h2 className="mb-4 mt-2 text-3xl md:text-5xl font-bold tracking-tight text-white" dir="rtl">
                رحلتك في عالم <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ca8af0] to-[#2dd4bf]">Vibe Coding</span>
              </h2>
              <p className="max-w-prose text-zinc-400 mx-auto text-sm md:text-base" dir="rtl">
                نحن نؤمن أن الإبداع لا حدود له. من الفكرة إلى التنفيذ، هنا تجد كل ما تحتاجه لبناء تطبيقاتك القادمة.
              </p>
            </div>
          </div>

          <StackContainerScroll className="min-h-[800vh] space-y-16 py-12 max-w-2xl">
            {TOPICS.map((topic, index) => (
              <CardSticky
                key={index}
                index={index}
                incrementY={10}
                topOffset={300}
                className="rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl bg-[#18181b]/95 text-right"
              >
                <div className="flex items-center justify-between gap-4 mb-6" dir="ltr">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ca8af0] to-[#2dd4bf]">
                    {String(index + 1).padStart(2, "0")}
                  </h3>
                  <h2 className="text-2xl font-bold tracking-tighter text-white" dir="rtl">
                    {topic.name}
                  </h2>
                </div>

                <div className="space-y-4" dir="rtl">
                   <h4 className="text-xl font-semibold" style={{ color: topic.color }}>{topic.title}</h4>
                   <p className="text-zinc-300 leading-relaxed">{topic.description}</p>
                   
                   <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                      {topic.metrics.stats.map((stat: any, si: number) => (
                        <div key={si} className="text-right">
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </CardSticky>
            ))}
            
            {/* Final Call to Action Card */}
            <CardSticky
              index={TOPICS.length}
              incrementY={10}
              topOffset={300}
              className="rounded-2xl border-2 border-dashed border-white/20 p-12 shadow-2xl backdrop-blur-xl bg-white/5 text-center flex flex-col items-center justify-center min-h-[300px]"
            >
               <h2 className="text-4xl font-bold mb-6 text-white" dir="rtl">هل أنت جاهز للبداية؟</h2>
               <button 
                  onClick={() => setActiveSection(0)}
                  className="px-12 py-5 bg-white text-black font-bold tracking-widest text-lg hover:scale-105 transition-transform rounded-full flex items-center gap-3 active:scale-95 group"
                >
                  <ChevronLeft className="w-5 h-5 rotate-90 group-hover:-translate-y-1 transition-transform" />
                  الرجوع للأعلى
               </button>
            </CardSticky>
          </StackContainerScroll>

          <div className="h-[20vh]" />
        </div>
      </motion.div>

      {/* UI Overlay Layer 4: Hero Scroll Exploration (Now at index 3) */}
      <motion.div 
        ref={(el) => { sectionRefs.current[3] = el; }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: activeSection === 3 ? 1 : 0, 
          y: activeSection === 3 ? 0 : 100,
          zIndex: activeSection === 3 ? 50 : 20
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 overflow-y-auto bg-transparent text-white pointer-events-none"
        id="scroll-section-3"
      >
        <div className="w-full flex flex-col items-center pointer-events-none">
          <div className={activeSection === 3 ? "w-full" : "w-full pointer-events-none opacity-0"} style={{ transition: 'opacity 0.3s' }}>
            <HeroScrollAnimation
            containerId="scroll-section-3"
            titleComponent={
              <div className="flex flex-col items-center">
                <p className="text-zinc-400 max-w-xl mx-auto mt-4 text-lg font-sans" dir="rtl">
                  الفكرة ليست في الكود، بل في "الفايب" الذي تخلقه التجربة الرقمية.
                </p>
              </div>
            }
          >
            <div className="w-full h-full glass flex flex-col items-center justify-center p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ca8af0]/5 to-[#2dd4bf]/5 pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#ca8af0]/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#2dd4bf]/10 blur-[100px] rounded-full" />
              
              <div className="space-y-4 relative z-10">
                <div className="text-[10px] font-mono tracking-[0.5em] text-[#ca8af0]/70 uppercase">HYPER_DRIVE // ACTIVATED</div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight" dir="rtl">الإبداع بلا حدود</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-8 w-full max-w-2xl border-t border-white/5 pt-12 mt-12">
                <div className="text-right">
                  <div className="text-4xl font-display font-light text-[#2dd4bf] tracking-tighter">99.9%</div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Uptime Performance</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-display font-light text-[#ca8af0] tracking-tighter">0.02ms</div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Latency Target</div>
                </div>
              </div>

              <div className="max-w-xl text-zinc-400 font-sans leading-relaxed text-lg" dir="rtl">
                نستخدم أحدث تقنيات الـ AI لضمان سرعة بناء خرافية وجودة برمجية لا تضاهى، مع الحفاظ على بصمة فنية فريدة في كل بكسل.
              </div>

              <div className="flex gap-4">
                <div className="h-1 w-24 bg-[#ca8af0]/30 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full w-12 bg-[#ca8af0]"
                  />
                </div>
                <div className="h-1 w-24 bg-[#2dd4bf]/30 rounded-full overflow-hidden">
                   <motion.div 
                    animate={{ x: [100, -100] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full w-12 bg-[#2dd4bf]"
                  />
                </div>
              </div>
            </div>
          </HeroScrollAnimation>
          </div>
          <div className="h-[10vh]" />
        </div>
      </motion.div>

      <div className="absolute top-6 left-8 text-xs font-mono text-white/20 pointer-events-none">
        Scroll up to return
      </div>
    </div>
  );
}

