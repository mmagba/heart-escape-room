"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Cpu, Trophy, Globe, KeyRound, Lock } from "lucide-react";
import HeartBackground from "../../components/HeartBackground";
import LockScreen from "../../components/LockScreen";
import { questionsV2 } from "../../../data/questions-v2";
import { Language } from "../../../data/questions";
import { audioPlayer } from "../../utils/audio";

type GameState = "welcome" | "story" | "playing" | "stage_complete" | "success";

const STAGE_QUESTIONS = [10, 20, 30]; // last question index (exclusive) per stage
const STAGE_CODES = ["H", "E", "A"];

const stageIntros = {
  he: [
    {
      title: "שלב 1 – שחזור מאגר הנתונים",
      body: [
        <>אחר שנכנסתם למערכת <span className="text-[#e63946] font-bold">Health Guard</span> גיליתם שהווירוס <span className="text-[#e63946] font-bold">Shadow X</span> מחק חלק ממאגר הנתונים של מערכת הבריאות.</>,
        "כדי לשחזר את המידע החסר עליכם לפתור 10 שאלות ראשונות. כל תשובה נכונה תחזיר חלק מהמידע שאבד ותקרב אתכם אל מפתח הגישה הראשון.",
        <span className="text-[#e63946]">היזהרו! כל טעות תחזק את הווירוס.</span>
      ],
      btn: "קבלת משימה – שלב 1"
    },
    {
      title: "שלב 2 – מעבדת הבריאות הסודית",
      body: [
        <>לאחר שחזרתם את הנתונים, מצאתם דלת סודית שהובילה למעבדת הבריאות המרכזית.</>,
        <>שם גיליתם שהווירוס השתלט על מערכות קבלת ההחלטות של התלמידים וגרם להם לבחור בהרגלים מזיקים.</>,
        <span className="text-[#00b4d8]">כדי לעצור את ההשפעה הזאת עליכם לפתור 10 שאלות נוספות המבוססות על ניתוח מידע, הסקת מסקנות וקבלת החלטות.</span>
      ],
      btn: "קבלת משימה – שלב 2"
    },
    {
      title: "שלב 3 – הכספת המרכזית",
      body: [
        <>כעת אתם נמצאים בלב המערכת.</>,
        <><span className="text-[#e63946] font-bold">Shadow X</span> הפעיל את מנגנון ההשמדה העצמית של <span className="text-[#e63946] font-bold">Health Guard</span>.</>,
        <span className="text-[#00b4d8]">נשארו לכם 10 שאלות אחרונות המשלבות ידע מדעי, חשיבה ביקורתית וקבלת החלטות. רק אם תצליחו לפתור את כולן תוכלו לפתוח את הכספת המרכזית ולהציל את האנושות.</span>
      ],
      btn: "קבלת משימה – שלב 3"
    }
  ],
  ar: [
    {
      title: "المرحلة 1 – استعادة قاعدة البيانات",
      body: [
        <>بعد دخولكم إلى نظام <span className="text-[#e63946] font-bold">Health Guard</span> اكتشفتم أن فيروس <span className="text-[#e63946] font-bold">Shadow X</span> قام بحذف جزء من قاعدة البيانات الصحية.</>,
        "لاستعادة المعلومات المفقودة عليكم حل أول 10 أسئلة. كل إجابة صحيحة ستعيد جزءًا من البيانات وتقرّبكم من المفتاح الرقمي الأول.",
        <span className="text-[#e63946]">احذروا! فكل خطأ يقوي الفيروس.</span>
      ],
      btn: "قبول المهمة – المرحلة 1"
    },
    {
      title: "المرحلة 2 – المختبر الصحي السري",
      body: [
        <>بعد استعادة البيانات وجدتم بابًا سريًا يقود إلى المختبر الصحي المركزي.</>,
        <>هناك اكتشفتم أن الفيروس سيطر على أنظمة اتخاذ القرار لدى الطلاب وجعلهم يختارون عادات غير صحية.</>,
        <span className="text-[#00b4d8]">لإيقاف تأثيره عليكم حل 10 أسئلة إضافية تعتمد على التحليل والاستنتاج واتخاذ القرار.</span>
      ],
      btn: "قبول المهمة – المرحلة 2"
    },
    {
      title: "المرحلة 3 – الخزنة المركزية",
      body: [
        <>أنتم الآن في قلب النظام.</>,
        <><span className="text-[#e63946] font-bold">Shadow X</span> قام بتفعيل آلية التدمير الذاتي لـ <span className="text-[#e63946] font-bold">Health Guard</span>.</>,
        <span className="text-[#00b4d8]">تبقى أمامكم 10 أسئلة أخيرة تجمع بين المعرفة العلمية والتفكير النقدي واتخاذ القرار. فقط إذا نجحتم في حلها جميعًا ستتمكنون من فتح الخزنة المركزية وإنقاذ البشرية.</span>
      ],
      btn: "قبول المهمة – المرحلة 3"
    }
  ]
};

