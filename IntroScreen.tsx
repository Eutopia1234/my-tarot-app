import React, { useState } from 'react';
import { Sparkles, ArrowRight, Moon } from 'lucide-react';

interface IntroScreenProps {
  onStart: (question: string) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onStart(question);
  };

  return (
    <div className="w-full max-w-lg relative group">
      {/* Decorative background blur */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-purple-600 rounded-2xl opacity-20 blur transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative w-full bg-mystic-900/90 border border-amber-500/20 p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center text-center animate-fade-in-up">
        
        <div className="mb-8 relative">
           <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-10 rounded-full"></div>
           <Moon className="w-12 h-12 text-amber-100/80 relative z-10" strokeWidth={1} />
        </div>
        
        <h2 className="text-3xl text-amber-50 font-cinzel mb-4 tracking-wide">Destiny Awaits</h2>
        
        <p className="text-slate-300 mb-10 leading-relaxed font-cormorant text-lg italic">
          "The cards are a mirror to the starlight within. Speak your query to the void, and let the Oracle interpret the echo."
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="relative group/input">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              className="w-full bg-transparent border-b border-slate-700 px-4 py-3 text-2xl text-amber-100 placeholder-slate-600 text-center font-cormorant focus:outline-none focus:border-amber-500 transition-all"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-500 group-focus-within/input:w-full"></div>
          </div>
          
          <button
            type="submit"
            disabled={!question.trim()}
            className="mt-4 group relative w-full py-4 overflow-hidden rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-white/10 transition-all group-hover:border-amber-500/50"></div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <span className="relative flex items-center justify-center gap-3 text-amber-100 font-cinzel font-bold tracking-widest uppercase text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Reveal Destiny
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};