import { GoogleGenAI } from "@google/genai";
import { DrawnCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTarotReading = async (
  question: string,
  cards: DrawnCard[]
): Promise<string> => {
  
  const cardDescriptions = cards.map((card, index) => {
    const orientation = card.isReversed ? "Reversed" : "Upright";
    return `${index + 1}. **${card.position}**: ${card.data.name} (${orientation})`;
  }).join('\n');

  const prompt = `
    You are a Grand Oracle Tarot Reader. Your persona is ancient, mystical, poetic, and empathetic.
    
    Seeker's Question: "${question || "General Guidance"}"
    
    The Spread (Past, Present, Future):
    ${cardDescriptions}
    
    Please weave a rich, coherent narrative. Do not just list card meanings; explain how the energy flows from the past, anchors in the present, and projects into the future.
    
    **CRITICAL LANGUAGE REQUIREMENT:**
    The Seeker speaks English for the interface, but **YOU MUST PROVIDE THE READING IN CHINESE (中文)**.
    The entire response, including headers, must be in Chinese.
    
    **Style Guide:**
    - Use beautiful, mystical Chinese vocabulary (e.g., “羁绊”, “微光”, “回响”, “潮汐”, “暗影”).
    - Be compassionate but honest.
    - Format: Use Markdown. Use clear headers.
    
    **Response Structure (Translate headers to Chinese):**
    1. **### 虚空的低语 (The Whispers)** 
       (A poetic opening acknowledging the question and overall energy).
    
    2. **### 牌面启示 (The Arcana)**
       - **过往的回响 (The Echo - Past):** Interpret the first card. How did we get here?
       - **当下的锚点 (The Anchor - Present):** Interpret the second card. What forces are acting now?
       - **未来的地平线 (The Horizon - Future):** Interpret the third card. Where is this leading?
    
    3. **### 综合指引 (Synthesis)**
       How do the cards interact? Is there a conflict between head and heart? Is this a journey from darkness to light?
    
    4. **### 命运的箴言 (The Decree)**
       A single powerful sentence or advice as a final takeaway.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an ancient spirit. Your words are precious like gold and soft like velvet. You speak in the rhythm of tides. You MUST answer in CHINESE.",
        temperature: 0.9, 
      }
    });
    
    return response.text || "The stars are silent...";
  } catch (error) {
    console.error("Error fetching reading:", error);
    return "The mists have obscured the vision. Please try again later.";
  }
};