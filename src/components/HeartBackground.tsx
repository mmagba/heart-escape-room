"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeartBackground() {
    const [particles, setParticles] = useState<{ id: number; x: number; size: number; duration: number; delay: number; char: string }[]>([]);

    useEffect(() => {
        const chars = ["0", "1", "+", "♥"];
        const newParticles = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 14 + 10,
            duration: Math.random() * 30 + 15,
            delay: Math.random() * 15,
            char: chars[Math.floor(Math.random() * chars.length)]
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center bg-black">
            {/* Base cinematic gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2a0815] via-[#0f050b] to-black opacity-80"></div>

            {/* Background scanline effect */}
            <div className="scanline"></div>

            {/* Moving cyber/medical particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute font-mono select-none"
                    initial={{ x: `${p.x}vw`, y: `110vh`, fontSize: `${p.size}px`, opacity: 0 }}
                    animate={{ y: `-10vh`, opacity: [0, p.char === "♥" ? 0.15 : 0.3, 0] }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <span className={p.char === "♥" || p.char === "+" ? "text-[#e63946]" : "text-[#00b4d8]"}>
                        {p.char}
                    </span>
                </motion.div>
            ))}

            {/* Animated Grid overlay with fade mask */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 180, 216, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.4) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            ></div>

            {/* Central glowing heart shape */}
            <motion.div
                className="absolute"
                animate={{ scale: [1, 1.05, 1, 1.05, 1], opacity: [0.4, 0.7, 0.4, 0.7, 0.4] }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop"
                }}
            >
                <div className="relative flex items-center justify-center">
                    {/* Heart icon outline */}
                    <svg className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] text-[#e63946] opacity-10 drop-shadow-[0_0_40px_rgba(230,57,70,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>

                    {/* EKG pulse line centered */}
                    <div className="absolute opacity-40 w-3/4">
                        <svg viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg">
                            <path
                                className="text-[#00b4d8]"
                                d="M 0 50 L 300 50 L 330 20 L 360 80 L 400 10 L 440 90 L 470 50 L 1000 50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                        </svg>
                    </div>
                </div>
            </motion.div>

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(0,0,0,0.85)_100%)]"></div>

            {/* Pulsing Red Cyber Grid on the edges */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(230, 57, 70, 0.4) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(230, 57, 70, 0.4) 1.5px, transparent 1.5px)`,
                    backgroundSize: '80px 80px',
                    maskImage: 'radial-gradient(ellipse at center, transparent 35%, black 85%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 35%, black 85%)'
                }}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity }}
            ></motion.div>
        </div>
    );
}
