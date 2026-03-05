"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Question, Language } from "../../data/questions";
import { Lock, Unlock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { audioPlayer } from "../utils/audio";

interface LockScreenProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    language: Language;
    onCorrectAnswer: () => void;
}

export default function LockScreen({ question, questionNumber, totalQuestions, language, onCorrectAnswer }: LockScreenProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;

        if (selectedOption === question.correctAnswer) {
            audioPlayer.play('success');
            setIsError(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setSelectedOption(null);
                onCorrectAnswer();
            }, 1500); // Wait for success animation
        } else {
            audioPlayer.play('error');
            setIsError(true);
            setTimeout(() => setIsError(false), 500); // Remove shake class after animation
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto z-10 relative mt-8">
            {/* HUD Header */}
            <div className="flex justify-between items-center mb-6 text-sm font-mono text-[#00b4d8]" dir="rtl">
                <div className="flex items-center gap-2">
                    <span className="animate-pulse">●</span>
                    <span>{language === 'he' ? "מערכת פעילה" : "نظام نشط"}</span>
                </div>
                <div>
                    {language === 'he' ? "שלב" : "مرحلة"} {questionNumber} / {totalQuestions}
                </div>
            </div>

            <motion.div
                className="hud-container p-6 md:p-10"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={isError ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } : { opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div className="flex flex-col items-center mb-8" variants={itemVariants}>
                    <div className="relative w-full h-48 md:h-64 mb-6 rounded-lg overflow-hidden border-2 border-[#4a1525] shadow-[0_0_15px_rgba(230,57,70,0.2)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={question.image}
                            alt="Scan"
                            className="w-full h-full object-cover opacity-80 mix-blend-screen"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f050b] to-transparent"></div>
                        <div className={`absolute top-4 right-4 p-3 rounded-full border-2 transition-all duration-300 backdrop-blur-md ${isSuccess ? 'border-[#2a9d8f] bg-[#2a9d8f]/40 text-white shadow-[0_0_15px_rgba(42,157,143,0.5)]' : isError ? 'border-[#e63946] bg-[#e63946]/40 text-white shadow-[0_0_15px_rgba(230,57,70,0.5)]' : 'border-[#4a1525] bg-black/60 text-[#e63946]'}`}>
                            {isSuccess ? <Unlock className="w-6 h-6" /> : isError ? <AlertTriangle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                        </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-center text-white leading-tight">
                        {question.text}
                    </h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {question.options.map((option: string, index: number) => (
                        <motion.button
                            variants={itemVariants}
                            key={index}
                            onMouseEnter={() => !isSuccess && audioPlayer.play('hover')}
                            onClick={() => {
                                if (!isSuccess) {
                                    audioPlayer.play('click');
                                    setSelectedOption(index);
                                }
                            }}
                            className={`w-full text-right p-4 rounded-lg border-2 transition-all duration-200 text-lg flex items-center gap-4 ${selectedOption === index
                                ? 'border-[#00b4d8] bg-[#00b4d8]/10 text-white shadow-[0_0_15px_rgba(0,180,216,0.3)]'
                                : 'border-[#4a1525] bg-black/40 text-gray-300 hover:border-[#e63946]/50 hover:bg-[#e63946]/5'
                                } ${isSuccess && index === question.correctAnswer ? 'border-[#2a9d8f] bg-[#2a9d8f]/20 text-white shadow-[0_0_20px_rgba(42,157,143,0.4)]' : ''}`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedOption === index ? 'border-[#00b4d8]' : 'border-gray-500'
                                } ${isSuccess && index === question.correctAnswer ? 'border-[#2a9d8f]' : ''}`}>
                                {selectedOption === index && !isSuccess && <div className="w-2.5 h-2.5 rounded-full bg-[#00b4d8]" />}
                                {isSuccess && index === question.correctAnswer && <CheckCircle2 className="w-6 h-6 text-[#2a9d8f]" />}
                            </div>
                            <span>{option}</span>
                        </motion.button>
                    ))}
                </motion.div>

                <div className="mt-8 flex justify-center">
                    <button
                        onMouseEnter={() => selectedOption !== null && !isSuccess && audioPlayer.play('hover')}
                        onClick={handleSubmit}
                        disabled={selectedOption === null || isSuccess}
                        className={`btn-primary w-full md:w-auto min-w-[200px] ${selectedOption === null || isSuccess ? 'opacity-50 cursor-not-allowed hidden' : ''
                            }`}
                    >
                        {language === 'he' ? "אימות נתונים" : "التحقق من البيانات"}
                    </button>
                </div>

                {/* Error Indicator overlay */}
                <AnimatePresence>
                    {isError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 border-2 border-[#e63946] rounded-12 pointer-events-none shadow-[inset_0_0_30px_rgba(230,57,70,0.4)]"
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
