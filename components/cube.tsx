"use client";

import { Flamenco } from "next/font/google";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ScrollingCubeRotation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x4225f4 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Position camera
    camera.position.z = 5;

    // Animation function
    function animate() {
      requestAnimationFrame(animate);

      // Get scroll progress (0 to 1)
      const scrollProgress =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);

      // Update cube rotation based on scroll
      cube.rotation.x = scrollProgress * Math.PI * 2; // Vertical rotation
      cube.rotation.y = scrollProgress * Math.PI * 4; // Horizontal rotation
      cube.position.x = scrollProgress * 5;
      cube.position.z = scrollProgress * 5;
      renderer.render(scene, camera);
    }

    // Start animation
    animate();

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-[300vh]">
      {/* Make the container 3x the viewport height to allow scrolling */}
      <div className="sticky top-0 w-full h-screen" ref={containerRef}></div>
    </div>
  );
}
