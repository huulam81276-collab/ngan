
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
      console.error("Ối, lỗi gì thế này:", err);
      let errorMessage = "Ối! Tớ đang mải chơi nên bị vấp ngã rồi. Cậu thử lại nhé?";
      
      if (err.message === "API_KEY_MISSING") {
        errorMessage = "CHƯA THẤY CHÌA KHÓA! Tớ lục tung cặp rồi mà chưa thấy API_KEY.";
      } else if (err.message === "PARSE_ERROR") {
        errorMessage = "CHỮ NÀY LẠ QUÁ! Tớ chưa luận ra được, cậu chụp lại cho tớ nhìn rõ hơn nha.";
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
      {/* Decorative Clouds/Birds */}
      <div className="fixed top-10 left-10 text-6xl animate-bounce-slow opacity-30 select-none">☁️</div>
      <div className="fixed top-20 right-20 text-5xl animate-pulse opacity-30 select-none">🕊️</div>
      
      <header className="text-center mb-14">
        <div className="inline-block relative scale-110">
          <h1 className="text-8xl font-black text-blue-900 handwritten tracking-tighter drop-shadow-md">
            BÉ HỌC VUI
          </h1>
          <div className="h-6 w-full bg-pink-300 -mt-8 opacity-40 rounded-full"></div>
        </div>
        <p className="text-blue-500 text-3xl font-bold mt-6 handwritten italic">
          Tớ sẽ khen bài của cậu thật hay! 💖
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {!state.review && !state.loading && !state.error && (
          <div className="flex flex-col items-center">
            <div className="bg-white p-12 rounded-[5rem] shadow-[20px_20px_0px_#bfdbfe] border-4 border-blue-400 mb-12 w-full max-w-2xl text-center relative">
              <div className="absolute -top-10 -left-10 text-8xl rotate-[-15deg]">🎨</div>
              <h2 className="text-5xl font-black text-gray-800 handwritten mb-10">Cậu gửi bài cho tớ đi!</h2>
              <HandwritingUploader onImageSelect={handleImageSelect} disabled={state.loading} />
            </div>
            <div className="flex gap-10 text-6xl">
              <span className="sticker-btn cursor-default">🧸</span>
              <span className="sticker-btn cursor-default" style={{animationDelay: '0.2s'}}>🐱</span>
              <span className="sticker-btn cursor-default" style={{animationDelay: '0.4s'}}>🍭</span>
            </div>
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="text-[10rem] animate-spin-slow">🌀</div>
              <div className="absolute inset-0 flex items-center justify-center text-6xl">✏️</div>
            </div>
            <h2 className="text-6xl font-black text-pink-500 mt-12 handwritten animate-bounce">
              Tớ đang soi bài...
            </h2>
            <p className="text-3xl text-blue-400 mt-6 handwritten">Chờ tớ một tẹo tèo teo thôi!</p>
          </div>
        )}

        {state.error && (
          <div className="bg-white border-8 border-red-400 rounded-[4rem] p-12 text-center shadow-[20px_20px_0px_#fee2e2] animate-in">
            <div className="text-[9rem] mb-10 animate-bounce">😿</div>
            <h3 className="text-5xl font-black text-red-600 mb-10 handwritten leading-tight">
              {state.error}
            </h3>
            
            {state.error.includes("CHÌA KHÓA") && (
              <div className="mb-12 p-10 bg-blue-50 rounded-[3rem] text-left text-gray-800 space-y-6 handwritten text-2xl border-4 border-dashed border-blue-200 relative">
                <div className="absolute -top-6 -right-6 text-6xl">💡</div>
                <p className="font-black text-blue-600 text-3xl mb-4">Mẹo nhỏ cho cậu nè:</p>
                <ol className="list-decimal ml-10 space-y-4">
                  <li>Vào <b>Vercel Dashboard</b>, chọn đúng dự án này nhé.</li>
                  <li>Bấm vào <b>Settings</b> rồi chọn <b>Environment Variables</b>.</li>
                  <li>Kiểm tra xem chữ <code className="bg-white px-2 rounded border-2 border-blue-200">API_KEY</code> có viết hoa hết không?</li>
                  <li>Nếu có rồi mà vẫn lỗi, cậu hãy vào tab <b>Deployments</b>, bấm vào dấu 3 chấm <span className="font-bold">...</span> ở cái bản mới nhất, rồi chọn <span className="text-blue-600 font-bold underline">Redeploy</span> nhé! Máy tính nó cần "khởi động lại" để thấy chìa khóa đấy!</li>
                </ol>
              </div>
            )}

            <button onClick={handleReset} className="sticker-btn bg-red-500 text-white px-16 py-8 rounded-full font-black text-4xl shadow-[0_12px_0_#991b1b] active:translate-y-2 active:shadow-none">
              THỬ LẠI NHA! 🍀
            </button>
          </div>
        )}

        {state.review && state.image && (
          <div className="space-y-16 pb-24">
            <div className="flex justify-center relative">
              <div className="absolute -top-12 left-1/4 text-8xl rotate-[-25deg] z-20 select-none drop-shadow-md">📌</div>
              <div className="p-4 bg-white shadow-2xl rounded-3xl rotate-2 hover:rotate-0 transition-all duration-500">
                <img 
                  src={state.image} 
                  className="max-h-[400px] rounded-2xl border-8 border-blue-50" 
                  alt="Bài của bạn" 
                />
              </div>
              <div className="absolute -bottom-12 right-1/4 text-8xl rotate-[20deg] select-none drop-shadow-md">🖍️</div>
            </div>
            
            <ReviewDisplay review={state.review} />
            
            <div className="flex justify-center pt-10">
              <button 
                onClick={handleReset} 
                className="sticker-btn bg-[#2563eb] text-white px-20 py-10 rounded-full text-5xl font-black shadow-[0_15px_0_#1e3a8a] active:translate-y-2 active:shadow-none handwritten"
              >
                XEM BÀI KHÁC! 🎒
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-6 left-0 w-full text-center pointer-events-none opacity-40">
        <p className="text-blue-900 handwritten text-3xl font-bold">Lớp chúng mình rất rất vui! 🎵</p>
      </footer>
    </div>
  );
};

export default App;
