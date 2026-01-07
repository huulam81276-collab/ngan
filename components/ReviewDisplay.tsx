
import React from 'react';
import { ReviewResult } from '../types.ts';

interface Props {
  review: ReviewResult;
}

const ReviewDisplay: React.FC<Props> = ({ review }) => {
  return (
    <div className="paper-sheet rounded-[2.5rem] p-10 md:p-14 max-w-2xl mx-auto mt-10 relative overflow-visible">
      {/* Stickers everywhere! */}
      <div className="absolute -top-8 -right-8 text-7xl rotate-12 drop-shadow-lg animate-bounce-slow select-none">💮</div>
      <div className="absolute top-1/2 -left-12 text-6xl -rotate-12 select-none">🍦</div>
      <div className="absolute -bottom-6 right-10 text-6xl rotate-6 select-none">🎈</div>
      
      <div className="flex items-center gap-6 mb-12">
        <div className="relative">
          <div className="text-7xl">🎒</div>
          <div className="absolute -bottom-2 -right-2 text-3xl">✨</div>
        </div>
        <div>
          <h3 className="text-4xl font-black text-blue-500 handwritten">Bạn thân nhận xét:</h3>
          <div className="h-2 w-full bg-blue-100 rounded-full mt-1"></div>
        </div>
      </div>

      <div className="space-y-12 handwritten text-2xl relative z-10">
        <div className="bg-pink-50/60 p-6 rounded-3xl border-2 border-pink-100 transform -rotate-1">
          <p className="font-bold text-pink-500 text-lg uppercase tracking-tighter mb-2">✨ Từ ngữ xịn xò:</p>
          <p className="text-gray-800 leading-relaxed italic">"{review.wordChoice}"</p>
        </div>

        <div className="bg-green-50/60 p-6 rounded-3xl border-2 border-green-100 transform rotate-1">
          <p className="font-bold text-green-500 text-lg uppercase tracking-tighter mb-2">🌈 Câu văn hay ho:</p>
          <p className="text-gray-800 leading-relaxed italic">"{review.sentenceStructure}"</p>
        </div>

        <div className="bg-purple-50/60 p-6 rounded-3xl border-2 border-purple-100 transform -rotate-1">
          <p className="font-bold text-purple-500 text-lg uppercase tracking-tighter mb-2">🎨 Chỗ này đẹp nè:</p>
          <p className="text-gray-800 leading-relaxed italic">"{review.decoration}"</p>
        </div>

        <div className="mt-16 p-10 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-[3.5rem] border-4 border-dashed border-yellow-400 relative text-center shadow-inner">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-8xl">🥇</div>
          <p className="text-4xl font-black text-orange-600 leading-tight pt-4 drop-shadow-sm">
            {review.encouragement}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <span className="text-4xl animate-pulse">💖</span>
            <span className="text-4xl animate-pulse" style={{animationDelay: '0.3s'}}>🍭</span>
            <span className="text-4xl animate-pulse" style={{animationDelay: '0.6s'}}>⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDisplay;
