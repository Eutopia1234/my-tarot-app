import React, { useState } from 'react';
import { TarotTable } from './TarotTable';
import { IntroScreen } from './IntroScreen';
import { AppState } from './types';
import { StarryBackground } from './StarryBackground';
import { Star } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [userQuestion, setUserQuestion] = useState<string>('');

  const handleStart = (question: string) => {
    setUserQuestion(question);
    setAppState('shuffling');
  };

  const handleReset = () => {
    setAppState('intro');
    setUserQuestion('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-mystic-900 text-slate-200 flex flex-col font-cormorant">
      <StarryBackground />
      <div className="noise-overlay"></div>
      
      {/* Vignette Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,11,20,0.8)_100%)] z-0"></div>

      <header className="relative z-10 w-full pt-8 pb-6 text-center border-b border-white/5 bg-mystic-900/30 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-mystic-gold opacity-50"></div>
          <Star className="w-4 h-4 text-mystic-gold fill-mystic-gold animate-pulse-slow" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-mystic-gold opacity-50"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 tracking-widest drop-shadow-lg font-cinzel">
          Mystic Oracle
        </h1>
        <p className="text-sm text-amber-500/80 mt-2 uppercase tracking-[0.3em] font-cinzel">
          Gateway to the Arcane
        </p>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-6xl mx-auto">
        {appState === 'intro' ? (
          <IntroScreen onStart={handleStart} />
        ) : (
          <TarotTable 
            appState={appState} 
            setAppState={setAppState} 
            userQuestion={userQuestion}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="relative z-10 py-6 text-center text-slate-600 text-sm font-cormorant italic">
        <p className="opacity-60 hover:opacity-100 transition-opacity duration-500">
          The cards reveal the shadows of the soul, illuminating paths of choice, not fixed destiny.
        </p>
      </footer>
<footer className="fixed bottom-0 left-0 w-full text-center py-4 bg-black/80 border-t border-white/20 z-50">
  <p className="text-lg text-white font-medium tracking-wide">
    Designed & Developed by <span className="text-yellow-400 font-bold text-xl mx-1">BY DHU WCL</span> | 
  </p>
</footer>
</footer>
    </div>
  );
}
