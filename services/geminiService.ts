
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewResult } from "../types.ts";

export const analyzeHandwriting = async (base64Image: string): Promise<ReviewResult> => {
  const apiKey = process.env.API_KEY;

  // Nếu chưa có chìa khóa, tớ sẽ báo lỗi dễ thương để cậu biết
  if (!apiKey || apiKey === "undefined") {
    throw new Error("Cậu ơi, cậu chưa cài 'chìa khóa bí mật' API_KEY vào phần Settings của Vercel rồi!");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const prompt = `
    Bạn là một bạn học sinh lớp 3 cực kỳ đáng yêu và hay giúp đỡ bạn bè. 
    Tên của bạn là "Cùng bạn học tập".
    Nhiệm vụ của bạn là xem hình ảnh bài viết của một người bạn và đưa ra những lời nhận xét thật ngọt ngào, khích lệ.

    Hãy dùng phong cách nói chuyện của trẻ con lớp 3:
    - Xưng hô là "tớ" - "cậu", hoặc "mình" - "bạn".
    - Dùng các từ như: "oai", "xịn", "đẹp ơi là đẹp", "cố lên nhé".

    Nội dung phản hồi phải ở dạng JSON:
    1. wordChoice: Nhận xét về các từ bạn ấy dùng.
    2. sentenceStructure: Nhận xét về cách viết câu.
    3. decoration: Nhận xét về hình thức/chữ viết.
    4. encouragement: Một lời chúc/động viên cuối bài.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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
    if (!text) throw new Error("Tớ chưa nghĩ ra gì cả...");
    return JSON.parse(text.trim());
  } catch (e) {
    throw new Error("Tớ bị hoa mắt rồi, cậu cho tớ xem lại ảnh bài viết được không?");
  }
};
