import React, { useEffect, useState, useRef } from 'react';
import { AppState, DrawnCard, SpreadPosition } from '../types';
import { FULL_DECK, SPREAD_POSITIONS, LOADING_MESSAGES } from '../constants';
import { TarotCard } from './TarotCard';
import { getTarotReading } from './geminiService';
import { RotateCcw, Feather, Hand } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TarotTableProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  userQuestion: string;
  onReset: () => void;
}

export const TarotTable: React.FC<TarotTableProps> = ({ appState, setAppState, userQuestion, onReset }) => {
  const [deck, setDeck] = useState(FULL_DECK);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [shake, setShake] = useState(false); // Visual "sound" effect
  
  const readingRef = useRef<HTMLDivElement>(null);

  // Shuffle effect
  useEffect(() => {
    if (appState === 'shuffling') {
      let shuffles = 0;
      const maxShuffles = 15;
      const interval = setInterval(() => {
        setDeck(prev => [...prev].sort(() => Math.random() - 0.5));
        shuffles++;
        if (shuffles >= maxShuffles) {
          clearInterval(interval);
          setAppState('drawing');
        }
      }, 80); 
      return () => clearInterval(interval);
    }
  }, [appState, setAppState]);

  const handleDrawCard = () => {
    if (drawnCards.length >= 3) return;

    // Trigger Shake Effect (Visual thud)
    setShake(true);
    setTimeout(() => setShake(false), 200);

    const randomIndex = Math.floor(Math.random() * deck.length);
    const cardData = deck[randomIndex];
    const newDeck = deck.filter((_, i) => i !== randomIndex);
    
    const isReversed = Math.random() < 0.25; 
    
    const newCard: DrawnCard = {
      data: cardData,
      position: SPREAD_POSITIONS[drawnCards.length] as SpreadPosition,
      isReversed,
      isRevealed: false
    };

    setDeck(newDeck);
    const newDrawn = [...drawnCards, newCard];
    setDrawnCards(newDrawn);

    if (newDrawn.length === 3) {
      // Smooth transition to revealing
      setTimeout(() => setAppState('revealing'), 1000);
    }
  };

  // Reveal effect
  useEffect(() => {
    if (appState === 'revealing') {
      const revealSequence = async () => {
        // Pause for dramatic effect
        await new Promise(r => setTimeout(r, 500));
        
        for (let i = 0; i < 3; i++) {
          await new Promise(r => setTimeout(r, 1000)); // Slower reveal
          setDrawnCards(prev => prev.map((c, idx) => idx === i ? { ...c, isRevealed: true } : c));
        }
        
        await new Promise(r => setTimeout(r, 1500));
        setAppState('reading');
      };
      revealSequence();
    }
  }, [appState, setAppState]);

  // Fetch Reading
  useEffect(() => {
    if (appState === 'reading' && !reading && !isReadingLoading) {
      const fetchPrediction = async () => {
        setIsReadingLoading(true);
        const msgInterval = setInterval(() => {
           setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
        }, 3000);

        const result = await getTarotReading(userQuestion, drawnCards);
        
        clearInterval(msgInterval);
        setReading(result);
        setIsReadingLoading(false);
        
        setTimeout(() => {
           readingRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      };
      fetchPrediction();
    }
  }, [appState, reading, drawnCards, userQuestion, isReadingLoading]);


  return (
    <div className={`w-full flex flex-col items-center gap-12 transition-transform duration-100 ${shake ? 'translate-y-1' : ''}`}>
      
      {/* Question Display */}
      <div className="text-center space-y-4 animate-fade-in max-w-2xl">
         <div className="flex items-center justify-center gap-2 text-amber-500/60">
            <span className="h-[1px] w-8 bg-amber-500/40"></span>
            <h3 className="text-xs font-cinzel uppercase tracking-[0.2em]">The Query</h3>
            <span className="h-[1px] w-8 bg-amber-500/40"></span>
         </div>
         <p className="text-2xl md:text-3xl font-cormorant text-amber-100 italic leading-relaxed drop-shadow-md">
           "{userQuestion}"
         </p>
      </div>

      {/* Game Area */}
      <div className="relative w-full flex flex-col md:flex-row items-start justify-center gap-4 md:gap-8 min-h-[500px]">
        
        {/* The Deck (Interactive) */}
        <div className={`
          relative z-30 md:absolute md:left-0 lg:left-10 xl:left-20 transition-all duration-1000 self-center md:self-start mt-8 md:mt-0
          ${appState === 'drawing' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-10 grayscale'}
        `}>
          <div className="relative group cursor-pointer" onClick={appState === 'drawing' ? handleDrawCard : undefined}>
             {/* Deck thickness effect */}
             {[1, 2, 3, 4].map((i) => (
                <div key={i} 
                     className="absolute w-40 h-64 md:w-56 md:h-96 bg-[#1a1814] rounded-xl border border-amber-900/50 shadow-xl"
                     style={{ top: `-${i * 1}px`, left: `-${i * 1}px` }} 
                />
             ))}
             <div className="relative">
                <TarotCard card={null} isInteractable={true} showBack={true} />
                
                {/* Floating Hint */}
                {appState === 'drawing' && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-max text-center text-amber-300 font-cinzel text-sm tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] flex flex-col items-center gap-2 animate-bounce">
                    <span className="bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-amber-500/30">Tap to Draw</span>
                    <Hand className="w-5 h-5 rotate-180 text-amber-400" />
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* The Spread Slots */}
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-8 z-10">
          {Array.from({ length: 3 }).map((_, idx) => {
             const card = drawnCards[idx];
             return (
               <div key={idx} className="flex flex-col items-center w-40 md:w-56">
                  <div className="relative w-40 h-64 md:w-56 md:h-96 perspective-1000 mb-4">
                    {card ? (
                      <div className="animate-fade-in-up relative h-full">
                        <TarotCard card={card} showBack={!card.isRevealed} />
                      </div>
                    ) : (
                      <div className={`
                        absolute inset-0 border-2 border-white/5 rounded-xl flex items-center justify-center
                        transition-all duration-500 h-full
                        ${appState === 'drawing' ? 'border-dashed opacity-40 scale-100' : 'opacity-0 scale-90'}
                      `}>
                        <div className="w-full h-full flex items-center justify-center">
                           <span className="font-cinzel text-white/10 text-4xl font-bold">{idx + 1}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Label - Simplified */}
                  <div className={`
                    w-full text-center transition-all duration-1000 flex flex-col items-center gap-2
                    ${card ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                  `}>
                    {/* Position Label */}
                    <span className="font-cinzel text-amber-500/60 text-[10px] uppercase tracking-[0.2em] border-b border-amber-500/20 pb-1 mb-1 block">
                      {card?.position || SPREAD_POSITIONS[idx]}
                    </span>

                    {/* Just the description now, since name/keywords are on the card */}
                    {card?.isRevealed && (
                      <div className="animate-fade-in flex flex-col items-center gap-2">
                        <p className="text-[11px] md:text-xs text-slate-400 font-cormorant italic leading-tight max-w-[90%]">
                           "{card.data.description}"
                        </p>
                      </div>
                    )}
                  </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Reading Display */}
      {appState === 'reading' && (
        <div ref={readingRef} className="w-full max-w-4xl animate-fade-in-up pb-12">
           {/* ... (Reading display code unchanged except for wrapper context) ... */}
           {isReadingLoading ? (
             <div className="flex flex-col items-center justify-center py-16 space-y-8 relative">
               {/* Summoning Circle Animation */}
               <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 border border-purple-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-8 border border-amber-200/20 rounded-full animate-[spin_6s_linear_infinite]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-2 h-2 bg-amber-100 rounded-full shadow-[0_0_20px_#fff] animate-pulse"></div>
                  </div>
               </div>
               <div className="text-center space-y-2 z-10">
                  <h3 className="text-amber-100 font-cinzel tracking-[0.2em] text-lg animate-pulse">
                    Divining Fate
                  </h3>
                  <p className="text-slate-400 font-cormorant italic text-sm">
                    {loadingMessage}
                  </p>
               </div>
             </div>
           ) : (
             <div className="relative bg-mystic-900/80 border border-amber-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl animate-fade-in-up">
                <div className="h-1 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
                <div className="p-8 md:p-12">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <Feather className="w-6 h-6 text-amber-500" />
                    <h2 className="text-2xl md:text-4xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 text-center drop-shadow-sm">
                      命运解读 (The Reading)
                    </h2>
                    <Feather className="w-6 h-6 text-amber-500 transform scale-x-[-1]" />
                  </div>
                  <div className="prose prose-invert prose-lg max-w-none font-cormorant leading-relaxed text-slate-300 prose-headings:font-cinzel prose-headings:text-amber-100">
                    <ReactMarkdown>{reading}</ReactMarkdown>
                  </div>
                  <div className="mt-12 flex justify-center pt-8 border-t border-white/5">
                    <button onClick={onReset} className="group relative px-8 py-3 overflow-hidden rounded transition-all">
                      <div className="absolute inset-0 border border-amber-500/40 group-hover:border-amber-400/80 transition-colors rounded"></div>
                      <div className="absolute inset-0 bg-amber-900/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                      <span className="relative flex items-center gap-3 text-amber-100 font-cinzel uppercase tracking-widest text-sm group-hover:text-white transition-colors">
                        <RotateCcw className="w-4 h-4" />
                        Conclude Ritual
                      </span>
                    </button>
                  </div>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
