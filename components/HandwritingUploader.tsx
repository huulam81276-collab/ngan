
import React, { useRef } from 'react';

interface Props {
  onImageSelect: (base64: string) => void;
  disabled: boolean;
}

const HandwritingUploader: React.FC<Props> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div 
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`w-full max-w-lg aspect-[4/3] border-8 border-dashed rounded-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
          ${disabled ? 'bg-gray-100 border-gray-300' : 'bg-[#fffdf0] border-orange-300 hover:border-orange-500 hover:rotate-1'}`}
      >
        <div className="text-8xl mb-4 animate-bounce">📸</div>
        <p className="text-2xl font-bold text-orange-600 px-8 text-center handwritten">
          {disabled ? 'Tớ đang lấy kính lúp ra soi bài đây...' : 'Cậu bấm vào đây để chụp hoặc gửi ảnh bài viết cho tớ nhé!'}
        </p>
        <div className="absolute bottom-4 right-8 text-4xl opacity-30">🖍️</div>
        <div className="absolute top-4 left-8 text-4xl opacity-30">🎒</div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        disabled={disabled}
      />
    </div>
  );
};

export default HandwritingUploader;
