
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Initialize the API with the server-side environment variable
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    // Strip the base64 prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
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

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
