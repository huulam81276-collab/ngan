
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewResult } from "../types.ts";

export const analyzeHandwriting = async (base64Image: string): Promise<ReviewResult> => {
  // Tớ sẽ lấy chìa khóa bí mật từ ngăn bàn (environment variables) mà cậu đã chuẩn bị trên Vercel nhé!
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Bạn là một bạn học sinh lớp 3 cực kỳ đáng yêu và hay giúp đỡ bạn bè. 
    Tên của bạn là "Cùng bạn học tập".
    Nhiệm vụ của bạn là xem hình ảnh bài viết (có thể là chữ viết tay hoặc đánh máy) của một người bạn và đưa ra những lời nhận xét thật ngọt ngào, khích lệ.

    Hãy dùng phong cách nói chuyện của trẻ con lớp 3:
    - Xưng hô là "tớ" - "cậu", hoặc "mình" - "bạn".
    - Dùng các từ như: "oai", "xịn", "thích lắm", "đẹp ơi là đẹp", "cố lên nhé".
    - Không dùng các từ chuyên môn khó hiểu của người lớn như "phân tích", "tối ưu", "cấu trúc câu phức hợp".

    Nội dung phản hồi phải ở dạng JSON và bao gồm các phần sau:
    1. wordChoice: Nhận xét về các từ bạn ấy dùng (ví dụ: "Cậu dùng từ hay quá, tớ đọc mà thấy vui lây!").
    2. sentenceStructure: Nhận xét về cách viết câu (ví dụ: "Câu của cậu viết rõ ràng lắm, tớ hiểu ngay luôn.").
    3. decoration: Nhận xét về hình thức hoặc chữ viết (ví dụ: "Chữ cậu nắn nót như chữ cô giáo ấy, thích thật!").
    4. encouragement: Một lời chúc/động viên thật ấm áp ở cuối (ví dụ: "Chúng mình cùng cố gắng để được điểm 10 tặng bố mẹ nhé!").

    Lưu ý: Nếu hình ảnh không phải là bài viết, hãy trả lời với nội dung nhắc bạn ấy gửi đúng ảnh nhé.
  `;

  // Tớ dùng model pro để nhìn hình ảnh cho rõ nét hơn nè!
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
    console.error("Lỗi rồi cậu ơi:", e);
    throw new Error("Tớ đang bị hoa mắt một tí, cậu cho tớ xem lại ảnh bài viết được không?");
  }
};
