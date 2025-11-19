export type Suit = 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | 'Major';

export interface TarotCardData {
  id: string;
  name: string;
  number: number | string;
  suit: Suit;
  keywords: string[];
  isMajor: boolean;
  description: string; // Short description for fallback
  image: string; // Primary High-Res Image
  backupImage: string; // Secondary Reliable Image
}

export type SpreadPosition = 'Past' | 'Present' | 'Future';

export interface DrawnCard {
  data: TarotCardData;
  position: SpreadPosition;
  isReversed: boolean;
  isRevealed: boolean;
}

export type AppState = 'intro' | 'shuffling' | 'drawing' | 'revealing' | 'reading';

export interface ReadingResponse {
  markdown: string;
}