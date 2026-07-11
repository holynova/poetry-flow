import React, { useState } from 'react';
import { ArrowLeft, LayoutGrid, List, Bookmark, Trash2, X, Share2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePoemStats } from '../hooks/usePoemStats';
import { ShareModal } from '../components/ShareModal';
import type { Poem, ThemeId } from '../types';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { getLikedPoems, removeLike } = usePoemStats();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const likedPoems = getLikedPoems();

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('确定要移出收藏吗？')) {
      removeLike(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-text-primary overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 pt-[max(1.2rem,env(safe-area-inset-top))] px-4 bg-background z-10 w-full max-w-lg mx-auto">
        <div className="relative flex items-center justify-center mb-6 mt-2">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-0 p-2 text-text-secondary hover:bg-surface/40 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold font-sans tracking-wide">已收藏的诗歌</h1>
        </div>

        {/* View Toggle */}
        <div className="bg-surface/40 p-1 rounded-full flex mb-6 mx-4 border border-card-border backdrop-blur-sm">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-surface text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List size={14} />
            <span>列表</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-surface text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <LayoutGrid size={14} />
            <span>网格</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 w-full max-w-lg mx-auto scroll-smooth">
        {likedPoems.length === 0 ? (
          <div className="text-center py-20 text-text-secondary/60 flex flex-col items-center justify-center gap-3">
            <Bookmark size={40} className="stroke-[1.2] opacity-40" />
            <div className="space-y-1">
              <p className="text-sm font-medium">还没有收藏的诗歌</p>
              <p className="text-xs opacity-80">在首页发现打动你的诗行，向右滑动收藏</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-5 py-2 bg-primary text-background font-sans font-semibold rounded-full text-xs tracking-wider hover:opacity-90 transition-all active:scale-95"
            >
              去读诗
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {likedPoems.map((poem) => (
                <motion.div 
                  key={poem.id}
                  layoutId={`list-item-${poem.id}`}
                  onClick={() => setSelectedPoem(poem)}
                  className="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-card-border active:scale-[0.99] transition-transform cursor-pointer relative overflow-hidden group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0 text-primary">
                    <Bookmark className="fill-current" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-serif font-bold truncate text-base tracking-wide">
                      《{poem.title}》
                    </p>
                    <p className="text-text-secondary text-xs font-sans mt-0.5">
                      — {poem.lines[0]}...
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDelete(e, poem.id)}
                    className="p-2 text-text-secondary/50 hover:text-danger hover:bg-danger/10 rounded-full transition-all duration-200 z-10 active:scale-95"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            <AnimatePresence mode="popLayout">
              {likedPoems.map((poem) => (
                <motion.div 
                  key={poem.id}
                  layoutId={`grid-item-${poem.id}`}
                  onClick={() => setSelectedPoem(poem)}
                  className="bg-surface p-4 rounded-2xl border border-card-border flex flex-col aspect-square justify-between active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden shadow-sm"
                >
                  <div className="flex justify-between items-center z-10 w-full">
                    <Bookmark size={16} className="text-primary fill-current" />
                    <button 
                      onClick={(e) => handleDelete(e, poem.id)}
                      className="p-1 text-text-secondary/40 hover:text-danger rounded-full transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center text-center my-2 z-10 px-1">
                    <p className="text-text-primary font-serif font-bold text-[15px] leading-relaxed tracking-wider">
                      《{poem.title}》
                    </p>
                  </div>

                  <p className="text-text-secondary text-[10px] tracking-wider text-center z-10 opacity-70">
                    {poem.lines.length} 行诗 · {poem.tags[0]}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Expand Reader Modal Popup */}
      <AnimatePresence>
        {selectedPoem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedPoem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-surface border border-card-border rounded-[36px] overflow-hidden shadow-2xl p-8 flex flex-col items-center justify-between text-center min-h-[440px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Share Button */}
              <button 
                onClick={() => setIsShareOpen(true)}
                className="absolute top-6 left-6 z-30 p-2 rounded-full bg-background/80 hover:bg-background border border-card-border text-text-primary active:scale-95 transition-all duration-200"
                title="分享这首诗"
              >
                <Share2 size={18} />
              </button>

              {/* Close Button */}
              <button 
                onClick={() => { setSelectedPoem(null); setIsShareOpen(false); }}
                className="absolute top-6 right-6 z-30 p-2 rounded-full bg-background/80 hover:bg-background border border-card-border text-text-primary active:scale-95 transition-all duration-200"
              >
                <X size={18} />
              </button>

              <div className="relative z-10 flex-1 flex flex-col justify-center items-center gap-6 my-6 w-full">
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif font-bold text-text-primary tracking-wide">
                    《{selectedPoem.title}》
                  </h2>
                  <p className="text-text-secondary text-xs tracking-wider uppercase opacity-70">
                    {selectedPoem.author}
                  </p>
                </div>

                <div className="w-10 h-[1.5px] bg-primary/20 rounded-full"></div>

                <div className="space-y-3.5 font-serif font-medium text-text-primary text-[16px] leading-loose tracking-widest">
                  {selectedPoem.lines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="relative z-10 w-full flex justify-center gap-1.5 opacity-60">
                {selectedPoem.tags.map(t => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-[9px] font-bold tracking-widest">{t}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      {selectedPoem && (
        <ShareModal 
          poem={selectedPoem} 
          isOpen={isShareOpen} 
          onClose={() => setIsShareOpen(false)} 
          theme={(document.documentElement.getAttribute('data-theme') || 'light') as ThemeId}
        />
      )}
    </div>
  );
};

export default Favorites;
