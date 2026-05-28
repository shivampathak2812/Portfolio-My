"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Adaptive Particle Density (Mobile vs Desktop)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 110;

    // 2. Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Programmatic Glowing Bokeh Texture Creator
    const createGlowTexture = () => {
      const canvasTex = document.createElement("canvas");
      canvasTex.width = 64;
      canvasTex.height = 64;
      const ctx = canvasTex.getContext("2d");
      if (!ctx) return null;

      // Draw radial white & warm orange glow
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");          // Soft white core
      gradient.addColorStop(0.3, "rgba(240, 244, 255, 0.5)");       // Silver ring
      gradient.addColorStop(0.7, "rgba(217, 119, 6, 0.06)");        // Quiet gold halo
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");                 // Fade-out

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvasTex);
      return texture;
    };

    const particleTexture = createGlowTexture();

    // 4. Geometry and Attribute Creation (Varying sizes, opacities, speeds)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount * 3); // X, Y, Z float speeds
    const randomOffsets = new Float32Array(particleCount); // Unique triggers for sine waves

    const width = 45;
    const height = 30;
    const depth = 30;

    for (let i = 0; i < particleCount; i++) {
      // Coordinates randomized in a 3D box
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = (Math.random() - 0.5) * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * depth;

      // Particle scale (bokeh sizes)
      scales[i] = Math.random() * 1.5 + 0.3;

      // Floating drift speed
      speeds[i * 3] = (Math.random() - 0.5) * 0.005;        // Slower X drift
      speeds[i * 3 + 1] = (Math.random() * 0.006) + 0.002;   // Slower Y upward drift
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.003;     // Slower Z drift

      randomOffsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // 5. Additive Glow Materials
    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: particleTexture || undefined,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.7,
      vertexColors: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 6. Camera Mouse-follow Inertia & Resize State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate between -1 and 1
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Use ResizeObserver instead of window resize listener to support zoom & high-DPI scaling
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !camera || !renderer || !container) return;
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });

    window.addEventListener("mousemove", handleMouseMove);
    resizeObserver.observe(container);

    // 7. Render Loop with Sine-Wave Oscillations
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Slow camera inertia tracking (lerping)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Gentle camera parallax movement
      camera.position.x = mouse.x * 2.5;
      camera.position.y = mouse.y * 2.0;
      camera.lookAt(scene.position);

      // Particle physics: float, sine drift, loop
      const positionsArr = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Apply vertical float drift
        positionsArr[i * 3 + 1] += speeds[i * 3 + 1];

        // Apply horizontal sine-wave oscillation
        positionsArr[i * 3] += Math.sin(elapsedTime * 0.3 + randomOffsets[i]) * 0.005;

        // Loop particles when they float out of upper boundary
        if (positionsArr[i * 3 + 1] > height / 2) {
          positionsArr[i * 3 + 1] = -height / 2;
          positionsArr[i * 3] = (Math.random() - 0.5) * width;
        }

        // Loop horizontal drift limits
        if (Math.abs(positionsArr[i * 3]) > width / 2) {
          positionsArr[i * 3] = -positionsArr[i * 3];
        }
      }

      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Proper Lifecycle Garbage Collection (WebGL cleanup)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      // Clean buffer objects
      geometry.dispose();
      material.dispose();
      if (particleTexture) particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />
    </div>
  );
}
