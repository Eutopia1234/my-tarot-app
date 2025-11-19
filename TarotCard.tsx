import React, { useState, useEffect } from 'react';
import { DrawnCard } from '../types';
import { Crown, Sparkles, Diamond, Sword, Wine, Circle } from 'lucide-react';

interface TarotCardProps {
  card: DrawnCard | null;
  onClick?: () => void;
  isInteractable?: boolean;
  showBack?: boolean;
}

export const TarotCard: React.FC<TarotCardProps> = ({ 
  card, 
  onClick, 
  isInteractable = false,
  showBack = true
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [usingBackup, setUsingBackup] = useState(false);
  
  const isRevealed = card?.isRevealed && !showBack;
  const isReversed = card?.isReversed || false;

  useEffect(() => {
    if (card) {
      setCurrentSrc(card.data.image); // Start with primary
      setImageState('loading');
      setUsingBackup(false);
    }
  }, [card]);

  const handleError = () => {
    if (!usingBackup && card?.data.backupImage) {
      console.log(`Primary image failed for ${card.data.name}, switching to backup...`);
      setCurrentSrc(card.data.backupImage);
      setUsingBackup(true);
      setImageState('loading');
    } else {
      console.warn(`All image sources failed for: ${card?.data.name}`);
      setImageState('error');
    }
  };

  const handleLoad = () => {
    setImageState('loaded');
  };

  const getSuitIcon = (suit: string) => {
    switch(suit) {
      case 'Cups': return <Wine className="w-3 h-3" />;
      case 'Swords': return <Sword className="w-3 h-3" />;
      case 'Pentacles': return <Circle className="w-3 h-3" />;
      case 'Wands': return <Diamond className="w-3 h-3" />; // Wands often diamond/club like
      default: return <Crown className="w-3 h-3" />;
    }
  };

  // The "Base" Card - Shows text/design immediately. 
  // Acts as the fallback AND the placeholder while loading.
  const renderBaseCardLayer = () => (
    <div className="w-full h-full bg-[#e3d6b8] p-3 flex flex-col items-center justify-between border-[6px] border-[#2a2a2a] relative overflow-hidden">
      <div className="absolute inset-0 border border-double border-[#8b5a2b] m-1 opacity-50"></div>
      <div className="z-10 mt-4 flex flex-col items-center">
        <span className="text-[#4a3b22] font-cinzel font-bold text-lg uppercase text-center leading-none">
           {card?.data.isMajor ? 'Arcana' : card?.data.suit}
        </span>
        <div className="w-full h-[1px] bg-[#4a3b22] my-2 w-1/2"></div>
      </div>
      
      <div className="z-10 flex flex-col items-center gap-2 text-[#4a3b22] flex-grow justify-center">
        {/* Icon placeholder if image isn't there yet */}
        <div className="w-12 h-12 border-2 border-[#4a3b22] rounded-full flex items-center justify-center opacity-20">
           <span className="font-cinzel font-bold text-xl">{card?.data.number}</span>
        </div>
        <h3 className="font-cormorant font-bold text-center text-xl leading-tight px-2 mt-2">
          {card?.data.name}
        </h3>
      </div>

      <div className="z-10 mb-2 text-[#4a3b22] font-cinzel text-xs uppercase">
        {card?.data.isMajor ? 'Major' : 'Minor'}
      </div>
      
      {/* Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-40 mix-blend-multiply pointer-events-none"></div>
    </div>
  );

  return (
    <div 
      className={`
        group relative w-40 h-64 md:w-56 md:h-96 perspective-1000 
        ${isInteractable ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={isInteractable ? onClick : undefined}
    >
      <div className={`
        w-full h-full relative transform-style-3d transition-all duration-[1.2s] cubic-bezier(0.4, 0, 0.2, 1)
        ${isRevealed ? 'rotate-y-180' : ''}
        ${isInteractable && !isRevealed ? 'group-hover:scale-105 group-hover:-translate-y-4' : ''}
      `}>
        
        {/* --- CARD BACK --- */}
        <div className={`
           absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl bg-[#0a0f1d] z-10
           ${isInteractable ? 'group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-shadow duration-300' : ''}
        `}>
          <div className="absolute inset-0 border-[6px] border-[#5c4d1f] rounded-xl z-20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_0%,#000000_100%)]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative p-4 border-2 border-[#5c4d1f]/30 rounded-full group-hover:border-[#d4af37]/60 transition-colors">
               <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full animate-pulse-slow"></div>
               <Crown className="w-8 h-8 text-[#d4af37] drop-shadow-md opacity-80" strokeWidth={1.5} />
             </div>
          </div>
        </div>

        {/* --- CARD FRONT --- */}
        <div className={`
          absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden 
          bg-slate-900 border border-[#222]
          flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.9)]
        `}>
           
           {/* 1. Base Layer: Always rendered. If image fails, this is what the user sees. */}
           <div className="absolute inset-0 z-0">
              {card && renderBaseCardLayer()}
           </div>

           {/* Reveal Glow Effect */}
           <div className={`absolute inset-0 bg-amber-500/30 z-50 pointer-events-none transition-opacity duration-1000 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}></div>

           <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${isReversed ? 'rotate-180' : ''} transition-transform duration-700`}>
              {card && (
                <>
                  {/* 2. The Image Layer: Fades in on top of the base layer */}
                  <img 
                    src={currentSrc} 
                    alt={card.data.name}
                    className={`
                      relative z-20 w-full h-full object-cover 
                      transition-all duration-1000 ease-out mix-blend-normal
                      ${imageState === 'loaded' ? 'opacity-100' : 'opacity-0'}
                    `}
                    onLoad={handleLoad}
                    onError={handleError}
                  />
                  
                  {/* Loading Indicator (Subtle) */}
                  {imageState === 'loading' && (
                     <div className="absolute top-2 right-2 z-30">
                        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                     </div>
                  )}
                  
                  {/* Vintage Texture Overlay (On top of image) */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-20 mix-blend-overlay pointer-events-none z-30"></div>
                  
                  {/* Edge Vignette */}
                  <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] pointer-events-none z-30"></div>
                </>
              )}
           </div>

           {/* 3. Info Overlay - High Prominence (Name & Keywords) */}
           {isRevealed && card && (
              <div className={`
                  absolute bottom-0 left-0 w-full z-40
                  bg-gradient-to-t from-mystic-900 via-mystic-900/90 to-transparent
                  pt-12 pb-4 px-2 flex flex-col items-center text-center
                  transition-transform duration-700
                  ${isReversed ? 'rotate-180' : ''}
              `}>
                 <h3 className="text-amber-100 font-cinzel font-bold text-lg md:text-xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-2">
                    {card.data.name}
                 </h3>
                 
                 <div className="flex flex-wrap justify-center gap-1.5 px-1">
                    {card.data.keywords.map((k) => (
                      <span 
                        key={k} 
                        className="
                          inline-flex items-center px-2 py-0.5 rounded-full
                          bg-amber-500/90 text-mystic-900 
                          font-bold text-[9px] md:text-[10px] uppercase tracking-widest
                          shadow-[0_0_10px_rgba(245,158,11,0.5)]
                          border border-amber-300/50
                        "
                      >
                        {k}
                      </span>
                    ))}
                 </div>

                 <div className="flex items-center gap-1 mt-2 text-[10px] text-amber-400/60 uppercase font-cinzel tracking-widest">
                    {getSuitIcon(card.data.suit)}
                    <span>{card.data.suit}</span>
                 </div>
              </div>
           )}

           {/* Reversed Label (Top if reversed because image is flipped, but visually 'bottom' relative to screen) */}
           {isReversed && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
               <span className="px-2 py-0.5 bg-rose-900/90 text-rose-200 text-[9px] uppercase tracking-widest border border-rose-500/30 rounded shadow-lg font-cinzel">
                 Reversed
               </span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};