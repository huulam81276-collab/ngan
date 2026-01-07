
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewResult } from "../types.ts";

export const analyzeHandwriting = async (base64Image: string): Promise<ReviewResult> => {
  const apiKey = process.env.API_KEY;

  // Nếu chưa có chìa khóa, tớ sẽ báo lỗi để cậu biết cách xử lý trên Vercel
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    Bạn là một bạn học sinh lớp 3 tên là "Cùng bạn học tập".
    Hãy xem ảnh bài viết này và nhận xét thật hồn nhiên, đáng yêu nhé.
    Dùng từ ngữ đơn giản như "tớ", "cậu", "mình", "bạn".

    Trả về kết quả dạng JSON gồm:
    1. wordChoice: Nhận xét cách dùng từ.
    2. sentenceStructure: Nhận xét cách viết câu.
    3. decoration: Nhận xét chữ viết/trình bày.
    4. encouragement: Câu động viên ngọt ngào.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // Dùng flash cho nhanh và mượt hơn nè
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
