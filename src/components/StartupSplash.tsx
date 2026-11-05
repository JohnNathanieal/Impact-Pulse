import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Lightbulb, ArrowRight, HeartHandshake, Compass, Flame, ShieldAlert, Award, Newspaper } from 'lucide-react';

interface StartupSplashProps {
  onComplete: () => void;
  durationMs?: number; // Defaults to 5000ms (5 seconds)
}

const CIVIC_TIPS: { title: string; text: string; icon: React.FC<{ className?: string }> }[] = [
  {
    title: 'Direct Distress Relief',
    text: 'Scan verified UPI QR codes directly inside news alerts to route immediate financial aid to affected local residents.',
    icon: HeartHandshake,
  },
  {
    title: 'World, India & Kerala News Hub',
    text: 'Explore verified civic headlines and authentic channel thumbnails from BBC World, Reuters, Times of India, Mathrubhumi, and News 24.',
    icon: Newspaper,
  },
  {
    title: 'Proof-of-Action Verification',
    text: 'Upload on-ground photo proof or receipts when resolving civic tasks to unlock verified community badges and impact points.',
    icon: ShieldCheck,
  },
  {
    title: 'Earn & Redeem in Voucher Bazaar',
    text: 'Exchange your earned Impact Points for organic groceries, public transit passes, solar discounts, and local cafe vouchers.',
    icon: Award,
  },
  {
    title: 'Hyperlocal Calibration',
    text: 'Change your active hub anytime between Thrissur, Kochi, Bengaluru, Delhi, or use instant device GPS to detect local alerts.',
    icon: Compass,
  },
  {
    title: 'Community Leaderboard',
    text: 'Join the top tier of local changemakers. Cleanups, donations, and verified volunteer missions boost your weekly standing.',
    icon: Flame,
  },
  {
    title: 'Anti-Foulplay AI Guardian',
    text: 'All community action reports undergo multi-source checks and automated verification before awarding badges.',
    icon: ShieldAlert,
  },
  {
    title: 'Be the First Responder',
    text: 'Timely volunteer actions in the first 24 hours of an emergency headline receive a 1.5x Community Impact multiplier!',
    icon: Sparkles,
  },
];

export const StartupSplash: React.FC<StartupSplashProps> = ({
  onComplete,
  durationMs = 2000,
}) => {
  const [progress, setProgress] = useState(0);
  const [shuffledTips, setShuffledTips] = useState(CIVIC_TIPS);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Shuffle tips once on mount so every app load starts with a randomized order
  useEffect(() => {
    const shuffled = [...CIVIC_TIPS].sort(() => Math.random() - 0.5);
    setShuffledTips(shuffled);
    setCurrentTipIndex(0);
  }, []);

  // Cycle tips every 1000ms during the 2000ms interval
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % shuffledTips.length);
    }, 1000);

    return () => clearInterval(tipInterval);
  }, [shuffledTips.length]);

  // Smooth 2-second progress timer
  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId: number;

    const updateTimer = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (elapsed < durationMs) {
        animationFrameId = requestAnimationFrame(updateTimer);
      } else {
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 250); // slight delay for smooth opacity transition
      }
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => cancelAnimationFrame(animationFrameId);
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  const activeTip = shuffledTips[currentTipIndex] || CIVIC_TIPS[0];
  const TipIcon = activeTip.icon;
  const secondsRemaining = Math.max(0, Math.ceil(((100 - progress) / 100) * (durationMs / 1000)));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ImpactPulse Launching"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-6 sm:p-10 select-none transition-all duration-300 ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-emerald-700/10 rounded-full blur-2xl" />
      </div>

      {/* Top Header with Skip Button */}
      <div className="w-full max-w-xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400">
            Initializing News & Impact Feed
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="group text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          title="Skip startup screen"
        >
          <span>Skip ({secondsRemaining}s)</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Center Branding & Loading Indicator */}
      <div className="w-full max-w-md flex flex-col items-center text-center relative z-10 my-auto py-4">
        {/* Animated Brand Emblem & Circular Pulse Spinner */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute w-28 h-28 rounded-3xl bg-emerald-500/20 animate-ping pointer-events-none" />

          {/* SVG Circular Progress Ring */}
          <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-800"
              fill="transparent"
            />
            {/* Animated filling stroke */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#emeraldGradient)"
              strokeWidth="4.5"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-[stroke-dashoffset] duration-150 ease-linear"
            />
            <defs>
              <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>

          {/* Core Logo Badge */}
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none" />
              <ShieldCheck className="w-9 h-9 text-emerald-400 drop-shadow-md animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2 justify-center">
          <span>Impact</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Pulse
          </span>
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-300 tracking-wide">
          Local Headlines. Real Action. Instant Impact.
        </p>

        {/* Dynamic Loading Status text with Spinner */}
        <div className="mt-6 flex items-center justify-center gap-2.5 text-xs text-emerald-400/90 font-medium bg-emerald-950/60 border border-emerald-800/40 px-4 py-1.5 rounded-full shadow-inner">
          <svg className="animate-spin w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>
            {progress < 25 && 'Connecting to regional RSS news wires...'}
            {progress >= 25 && progress < 55 && 'Syncing Times of India, Mathrubhumi & Hindustan Times...'}
            {progress >= 55 && progress < 85 && 'Calibrating local distress coordinates & UPI relief...'}
            {progress >= 85 && 'Preparing your community impact console...'}
          </span>
        </div>
      </div>

      {/* Bottom: Dynamic Random Tips & Suggestions Card */}
      <div className="w-full max-w-xl relative z-10 flex flex-col gap-3">
        {/* Tip Box */}
        <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Community Tip #{currentTipIndex + 1}</span>
            </div>
            <span className="text-[11px] text-slate-400">Randomized Civic Insight</span>
          </div>

          <div className="flex items-start gap-3.5 mt-1.5">
            <div className="p-2 rounded-xl bg-emerald-900/40 text-emerald-400 border border-emerald-700/30 shrink-0">
              <TipIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white mb-0.5 truncate">{activeTip.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed transition-opacity duration-200">
                {activeTip.text}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar & Footer Meta */}
        <div className="w-full space-y-1.5">
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Loading ImpactPulse Core</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