export default function HomeV2() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [language, setLanguage] = useState<Language>('he');
  const [currentStage, setCurrentStage] = useState(0); // 0-indexed
  const [collectedCodes, setCollectedCodes] = useState<string[]>([]);

  const currentQuestions = questionsV2[language];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleStart = () => {
    audioPlayer.play('click');
    setCurrentStage(0);
    setGameState("story");
  };

  const handleStartStage = () => {
    audioPlayer.play('click');
    setGameState("playing");
  };

  const handleCorrectAnswer = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      const stageEndIndex = STAGE_QUESTIONS[currentStage];

      if (nextIndex >= stageEndIndex) {
        // Stage complete — award code
        const newCode = STAGE_CODES[currentStage];
        setCollectedCodes(prev => [...prev, newCode]);
        audioPlayer.play('victory');
        setGameState("stage_complete");
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
      setIsTransitioning(false);
    }, 1500);
  };

  const handleNextStage = () => {
    audioPlayer.play('click');
    const nextStage = currentStage + 1;
    if (nextStage >= 3) {
      setGameState("success");
    } else {
      setCurrentStage(nextStage);
      setCurrentQuestionIndex(STAGE_QUESTIONS[currentStage]); // start where last stage ended
      setGameState("story");
    }
  };

  const stageIntro = stageIntros[language][currentStage] ?? stageIntros[language][0];
  const earnedCode = STAGE_CODES[currentStage];
  const isLastStage = currentStage === 2;

  const stageLabel = language === 'he'
    ? ["ראשון", "שני", "שלישי"][currentStage]
    : ["الأولى", "الثانية", "الثالثة"][currentStage];

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 text-right" dir="rtl">
      <HeartBackground />

      {/* Language toggle (always visible on welcome) */}
      {gameState === "welcome" && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setLanguage(lang => lang === 'he' ? 'ar' : 'he')}
            className="bg-black/50 border border-[#4a1525] text-white p-2 px-4 rounded-full hover:bg-[#e63946]/20 transition-all flex items-center gap-2"
          >
            <Globe className="w-5 h-5" />
            <span className="font-bold">{language === 'he' ? 'العربية' : 'עברית'}</span>
          </button>
        </div>
      )}

      {/* Collected codes HUD (during play) */}
      {(gameState === "playing" || gameState === "story") && collectedCodes.length > 0 && (
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          {collectedCodes.map((code, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-black/70 border border-[#2a9d8f] rounded-lg px-3 py-1 font-mono text-[#2a9d8f] font-bold text-lg shadow-[0_0_10px_rgba(42,157,143,0.4)]"
            >
              {code}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ── WELCOME ───────────────────────────────────────────────────────── */}
        {gameState === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="hud-container p-8 md:p-12 w-full max-w-2xl z-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e63946] to-transparent opacity-50" />

            <div className="flex justify-center mb-6 text-[#e63946]">
              <div className="relative">
                <ShieldAlert className="w-20 h-20 animate-heartbeat drop-shadow-[0_0_15px_rgba(230,57,70,0.8)]" />
                <Cpu className="w-8 h-8 absolute -bottom-2 -right-2 text-[#00b4d8]" />
              </div>
            </div>

            <div className="inline-block bg-[#e63946]/10 border border-[#e63946]/40 rounded-lg px-3 py-1 mb-4 font-mono text-xs text-[#e63946] tracking-widest">
              {language === 'he' ? '⚠ אזהרה: וירוס Shadow X פעיל' : '⚠ تحذير: فيروس Shadow X نشط'}
            </div>

            <h1
              data-text={language === 'he' ? "מבצע: Health Guard" : "عملية: Health Guard"}
              className="text-4xl md:text-5xl font-black mb-4 glitch-text tracking-tight drop-shadow-lg text-white"
            >
              {language === 'he' ? "מבצע: Health Guard" : "عملية: Health Guard"}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed text-balance">
              {language === 'he'
                ? 'בשנת 2045 מערכת הבריאות העולמית "Health Guard" הותקפה על ידי וירוס מסוכן בשם "Shadow X". הווירוס גרם לאנשים לאכול מזון לא בריא, לעשן יותר, להימנע מפעילות גופנית ולחיות במתח מתמשך.'
                : 'في عام 2045 تعرض نظام الصحة العالمي "Health Guard" لهجوم من فيروس خطير يدعى "Shadow X". تسبب الفيروس في انتشار العادات غير الصحية: تناول الطعام غير الصحي، التدخين، قلة النشاط البدني، والعيش تحت ضغط نفسي دائم.'}
            </p>

            <div className="bg-black/30 border border-[#4a1525] rounded-lg p-4 mb-8 text-gray-400 text-right">
              <ul className="list-disc pr-6 space-y-2">
                <li>{language === 'he' ? "ענו נכונה על 30 שאלות ב-3 שלבים." : "أجب بشكل صحيح على 30 سؤالًا في 3 مراحل."}</li>
                <li>{language === 'he' ? "בסוף כל שלב תקבלו קוד סודי." : "في نهاية كل مرحلة ستحصلون على رمز سري."}</li>
                <li>{language === 'he' ? "אספו את כל הקודים כדי לנטרל את Shadow X." : "اجمعوا جميع الرموز لتحييد Shadow X."}</li>
              </ul>
            </div>

            <button
              onMouseEnter={() => audioPlayer.play('hover')}
              onClick={handleStart}
              className="btn-primary w-full text-xl py-4"
            >
              {language === 'he' ? "התחלת המשימה" : "بدء المهمة"}
            </button>
          </motion.div>
        )}

        {/* ── STORY / STAGE INTRO ───────────────────────────────────────────── */}
        {gameState === "story" && (
          <motion.div
            key={`story-${currentStage}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="hud-container p-8 md:p-12 w-full max-w-2xl z-10 text-center relative overflow-hidden flex flex-col items-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent opacity-50" />

            <div className="flex items-center gap-3 mb-2">
              <KeyRound className="w-5 h-5 text-[#00b4d8]" />
              <span className="text-[#00b4d8] font-mono text-sm tracking-widest">
                {language === 'he' ? `שלב ${stageLabel}` : `المرحلة ${stageLabel}`}
              </span>
            </div>

            <h2
              data-text={stageIntro.title}
              className="text-2xl md:text-3xl font-black mb-6 tracking-wide glitch-text z-10 text-[#00b4d8]"
            >
              {stageIntro.title}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed space-y-4 font-medium backdrop-blur-sm bg-black/40 p-6 rounded-lg border border-[#00b4d8]/40 shadow-[0_0_20px_rgba(0,180,216,0.15)] z-10 text-right w-full"
            >
              {stageIntro.body.map((line, i) => <p key={i}>{line}</p>)}
            </motion.div>

            <button
              onMouseEnter={() => audioPlayer.play('hover')}
              onClick={handleStartStage}
              className="btn-primary w-full md:w-auto text-xl py-4 px-10 border-[#00b4d8] text-[#00b4d8] shadow-[0_0_15px_rgba(0,180,216,0.3)] hover:bg-[#00b4d8]/10 hover:shadow-[0_0_20px_rgba(0,180,216,0.5)]"
            >
              {stageIntro.btn}
            </button>
          </motion.div>
        )}

        {/* ── PLAYING ──────────────────────────────────────────────────────── */}
        {gameState === "playing" && !isTransitioning && (
          <motion.div
            key={`question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full z-10"
          >
            <LockScreen
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={currentQuestions.length}
              language={language}
              onCorrectAnswer={handleCorrectAnswer}
            />
          </motion.div>
        )}

        {/* ── STAGE COMPLETE ────────────────────────────────────────────────── */}
        {gameState === "stage_complete" && (
          <motion.div
            key={`stage-complete-${currentStage}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="hud-container p-8 md:p-12 w-full max-w-2xl z-10 text-center border-[#2a9d8f] shadow-[0_0_30px_rgba(42,157,143,0.3)]"
          >
            <div className="flex justify-center mb-4 text-[#2a9d8f]">
              <Lock className="w-16 h-16 drop-shadow-[0_0_20px_rgba(42,157,143,0.8)] animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-2 text-[#2a9d8f]">
              {language === 'he' ? "🎉 הצלחתם לשחזר את מאגר הנתונים!" : "🎉 نجحتم في استعادة قاعدة البيانات!"}
            </h2>

            <p className="text-gray-300 mb-6 text-lg">
              {language === 'he'
                ? `קיבלתם את הקוד ה${["ראשון","שני","שלישי"][currentStage]}:`
                : `حصلتم على الرمز ${["الأول","الثاني","الثالث"][currentStage]}:`}
            </p>

            {/* Code reveal */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl border-4 border-[#2a9d8f] bg-[#2a9d8f]/10 shadow-[0_0_40px_rgba(42,157,143,0.6)] mb-6"
            >
              <span className="text-5xl font-black text-[#2a9d8f] font-mono">{earnedCode}</span>
            </motion.div>

            {/* Collected codes so far */}
            <div className="flex justify-center gap-3 mb-8">
              {STAGE_CODES.map((c, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold transition-all ${
                    collectedCodes.includes(c)
                      ? "border-[#2a9d8f] bg-[#2a9d8f]/20 text-[#2a9d8f] shadow-[0_0_10px_rgba(42,157,143,0.4)]"
                      : "border-gray-700 text-gray-600"
                  }`}
                >
                  {collectedCodes.includes(c) ? c : "?"}
                </div>
              ))}
            </div>

            <button
              onMouseEnter={() => audioPlayer.play('hover')}
              onClick={handleNextStage}
              className="btn-primary w-full text-xl py-4"
            >
              {isLastStage
                ? (language === 'he' ? "פתיחת הכספת המרכזית →" : "فتح الخزنة المركزية →")
                : (language === 'he' ? `המשך לשלב ${["","שני","שלישי"][currentStage + 1]} →` : `الانتقال إلى المرحلة ${["","الثانية","الثالثة"][currentStage + 1]} →`)}
            </button>
          </motion.div>
        )}

        {/* ── SUCCESS ───────────────────────────────────────────────────────── */}
        {gameState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="hud-container p-8 md:p-12 w-full max-w-2xl z-10 text-center border-[#2a9d8f] shadow-[0_0_30px_rgba(42,157,143,0.3)]"
          >
            <div className="flex justify-center mb-6 text-[#2a9d8f]">
              <Trophy className="w-24 h-24 drop-shadow-[0_0_20px_rgba(42,157,143,0.8)] animate-pulse-ring rounded-full" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-2 text-[#2a9d8f] drop-shadow-[0_0_10px_rgba(42,157,143,0.5)]">
              {language === 'he' ? "Health Guard הוצל!" : "تم إنقاذ Health Guard!"}
            </h1>

            <p className="text-gray-300 mb-6 text-lg">
              {language === 'he' ? "הקודים שנאספו מרכיבים את המפתח הסופי:" : "الرموز المجمعة تشكل المفتاح النهائي:"}
            </p>

            {/* Final code: HEA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4 mb-6"
            >
              {STAGE_CODES.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                  className="w-20 h-20 rounded-2xl border-4 border-[#2a9d8f] bg-[#2a9d8f]/20 shadow-[0_0_20px_rgba(42,157,143,0.5)] flex items-center justify-center"
                >
                  <span className="text-4xl font-black text-[#2a9d8f] font-mono">{c}</span>
                </motion.div>
              ))}
            </motion.div>

            <p className="text-xl md:text-2xl text-white mb-4 leading-relaxed">
              {language === 'he'
                ? "תמה הפריצה למערכת — Shadow X הושבת. Health Guard חזר לפעולה מלאה."
                : "اكتملت العملية — تم تعطيل Shadow X. عادت Health Guard للعمل بكامل طاقتها."}
            </p>

            <div className="text-[#00b4d8] font-mono text-sm opacity-70 mb-8 text-center" dir="ltr">
              Health Guard ONLINE · Shadow X NEUTRALIZED · Code: HEA · Mission Complete ✓
            </div>

            <button
              onMouseEnter={() => audioPlayer.play('hover')}
              onClick={() => {
                audioPlayer.play('click');
                setCurrentQuestionIndex(0);
                setCurrentStage(0);
                setCollectedCodes([]);
                setGameState("welcome");
              }}
              className="bg-transparent border-2 border-[#2a9d8f] text-white font-bold py-3 px-8 rounded-lg outline-none transition-all hover:bg-[#2a9d8f]/20 hover:shadow-[0_0_15px_rgba(42,157,143,0.4)]"
            >
              {language === 'he' ? "שחק שוב" : "العب مرة أخرى"}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
