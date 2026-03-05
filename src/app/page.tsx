"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Activity, Trophy, Globe } from "lucide-react";
import HeartBackground from "../components/HeartBackground";
import LockScreen from "../components/LockScreen";
import { questions, Language } from "../../data/questions";
import { audioPlayer } from "../utils/audio";

type GameState = "welcome" | "story" | "playing" | "success";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [language, setLanguage] = useState<Language>('he');

  const handleStart = () => {
    audioPlayer.play('click');
    setGameState("story");
  };

  const handleStartGame = () => {
    audioPlayer.play('click');
    setGameState("playing");
  };

  const currentQuestions = questions[language];

  const handleCorrectAnswer = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        audioPlayer.play('victory');
        setGameState("success");
      }
      setIsTransitioning(false);
    }, 1500);
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 text-right" dir="rtl">
      <HeartBackground />

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

      <AnimatePresence mode="wait">
        {gameState === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="hud-container p-8 md:p-12 w-full max-w-2xl z-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e63946] to-transparent opacity-50"></div>

            <div className="flex justify-center mb-6 text-[#e63946]">
              <div className="relative">
                <HeartPulse className="w-20 h-20 animate-heartbeat drop-shadow-[0_0_15px_rgba(230,57,70,0.8)]" />
                <Activity className="w-8 h-8 absolute -bottom-2 -right-2 text-[#00b4d8]" />
              </div>
            </div>

            <h1
              data-text={language === 'he' ? "חדר מילוט: להציל את הלב" : "غرفة الهروب: إنقاذ القلب"}
              className="text-4xl md:text-5xl font-black mb-4 glitch-text tracking-tight drop-shadow-lg text-white"
            >
              {language === 'he' ? "חדר מילוט: להציל את הלב" : "غرفة الهروب: إنقاذ القلب"}
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed text-balance">
              {language === 'he' ? "המערכת נעולה. עליכם להוכיח את הידע שלכם באורח חיים בריא ומניעת מחלות לב כדי לפרוץ את כל המנעולים ולהציל את המצב." : "النظام مقفل. يجب عليك إثبات معرفتك بنمط الحياة الصحي والوقاية من أمراض القلب لاختراق جميع الأقفال وإنقاذ الموقف."}
            </p>

            <div className={`bg-black/30 border border-[#4a1525] rounded-lg p-4 mb-8 text-gray-400 text-right`}>
              <ul className="list-disc pr-6 space-y-2">
                <li>{language === 'he' ? "ענו נכונה על 10 שאלות." : "أجب بشكل صحيح على 10 أسئلة."}</li>
                <li>{language === 'he' ? "כל תשובה שגויה תפעיל אזעקת מערכת." : "كل إجابة خاطئة ستؤدي إلى تشغيل إنذار النظام."}</li>
                <li>{language === 'he' ? "רק ידע מציל חיים." : "المعرفة وحدها تنقذ الأرواح."}</li>
              </ul>
            </div>

            <button
              onMouseEnter={() => audioPlayer.play('hover')}
              onClick={handleStart}
              className="btn-primary w-full text-xl py-4"
            >
              {language === 'he' ? "התחלת פריצה למערכת" : "بدء اختراق النظام"}
            </button>
          </motion.div>
        )}

        {gameState === "story" && (
          <motion.div
            key="story"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="hud-container p-8 md:p-12 w-full max-w-2xl z-10 text-center relative overflow-hidden flex flex-col items-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent opacity-50"></div>

            <h2
              data-text={language === 'he' ? "יומן מערכת" : "سجل النظام"}
              className="text-3xl font-black mb-6 tracking-wide glitch-text z-10 text-[#00b4d8]"
            >
              {language === 'he' ? "יומן מערכת" : "سجل النظام"}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className={`text-lg md:text-xl text-gray-300 mb-8 leading-relaxed space-y-4 font-medium backdrop-blur-sm bg-black/40 p-6 rounded-lg border border-[#00b4d8]/40 shadow-[0_0_20px_rgba(0,180,216,0.15)] inline-block z-10 text-right`}
            >
              <p>
                {language === 'he' ? "קריסה קריטית במערכת תמיכת החיים המרכזית הקרויה" : "انهيار حرج في نظام دعم الحياة المركزي المسمى"} <span className="text-[#e63946] font-bold">{language === 'he' ? '"לב הברזל"' : '"القلب الحديدي"'}</span>.
                {language === 'he' ? "הזמן אוזל והמערכות החיוניות עומדות לקרוס." : " الوقت ينفد والأنظمة الحيوية على وشك الانهيار."}
              </p>
              <p>
                {language === 'he' ? "אתם צוות המומחים 'שומרי הלב' ונקראתם לפריצה דחופה במטרה לאתחל עשר חומות כוח." : "أنتم فريق الخبراء 'حراس القلب' وقد تم استدعاؤكم لاختراق عاجل من أجل إعادة تشغيل عشرة جدران طاقة."}
                {language === 'he' ? "כל חומה מוגנת על ידי חסימה מוצפנת הדורשת ידע קריטי באורח חיים בריא ומניעת מחלות לב." : " כל جدار محمي بحجب مشفر يتطلب معرفة حاسمة بأسلوب الحياة الصحي والوقاية من أمراض القلب."}
              </p>
              <p className="text-[#00b4d8]">
                {language === 'he' ? "רק אם תוכיחו את מומחיותכם - תוכלו לשחרר את הנעילה ולהציל את לב הברזל." : "فقط إذا أثبتم خبرتكم - ستتمكنون من تحرير القفل وإنقاذ القلب الحديدي."}
                {language === 'he' ? "חייו של המטופל בידיים שלכם. האם אתם מוכנים?" : " حياة المريض بين أيديكم. هل أنتم مستعدون؟"}
              </p>
            </motion.div>

            <button
              onMouseEnter={() => audioPlayer.play('hover')}
              onClick={handleStartGame}
              className="btn-primary w-full md:w-auto text-xl py-4 px-10 border-[#00b4d8] text-[#00b4d8] shadow-[0_0_15px_rgba(0,180,216,0.3)] hover:bg-[#00b4d8]/10 hover:shadow-[0_0_20px_rgba(0,180,216,0.5)]"
            >
              {language === 'he' ? "קבלת משימה - שגרו אותי לבסיס הנתונים" : "قبول المهمة - أرسلني إلى قاعدة البيانات"}
            </button>
          </motion.div>
        )}

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

        {gameState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
              bounce: 0.4
            }}
            className="hud-container p-8 md:p-12 w-full max-w-2xl z-10 text-center border-[#2a9d8f] shadow-[0_0_30px_rgba(42,157,143,0.3)]"
          >
            <div className="flex justify-center mb-6 text-[#2a9d8f]">
              <Trophy className="w-24 h-24 drop-shadow-[0_0_20px_rgba(42,157,143,0.8)] animate-pulse-ring rounded-full" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#2a9d8f] drop-shadow-[0_0_10px_rgba(42,157,143,0.5)]">
              {language === 'he' ? "המערכת נפרצה בהצלחה!" : "تم اختراق النظام بنجاح!"}
            </h1>

            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
              {language === 'he' ? "כל הכבוד! הפגנתם ידע מרשים על מניעת מחלות לב וכלי דם ושמירה על אורח חיים בריא." : "عمل رائع! لقد أظهرتم معرفة مثيرة للإعجاب حول الوقاية من أمراض القلب والأوعية الدموية والحفاظ على نمط حياة صحي."}
              <br />
              {language === 'he' ? "הלב שלכם (ושלנו) מודה לכם!" : "قلبكم (وقلبنا) يشكركم!"}
            </p>

            <div className="text-[#00b4d8] font-mono text-sm opacity-70 mb-8" dir="ltr">
              System access granted. Firewall bypassed. Protocol: Healthy Heart initiated.
            </div>

            <button
              onMouseEnter={() => audioPlayer.play('hover')}
              onClick={() => {
                audioPlayer.play('click');
                setCurrentQuestionIndex(0);
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
