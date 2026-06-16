"use client";

import { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  // Spherical base coordinates
  sx: number;
  sy: number;
  sz: number;
  // Grid/Wave base coordinates
  gx: number;
  gy: number;
  gz: number;
  // Current velocity/offset
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  label?: string;
  isCore?: boolean;
}

export default function KnowledgeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ ratio: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const nodes: Node3D[] = [];
    const count = 90;

    const coreNodesData = [
      { label: "ChatGPT", color: "oklch(0.55 0.18 250)" }, // Blue
      { label: "Gemini", color: "oklch(0.65 0.17 150)" },  // Green/Emerald
      { label: "Claude", color: "oklch(0.6 0.18 20)" },     // Red/Orange
      { label: "Copilot", color: "oklch(0.7 0.16 80)" },    // Amber
      { label: "YOUR BRAND", color: "oklch(0.96 0 0)" },   // White (Dynamic later)
    ];

    // Initialize nodes
    for (let i = 0; i < count; i++) {
      // 1. Spherical layout coordinates
      const theta = Math.acos(2 * (i / count) - 1);
      const phi = Math.sqrt(count * Math.PI) * theta;
      const r = 160 + Math.sin(i * 12) * 30; // sphere radius
      const sx = r * Math.sin(theta) * Math.cos(phi);
      const sy = r * Math.sin(theta) * Math.sin(phi);
      const sz = r * Math.cos(theta);

      // 2. Wave/Grid layout coordinates
      const rows = 9;
      const cols = 10;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const gx = (col - (cols - 1) / 2) * 60;
      const gy = (row - (rows - 1) / 2) * 45;
      const gz = Math.sin(col * 0.8 + row * 0.8) * 60;

      const isCore = i < coreNodesData.length;
      const coreInfo = isCore ? coreNodesData[i] : null;

      nodes.push({
        x: sx,
        y: sy,
        z: sz,
        sx,
        sy,
        sz,
        gx,
        gy,
        gz,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        radius: isCore ? 6 : 2 + Math.random() * 2,
        color: coreInfo ? coreInfo.color : "rgba(99, 102, 241, 0.4)",
        label: coreInfo?.label,
        isCore,
      });
    }

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseRef.current.targetX = x * 0.05;
      mouseRef.current.targetY = y * 0.05;
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
      // Clamp scroll ratio to fine-tune transitions
      scrollRef.current.ratio = Math.min(Math.max(ratio, 0), 1);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    let angleX = 0.002;
    let angleY = 0.003;
    const fov = 350; // Camera perspective distance

    // Animation Loop
    const tick = () => {
      if (!ctx || !canvas) return;

      // Detect dark mode
      const isDark = document.documentElement.classList.contains("dark");
      
      // Clear with slight trailing opacity for futuristic motion blur
      ctx.fillStyle = isDark ? "rgba(10, 10, 10, 0.2)" : "rgba(250, 250, 250, 0.2)";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const scrollRatio = scrollRef.current.ratio;

      // Adjust rotation speed/direction based on scroll
      const currentAngleY = angleY + scrollRatio * 0.005;
      const currentAngleX = angleX + mouseX * 0.0005;

      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);

      // 1. Update positions (Interpolating between Sphere and Wave/Grid based on scroll)
      nodes.forEach((node) => {
        // Base coordinate selection based on scroll ratio
        // Transition fully to wave format as the user scrolls halfway down
        const t = Math.min(scrollRatio * 1.8, 1); 
        const targetBaseX = node.sx * (1 - t) + node.gx * t;
        const targetBaseY = node.sy * (1 - t) + node.gy * t;
        const targetBaseZ = node.sz * (1 - t) + node.gz * t;

        // Apply slight float drift/physics
        node.x += (targetBaseX - node.x) * 0.1 + node.vx;
        node.y += (targetBaseY - node.y) * 0.1 + node.vy;
        node.z += (targetBaseZ - node.z) * 0.1 + node.vz;

        // Soft boundaries for floating
        if (Math.abs(node.x - targetBaseX) > 10) node.vx *= -1;
        if (Math.abs(node.y - targetBaseY) > 10) node.vy *= -1;
        if (Math.abs(node.z - targetBaseZ) > 10) node.vz *= -1;

        // Apply 3D Rotations
        // Rotate Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        // Store rotated virtual coordinates
        (node as any).rx = x1;
        (node as any).ry = y2;
        (node as any).rz = z2 + mouseX * 2; // Offset depth on mouse movement
      });

      // Sort nodes by depth (z-index) so back-to-front rendering looks correct
      const sortedNodes = [...nodes].sort((a, b) => (b as any).rz - (a as any).rz);

      // 2. Draw connections (lines)
      const linkDist = 110;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < sortedNodes.length; i++) {
        const n1 = sortedNodes[i] as any;
        const scale1 = fov / (fov + n1.rz);
        const x1_proj = width / 2 + n1.rx * scale1 + mouseX;
        const y1_proj = height / 2 + n1.ry * scale1 + mouseY;

        // Skip drawing links for nodes pushed too far behind camera
        if (n1.rz < -fov) continue;

        for (let j = i + 1; j < sortedNodes.length; j++) {
          const n2 = sortedNodes[j] as any;
          if (n2.rz < -fov) continue;

          // Compute 3D distance between nodes
          const dx = n1.rx - n2.rx;
          const dy = n1.ry - n2.ry;
          const dz = n1.rz - n2.rz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < linkDist) {
            const scale2 = fov / (fov + n2.rz);
            const x2_proj = width / 2 + n2.rx * scale2 + mouseX;
            const y2_proj = height / 2 + n2.ry * scale2 + mouseY;

            // Opacity drops as distance increases or scroll changes
            const opacity = (1 - dist / linkDist) * 0.18 * (1 - scrollRatio * 0.3);
            
            ctx.strokeStyle = isDark 
              ? `rgba(99, 102, 241, ${opacity})`
              : `rgba(79, 70, 229, ${opacity * 0.8})`;
            
            ctx.beginPath();
            ctx.moveTo(x1_proj, y1_proj);
            ctx.lineTo(x2_proj, y2_proj);
            ctx.stroke();
          }
        }
      }

      // 3. Draw nodes & labels
      sortedNodes.forEach((node: any) => {
        if (node.rz < -fov) return;

        const scale = fov / (fov + node.rz);
        const px = width / 2 + node.rx * scale + mouseX;
        const py = height / 2 + node.ry * scale + mouseY;
        const size = node.radius * scale;

        // Node Glow (Core Nodes)
        if (node.isCore) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = node.color;
        } else {
          ctx.shadowBlur = 0;
        }

        // Adjust color based on theme
        let finalColor = node.color;
        if (!node.isCore) {
          finalColor = isDark ? "rgba(165, 180, 252, 0.45)" : "rgba(79, 70, 229, 0.35)";
        } else if (node.label === "YOUR BRAND") {
          finalColor = isDark ? "#ffffff" : "oklch(0.15 0 0)";
        }

        ctx.fillStyle = finalColor;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(size, 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Draw node labels for core nodes
        if (node.isCore && node.label) {
          ctx.shadowBlur = 0; // Disable shadow for text clarity
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(23, 23, 23, 0.9)";
          ctx.font = `bold ${Math.max(9, Math.round(11 * scale))}px var(--font-sans)`;
          ctx.textAlign = "center";
          
          // Draw text above node
          ctx.fillText(node.label, px, py - size - 6);

          // Subtle core point indicator border
          ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, size + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Clear shadow properties so they don't leak into subsequent ticks
      ctx.shadowBlur = 0;

      // Slow rotation over time
      angleY += 0.0015;

      animationId = requestAnimationFrame(tick);
    };

    tick();

    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-70 dark:opacity-85 transition-opacity"
      />
    </div>
  );
}
