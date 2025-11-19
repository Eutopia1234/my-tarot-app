import { DrawnCard } from "../types";

// 这里使用的是 智谱 AI (GLM-4-Flash) - 永久免费模型
// 官方文档地址: https://bigmodel.cn/

export const getTarotReading = async (
  question: string,
  cards: DrawnCard[]
): Promise<string> => {
  
  // 1. 整理牌面
  const cardDescriptions = cards.map((card, index) => {
    const orientation = card.isReversed ? "Reversed" : "Upright";
    return `${index + 1}. **${card.position}**: ${card.data.name} (${orientation})`;
  }).join('\n');

  // 2. 提示词
  const systemPrompt = `你是一位神秘、充满同理心的塔罗牌占卜大师。
  请用**中文**为用户解读牌面。语言风格要优美、神秘、富有哲理（例如使用“羁绊”、“微光”、“回响”、“指引”等词汇）。
  
  格式要求：使用 Markdown 格式，包含清晰的标题。`;

  const userPrompt = `
    求问者的问题: "${question || "寻求综合指引"}"
    
    牌阵信息 (过去/现在/未来):
    ${cardDescriptions}
    
    请按照以下结构解读：
    1. **### 🌌 虚空的低语** (开场白，感知求问者的能量)
    2. **### 🎴 牌面启示** (对每一张牌进行深度解读，联系过去、现在和未来)
    3. **### 🔮 综合指引** (总结牌阵的整体启示，给出建议)
    4. **### ✨ 命运的箴言** (一句话的总结与祝福)
  `;

  try {
    // 3. 发送请求给 智谱 AI
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_ZHIPU_API_KEY}` // 这里对应 Vercel 里的名字
      },
      body: JSON.stringify({
        model: "glm-4-flash", // 这个模型是免费的！
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Zhipu API Error:", errorData);
      throw new Error("API refused connection");
    }

    const data = await response.json();
    return data.choices[0].message.content || "星辰此刻保持沉默...";

  } catch (error) {
    console.error("Error fetching reading:", error);
    return "迷雾遮住了视线，请稍后再试。(连接失败)";
  }
};
