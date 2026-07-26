import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, ToggleLeft, ToggleRight } from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import type { Poem, ThemeId } from '../types';
import { getPoemTypography, getTopicLabel } from '../utils/poemTypography';

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
  const [generationError, setGenerationError] = useState('');
  const posterRef = useRef<HTMLDivElement>(null);
  
  const projectUrl = 'https://holynova.github.io/poetry-flow/';
  const topic = getTopicLabel(poem);
  const { bodyGapClass, contentGapClass, isLong, readingStyle, titleSize } = getPoemTypography(poem, 'share');

  // Generate QR code on mount or when theme changes to ensure readable colors
  useEffect(() => {
    if (!isOpen) return;

    setShowMeta(!isLong);
    setGenerationError('');

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
  }, [isLong, isOpen, theme]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setGenerating(true);
    setGenerationError('');
    
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
      setGenerationError('图片未能生成，请重新尝试。');
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
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
                className="p-1.5 rounded-full hover:bg-surface border border-card-border text-text-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Poster Card Container (The element we capture) */}
            <div className="w-full rounded-[28px] overflow-hidden border border-card-border shadow-2xl">
              <div 
                ref={posterRef}
                className="w-full bg-surface p-6 sm:p-8 flex flex-col justify-between items-stretch text-left relative z-10"
                style={{ minHeight: '440px' }}
              >
                <div className="w-full shrink-0 space-y-2 pt-0.5 text-[11px] font-sans tracking-[0.1em] text-text-secondary sm:tracking-[0.14em]">
                  <div className="flex items-center justify-between gap-3 opacity-75">
                    <span className="font-semibold">POETRY FLOW</span>
                    {topic && <span className="max-w-[58%] shrink-0 whitespace-nowrap text-right">{topic}</span>}
                  </div>
                  <div aria-hidden="true" className="flex items-center gap-2 opacity-55">
                    <span className="h-px w-10 bg-primary/50" />
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    <span className="h-px flex-1 bg-card-border" />
                  </div>
                </div>

                <div className={`flex-1 flex flex-col justify-start items-start ${contentGapClass} pt-8 pb-3 w-full`}>
                  <div>
                    <h2 style={{ fontSize: titleSize }} className="font-serif font-bold text-primary tracking-[0.08em]">
                      {poem.title}
                    </h2>
                  </div>

                  <div aria-hidden="true" className="w-14 h-px bg-primary/30 rounded-full"></div>

                  <div style={readingStyle} className={`${bodyGapClass} font-serif font-medium text-text-primary tracking-[0.025em]`}>
                    {poem.lines.map((line, idx) => (
                      <p key={idx} className="whitespace-nowrap">{line}</p>
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
              <button
                type="button"
                onClick={() => setShowMeta(!showMeta)}
                className="flex w-full items-center justify-between text-left text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>在海报底部显示二维码和项目链接</span>
                <span className="text-primary" aria-hidden="true">
                  {showMeta ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </span>
              </button>

              {generationError && <p role="alert" className="text-xs text-danger">{generationError}</p>}

              <button
                onClick={handleDownload}
                disabled={generating}
                className="w-full py-3 bg-primary text-background font-sans font-bold rounded-xl text-sm tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-55 disabled:pointer-events-none shadow-md"
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
