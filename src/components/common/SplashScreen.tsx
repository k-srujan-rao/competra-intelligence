import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState('Initializing Hindsight memory engines...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage('Mounting multi-industry telemetry collectors...');
    }, 280);

    const t2 = setTimeout(() => {
      setStage('Securing executive analytical workstation...');
    }, 550);

    const t3 = setTimeout(() => {
      onComplete();
    }, 780);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060709] text-stone-100">
      {/* Background ambient lighting */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-yellow-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm px-6">
        {/* Animated Brand Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-40 blur-lg animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 text-stone-950 shadow-2xl font-black text-3xl tracking-tighter border border-amber-300/40">
            C
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-white">COMPETRA</span>
            <span className="rounded-md bg-amber-500/15 border border-amber-500/35 px-2 py-0.5 text-xs font-bold text-amber-300">
              AI
            </span>
          </div>
          <p className="text-xs text-amber-200/60 mt-1 font-mono tracking-wide">
            Remember Every Move. Understand Every Strategy.
          </p>
        </div>

        {/* Micro-Progress Bar & Stage Message */}
        <div className="w-full space-y-2.5">
          <div className="h-1.5 w-full bg-[#161822] border border-amber-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <div className="text-[11px] text-stone-400 font-mono flex items-center justify-center gap-2">
            <Brain className="h-3 w-3 text-amber-400 animate-spin" />
            <span>{stage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
