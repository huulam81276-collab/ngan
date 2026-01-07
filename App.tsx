
import React, { useState } from 'react';
import HandwritingUploader from './components/HandwritingUploader.tsx';
import ReviewDisplay from './components/ReviewDisplay.tsx';
import { analyzeHandwriting } from './services/geminiService.ts';
import { AppState } from './types.ts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    loading: false,
    review: null,
    error: null,
  });

  const handleImageSelect = async (base64: string) => {
    setState({ ...state, image: base64, loading: true, review: null, error: null });
    
    try {
      const review = await analyzeHandwriting(base64);
      setState({ 
        image: base64, 
        loading: false, 
        review, 
        error: null 
      });
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Ối, tớ bị vấp chân rồi! Cậu thử lại nhé?";
      
      if (err.message === "API_KEY_MISSING") {
        errorMessage = "Cậu ơi, máy tính chưa tìm thấy 'chìa khóa' API_KEY của cậu!";
      } else if (err.message === "PARSE_ERROR") {
        errorMessage = "Tớ hoa mắt quá nên chưa đọc được chữ, cậu chụp rõ hơn nha!";
      }

      setState({ 
        image: base64, 
        loading: false, 
        review: null, 
        error: errorMessage
      });
    }
  };

  const handleReset = () => {
    setState({
      image: null,
      loading: false,
      review: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen pb-32 px-4 pt-10">
      <header className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-20 text-9xl">🎨</div>
        <div className="inline-block relative">
          <h1 className="text-6xl font-black text-[#2d3436] mb-2 handwritten tracking-wide">
            Cùng Bạn Học Tập
          </h1>
          <div className="w-full h-4 bg-yellow-400 rounded-full -mt-4 opacity-50"></div>
        </div>
        <p className="text-[#636e72] text-2xl font-bold mt-4 handwritten">
          Gửi bài cho tớ, tớ khen cho mà xem! 🌻
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {!state.review && !state.loading && (
          <div className="flex flex-col items-center animate-in">
            <HandwritingUploader onImageSelect={handleImageSelect} disabled={state.loading} />
            <div className="mt-12 flex gap-6 text-5xl">
              <span className="sticker">🧸</span>
              <span className="sticker">🚲</span>
              <span className="sticker">🍭</span>
              <span className="sticker">⚽</span>
            </div>
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="text-9xl animate-bounce">✍️</div>
              <div className="absolute -bottom-4 left-0 w-full h-2 bg-black/10 rounded-full blur-sm"></div>
            </div>
            <h2 className="text-4xl font-black text-blue-500 mt-12 handwritten">Tớ đang đọc thật kỹ nè...</h2>
            <p className="text-xl text-gray-400 mt-2 handwritten">Đợi tớ xíu xiu thôi nhé!</p>
          </div>
        )}

        {state.error && (
          <div className="bg-white border-8 border-red-200 rounded-[3rem] p-10 text-center shadow-2xl animate-pop">
            <div className="text-8xl mb-6">🙀</div>
            <h3 className="text-3xl font-black text-red-500 mb-6 handwritten">{state.error}</h3>
            
            {state.error.includes("API_KEY") && (
              <div className="mb-8 p-6 bg-red-50 rounded-2xl text-left text-gray-700 space-y-4 handwritten text-xl border-2 border-red-100">
                <p className="font-bold text-red-600">Cách sửa lỗi cho cậu nè:</p>
                <p>🌟 Cậu vào tab <b>Deployments</b> trên Vercel.</p>
                <p>🌟 Chọn cái bản mới nhất, bấm nút <b>3 chấm</b>.</p>
                <p>🌟 Rồi bấm <b>Redeploy</b> là xong luôn!</p>
              </div>
            )}

            <button onClick={handleReset} className="bg-red-500 text-white px-10 py-4 rounded-full font-bold text-2xl hover:bg-red-600 shadow-[0_6px_0_rgb(185,28,28)] transition-all active:translate-y-1 active:shadow-none">
              Thử lại lần nữa! 🍀
            </button>
          </div>
        )}

        {state.review && state.image && (
          <div className="space-y-12 animate-in">
            <div className="flex justify-center relative">
              <div className="absolute -top-6 -left-6 text-6xl rotate-[-20deg] z-10">📌</div>
              <img 
                src={state.image} 
                className="max-h-[400px] rounded-lg shadow-2xl border-[12px] border-white rotate-1 hover:rotate-0 transition-transform duration-500" 
                alt="Bài của bạn" 
              />
              <div className="absolute -bottom-6 -right-6 text-6xl rotate-[15deg]">🖍️</div>
            </div>
            
            <ReviewDisplay review={state.review} />
            
            <div className="flex justify-center pt-8">
              <button 
                onClick={handleReset} 
                className="bg-[#3498db] text-white px-12 py-5 rounded-full text-3xl font-black shadow-[0_10px_0_#2980b9] transition-all hover:scale-105 active:translate-y-2 active:shadow-none handwritten"
              >
                Gửi bài khác nha! 🎒
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-4 text-center pointer-events-none">
        <p className="text-gray-400 handwritten text-xl">Lớp chúng mình rất rất vui! 🎵</p>
      </footer>
    </div>
  );
};

export default App;
