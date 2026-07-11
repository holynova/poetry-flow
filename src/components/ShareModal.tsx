import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, ToggleLeft, ToggleRight } from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import type { Poem, ThemeId } from '../types';

interface ShareModalProps {
  poem: Poem;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeId;
}

export const ShareModal: React.FC<ShareModalProps> = ({ poem, isOpen, onClose, theme }) => {
  const [showMeta, setShowMeta] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  
  const projectUrl = 'https://holynova.github.io/poetry-flow/';

  // Generate QR code on mount or when theme changes to ensure readable colors
  useEffect(() => {
    if (!isOpen) return;

    const qrColorDark = theme === 'dark' ? '#E2ECE7' : '#1F2421';
    const qrColorLight = theme === 'dark' ? '#1B201D' : '#FFFFFF';

    QRCode.toDataURL(projectUrl, {
      margin: 1.5,
      width: 100,
      color: {
        dark: qrColorDark,
        light: qrColorLight,
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, theme]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setGenerating(true);
    
    try {
      // Small timeout to allow state updates or images to load fully
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.95,
        pixelRatio: 2, // Retain sharp details
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      
      const link = document.createElement('a');
      link.download = `PoetryFlow_${poem.title}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate poster image', error);
      alert('生成图片失败，请稍后重试');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.93, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.93, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-full max-w-sm flex flex-col items-center gap-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Title */}
            <div className="w-full flex justify-between items-center px-2">
              <span className="text-sm font-bold tracking-wider font-sans text-text-secondary flex items-center gap-1.5">
                <Share2 size={16} />
                分享卡片
              </span>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-surface border border-card-border text-text-primary active:scale-95 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Poster Card Container (The element we capture) */}
            <div className="w-full rounded-[28px] overflow-hidden border border-card-border shadow-2xl">
              <div 
                ref={posterRef}
                className="w-full bg-surface p-8 flex flex-col justify-between items-center text-center relative z-10"
                style={{ minHeight: '440px' }}
              >
                {/* Header Meta */}
                <div className="w-full flex justify-between items-center opacity-65 text-[9px] tracking-widest font-sans text-text-secondary mb-4">
                  <span>POETRY FLOW</span>
                  <span>{poem.tags.join(' · ')}</span>
                </div>

                {/* Poem Body */}
                <div className="flex-1 flex flex-col justify-center items-center gap-5 my-3 w-full">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-serif font-bold text-text-primary tracking-wider">
                      《{poem.title}》
                    </h2>
                    <p className="text-text-secondary text-[10px] font-sans tracking-widest uppercase opacity-70">
                      {poem.author}
                    </p>
                  </div>

                  <div className="w-8 h-[1.5px] bg-primary/20 rounded-full"></div>

                  <div className="space-y-2.5 font-serif font-medium text-text-primary text-[15px] leading-relaxed tracking-widest">
                    {poem.lines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>

                {/* QR Code and URL Section */}
                {showMeta && (
                  <div className="w-full mt-6 pt-5 border-t border-card-border flex items-center justify-between text-left px-2 gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <p className="text-[11px] font-sans font-bold text-text-primary tracking-wide">
                        Poetry Flow 诗歌流
                      </p>
                      <p className="text-[9px] font-sans text-text-secondary truncate opacity-85">
                        {projectUrl}
                      </p>
                      <p className="text-[8px] font-sans text-text-secondary opacity-60">
                        长按或扫码，发现下一首诗
                      </p>
                    </div>
                    {qrCodeUrl && (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-16 h-16 object-contain rounded-md border border-card-border shrink-0" 
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Toggle options & action button panel */}
            <div className="w-full bg-surface/50 border border-card-border rounded-2xl p-4 flex flex-col gap-4">
              <div 
                onClick={() => setShowMeta(!showMeta)}
                className="flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>在海报底部显示二维码和项目链接</span>
                <button className="text-primary active:scale-95 transition-transform">
                  {showMeta ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>

              <button
                onClick={handleDownload}
                disabled={generating}
                className="w-full py-3 bg-primary text-background font-sans font-bold rounded-xl text-sm tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 disabled:pointer-events-none shadow-md"
              >
                <Download size={18} />
                {generating ? '正在生成图片...' : '保存高清卡片图片'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ShareModal;
