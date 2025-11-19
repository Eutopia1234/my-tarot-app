import { DrawnCard } from "../types";

// 这里不需要 import GoogleGenAI 了，我们直接用原生网络请求

export const getTarotReading = async (
  question: string,
  cards: DrawnCard[]
): Promise<string> => {
  
  // 1. 整理牌面信息
  const cardDescriptions = cards.map((card, index) => {
    const orientation = card.isReversed ? "Reversed" : "Upright";
    return `${index + 1}. **${card.position}**: ${card.data.name} (${orientation})`;
  }).join('\n');

  // 2. 准备发给 AI 的提示词
  const systemPrompt = `You are a Grand Oracle Tarot Reader. Your persona is ancient, mystical, poetic, and empathetic.
  The Seeker speaks English for the interface, but **YOU MUST PROVIDE THE READING IN CHINESE (中文)**.
  The entire response, including headers, must be in Chinese.
  
  Style Guide:
  - Use beautiful, mystical Chinese vocabulary (e.g., “羁绊”, “微光”, “回响”, “潮汐”, “暗影”).
  - Format: Use Markdown. Use clear headers.`;

  const userPrompt = `
    Seeker's Question: "${question || "General Guidance"}"
    
    The Spread (Past, Present, Future):
    ${cardDescriptions}
    
    Please weave a rich, coherent narrative.
    Structure:
    1. **### 虚空的低语** (Poetic opening)
    2. **### 牌面启示** (Past/Present/Future detailed interpretation)
    3. **### 综合指引** (Synthesis)
    4. **### 命运的箴言** (Final advice)
  `;

  try {
    // 3. 发送请求给 DeepSeek
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}` // 这里用我们新设置的 Key
      },
      body: JSON.stringify({
        model: "deepseek-chat", // DeepSeek 的模型名字
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 1.2, // 稍微调高一点，让它更有创意
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API Error:", errorData);
      throw new Error("DeepSeek API refused connection");
    }

    const data = await response.json();
    return data.choices[0].message.content || "The stars are silent...";

  } catch (error) {
    console.error("Error fetching reading:", error);
    return "The mists have obscured the vision. (Connection failed)";
  }
};
