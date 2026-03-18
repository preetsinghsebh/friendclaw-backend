"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Orb() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1, 128, 128]} scale={3.2}>
                <MeshDistortMaterial
                    color="#ffffff"
                    attach="material"
                    distort={0.2}
                    speed={1}
                    roughness={0}
                    metalness={0.1}
                    transmission={1}
                    ior={1.3}
                    thickness={0.5}
                    clearcoat={1}
                    clearcoatRoughness={0}
                />
            </Sphere>
        </Float>
    );
}

export function FluidGlassOrb() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center mix-blend-normal">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }} className="w-full h-full">
                <ambientLight intensity={1.5} color="#ffffff" />
                <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
                <directionalLight position={[-5, 5, -5]} intensity={1} color="#FF9500" />
                <Orb />
                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}
