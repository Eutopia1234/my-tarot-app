import { TarotCardData, Suit } from './types';

const MAJOR_ARCANA_NAMES = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

const SUITS: Suit[] = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const RANKS = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King'];

// --- PRIMARY SOURCE (jsDelivr) ---
// Mapping: ar00.jpg (Major), wa01.jpg (Wands), etc.
const PRIMARY_BASE_URL = "https://cdn.jsdelivr.net/gh/ekelen/tarot-api/static/cards/";

const getPrimaryImage = (isMajor: boolean, suit: string, rankIndex: number, majorIndex: number): string => {
  if (isMajor) {
    return `${PRIMARY_BASE_URL}ar${String(majorIndex).padStart(2, '0')}.jpg`;
  }
  
  const suitPrefix = {
    'Wands': 'wa',
    'Cups': 'cu',
    'Swords': 'sw',
    'Pentacles': 'pe'
  }[suit] || 'wa';
  
  const rankNum = String(rankIndex + 1).padStart(2, '0');
  return `${PRIMARY_BASE_URL}${suitPrefix}${rankNum}.jpg`;
};

// --- BACKUP SOURCE (TrustedTarot) ---
// Uses "two-of-wands.png", "the-fool.png" format
const BACKUP_BASE_URL = "https://www.trustedtarot.com/img/cards/";

const NUMBER_WORDS: {[key: string]: string} = {
  '2': 'two', '3': 'three', '4': 'four', '5': 'five', 
  '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten'
};

const getBackupImage = (name: string): string => {
  // Convert name to slug: "2 of Wands" -> "two-of-wands"
  let formattedName = name.toLowerCase();
  
  // Replace numbers with words
  for (const [digit, word] of Object.entries(NUMBER_WORDS)) {
    // Check if name starts with digit (e.g. "2 of Wands")
    if (formattedName.startsWith(`${digit} `)) {
      formattedName = formattedName.replace(digit, word);
      break;
    }
  }
  
  const slug = formattedName.replace(/\s+/g, '-');
  return `${BACKUP_BASE_URL}${slug}.png`;
};

const generateDeck = (): TarotCardData[] => {
  const deck: TarotCardData[] = [];

  // Major Arcana
  MAJOR_ARCANA_NAMES.forEach((name, index) => {
    const primary = getPrimaryImage(true, 'Major', 0, index);
    const backup = getBackupImage(name);
    
    deck.push({
      id: `major-${index}`,
      name,
      number: index,
      suit: 'Major',
      isMajor: true,
      keywords: ['Destiny', 'Archetype'],
      description: `The ${name} represents a significant soul lesson.`,
      image: primary,
      backupImage: backup
    });
  });

  // Minor Arcana
  SUITS.forEach((suit) => {
    RANKS.forEach((rank, index) => {
      const primary = getPrimaryImage(false, suit, index, 0);
      const name = `${rank} of ${suit}`;
      const backup = getBackupImage(name);

      deck.push({
        id: `${suit.toLowerCase()}-${index}`,
        name: name,
        number: rank,
        suit: suit,
        isMajor: false,
        keywords: [suit, rank],
        description: `The ${rank} of ${suit}.`,
        image: primary,
        backupImage: backup
      });
    });
  });

  return deck;
};

export const FULL_DECK = generateDeck();

export const SPREAD_POSITIONS = ['Past', 'Present', 'Future'];

export const LOADING_MESSAGES = [
  "Consulting the stars...",
  "Stirring the ether...",
  "Drawing from the Well of Fate...",
  "Listening to ancient whispers...",
  "Deciphering the cosmic code...",
  "Aligning the constellations..."
];