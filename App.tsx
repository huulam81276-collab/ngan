
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
      setState({ 
        image: base64, 
        loading: false, 
        review: null, 
        error: err.message || "Ối, tớ bị vấp chân rồi! Cậu thử lại nhé?"
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
    <div className="min-h-screen pb-20 px-4 pt-12 bg-[#fdfbf7]">
      <header className="text-center mb-16 relative">
        <div className="inline-block relative">
          <h1 className="text-5xl font-black text-[#2d3436] mb-3 relative z-10 tracking-tight">
            Cùng Bạn Học Tập
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-4 bg-yellow-300 -z-10 rounded-full opacity-60"></div>
        </div>
        <p className="text-[#636e72] text-xl font-medium mt-4 italic">
          Tớ sẽ giúp cậu xem bài viết thật vui và cùng nhau tiến bộ! 🎒
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {!state.review && !state.loading && (
          <div className="bg-white rounded-[3rem] p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-2 border-yellow-100 flex flex-col items-center animate-in">
            <div className="mb-10 text-center">
              <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center text-5xl mb-6 mx-auto border-2 border-yellow-200 shadow-inner">
                ✍️
              </div>
              <h2 className="text-3xl font-bold text-[#2d3436]">Chào cậu! Gửi ảnh bài viết cho tớ nhé?</h2>
              <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                Tớ có thể xem cả chữ viết tay và chữ đánh máy luôn nha!
              </p>
            </div>
            
            <div className="w-full">
              <HandwritingUploader 
                onImageSelect={handleImageSelect} 
                disabled={state.loading} 
              />
            </div>
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center py-24 animate-pulse">
            <div className="relative mb-10">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-6xl shadow-2xl border-8 border-white">
                📖
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white"></div>
            </div>
            <h2 className="text-3xl font-black text-blue-600 mb-2">Đợi tớ một xíu...</h2>
            <p className="text-xl text-gray-500 font-medium italic">Tớ đang nắn nót đọc bài của cậu...</p>
          </div>
        )}

        {state.error && (
          <div className="bg-red-50 border-4 border-red-200 rounded-[2.5rem] p-12 text-center mt-8 shadow-sm animate-in">
            <div className="text-7xl mb-6">⚠️</div>
            <h3 className="text-2xl font-black text-red-600 mb-4">Ối, có lỗi rồi cậu ơi!</h3>
            <p className="text-gray-700 text-xl mb-10 leading-relaxed max-w-md mx-auto">{state.error}</p>
            
            {state.error.includes("API_KEY") && (
              <div className="mb-10 p-4 bg-white rounded-2xl border-2 border-red-100 text-left text-sm text-gray-600">
                <p className="font-bold mb-2">Cách sửa cho cậu nè:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Lên Vercel Dashboard của dự án này.</li>
                  <li>Vào phần <b>Settings</b> -> <b>Environment Variables</b>.</li>
                  <li>Thêm biến tên là <code>API_KEY</code>.</li>
                  <li>Dán dãy số từ Google AI Studio vào.</li>
                  <li>Bấm <b>Deploy</b> lại lần nữa là xong!</li>
                </ol>
              </div>
            )}

            <button 
              onClick={handleReset}
              className="bg-red-500 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-red-600 shadow-xl transition-all transform active:scale-95"
            >
              Thử lại nha!
            </button>
          </div>
        )}

        {state.review && state.image && (
          <div className="space-y-12 animate-in">
            <div className="flex justify-center">
              <div className="relative group">
                <img 
                  src={state.image} 
                  className="max-h-[450px] rounded-3xl shadow-2xl border-[16px] border-white -rotate-1 transition-transform duration-500"
                  alt="Bài của bạn"
                />
                <div className="absolute -bottom-8 -right-8 bg-green-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white text-5xl">
                  🌟
                </div>
              </div>
            </div>

            <ReviewDisplay review={state.review} />

            <div className="flex justify-center pt-8">
              <button 
                onClick={handleReset}
                className="bg-[#2563eb] hover:bg-blue-700 text-white px-16 py-6 rounded-full text-3xl font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95 border-b-[10px] border-blue-900"
              >
                <span>Xem bài khác! 🎒</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-10 left-10 text-9xl opacity-10 pointer-events-none hidden lg:block select-none">✏️</div>
      <div className="fixed top-24 right-12 text-9xl opacity-10 pointer-events-none hidden lg:block rotate-12 select-none">🎨</div>
    </div>
  );
};

export default App;
