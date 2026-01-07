
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewResult } from "../types.ts";

export const analyzeHandwriting = async (base64Image: string): Promise<ReviewResult> => {
  // Tớ sẽ tìm chìa khóa thật kỹ trong ngăn bàn này
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.length < 5) {
    console.error("Huhu, tớ tìm khắp cặp mà không thấy chìa khóa API_KEY đâu!");
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    Chào bạn! Bạn là một người bạn thân học lớp 3 cực kỳ đáng yêu.
    Hãy xem bức ảnh bài viết/bài vẽ này và nhận xét thật hồn nhiên nhé.
    Cách nói chuyện:
    - Xưng hô là "tớ" và "cậu".
    - Khen ngợi là chính, góp ý thật nhẹ nhàng như "nếu cậu sửa chỗ này một tí thì sẽ xinh hơn đấy".
    - Dùng nhiều từ như "oai", "xịn", "đẹp xỉu", "yêu thế".

    Trả về JSON với các ngăn:
    1. wordChoice: Nhận xét về những từ ngữ hay hay mà bạn ấy dùng.
    2. sentenceStructure: Nhận xét về cách bạn ấy viết câu có dài hay ngắn, có vui không.
    3. decoration: Nhận xét về chữ viết hoặc những hình vẽ trang trí xung quanh.
    4. encouragement: Một lời chúc thật ngọt ngào như "tớ tin cậu sẽ là thủ khoa lớp mình".
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          wordChoice: { type: Type.STRING },
          sentenceStructure: { type: Type.STRING },
          decoration: { type: Type.STRING },
          encouragement: { type: Type.STRING },
        },
        required: ["wordChoice", "sentenceStructure", "decoration", "encouragement"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    return JSON.parse(text.trim());
  } catch (e) {
    throw new Error("PARSE_ERROR");
  }
};
