import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene, camera and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0.0); // Transparent background
    
    // Clear container and append renderer
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    
    // Create particles with positions and colors
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 15;
      
      // Color - purple to green gradient
      const colorRatio = Math.random();
      colorArray[i] = 0.8 - colorRatio * 0.5; // Red (decreases)
      colorArray[i + 1] = 0.2 + colorRatio * 0.6; // Green (increases)
      colorArray[i + 2] = 0.8; // Blue (constant)
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Position camera
    camera.position.z = 5;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.001;
      
      // Subtle pulsating effect
      const time = Date.now() * 0.001;
      particleSystem.scale.x = 1 + Math.sin(time * 0.5) * 0.1;
      particleSystem.scale.y = 1 + Math.sin(time * 0.5) * 0.1;
      particleSystem.scale.z = 1 + Math.sin(time * 0.5) * 0.1;
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0" 
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default HeroBackground;