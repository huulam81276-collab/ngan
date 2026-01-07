
import React from 'react';
import { ReviewResult } from '../types.ts';

interface Props {
  review: ReviewResult;
}

const ReviewDisplay: React.FC<Props> = ({ review }) => {
  return (
    <div className="notebook-page rounded-[2rem] p-8 md:p-12 relative max-w-3xl mx-auto mt-8 animate-pop">
      {/* "Tape" elements */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-yellow-200/60 rotate-2 border border-yellow-300/50"></div>
      
      <div className="flex items-center gap-4 mb-10">
        <div className="text-5xl">🧒</div>
        <div>
          <h3 className="text-3xl font-black text-blue-600 handwritten">Cùng bạn học tập nói là:</h3>
          <div className="h-1 w-full bg-blue-200 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-8 handwritten">
        <div className="bg-pink-50/50 p-6 rounded-2xl border-2 border-pink-100 relative">
          <div className="absolute -top-4 -left-2 bg-pink-400 text-white px-3 py-1 rounded-lg text-sm font-bold rotate-[-5deg]">TỪ NGỮ</div>
          <p className="text-2xl text-gray-800 leading-snug pt-2">"{review.wordChoice}"</p>
        </div>

        <div className="bg-green-50/50 p-6 rounded-2xl border-2 border-green-100 relative">
          <div className="absolute -top-4 -left-2 bg-green-400 text-white px-3 py-1 rounded-lg text-sm font-bold rotate-[3deg]">CÂU VĂN</div>
          <p className="text-2xl text-gray-800 leading-snug pt-2">"{review.sentenceStructure}"</p>
        </div>

        <div className="bg-purple-50/50 p-6 rounded-2xl border-2 border-purple-100 relative">
          <div className="absolute -top-4 -left-2 bg-purple-400 text-white px-3 py-1 rounded-lg text-sm font-bold rotate-[-2deg]">TRANG TRÍ</div>
          <p className="text-2xl text-gray-800 leading-snug pt-2">"{review.decoration}"</p>
        </div>

        <div className="mt-12 text-center py-8 px-6 bg-orange-100/50 rounded-[3rem] border-4 border-dashed border-orange-300 relative">
          <div className="text-4xl absolute -top-8 left-1/2 -translate-x-1/2">🌟</div>
          <p className="text-3xl font-black text-orange-600 italic leading-tight">
            {review.encouragement}
          </p>
          <div className="flex justify-center gap-2 mt-4 text-2xl">
            <span>🌸</span><span>✨</span><span>🎈</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDisplay;
