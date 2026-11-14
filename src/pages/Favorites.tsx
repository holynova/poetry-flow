import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, LayoutGrid, List, Bookmark, Trash2, X, Share2, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePoemStats } from '../hooks/usePoemStats';
import { ShareModal } from '../components/ShareModal';
import type { Poem, ThemeId } from '../types';
import { getPoemTypography, getTopicLabel } from '../utils/poemTypography';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { getLikedPoems, removeLike, recordAction } = usePoemStats();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [recentlyRemoved, setRecentlyRemoved] = useState<Poem | null>(null);
  const undoTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
  }, []);

  const likedPoems = getLikedPoems();
  const selectedTypography = selectedPoem ? getPoemTypography(selectedPoem, 'collection') : null;
  const selectedTopic = selectedPoem ? getTopicLabel(selectedPoem) : '';

  const handleDelete = (e: React.MouseEvent, poem: Poem) => {
    e.stopPropagation();
    removeLike(poem.id);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    setRecentlyRemoved(poem);
    undoTimer.current = window.setTimeout(() => setRecentlyRemoved(null), 4200);
  };

  const handleUndoRemove = () => {
    if (!recentlyRemoved) return;
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    recordAction(recentlyRemoved.id, 'like');
    setRecentlyRemoved(null);
  };

  return (
    <div className="flex flex-col h-full bg-background text-text-primary overflow-hidden relative">
      <div className="shrink-0 pt-[max(1.2rem,env(safe-area-inset-top))] px-4 bg-background z-10 w-full max-w-lg mx-auto">
        <div className="relative flex items-center justify-center mb-6 mt-2">
          <button
            onClick={() => navigate('/')}
            className="absolute left-0 p-2 text-text-secondary hover:bg-surface/40 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold font-sans tracking-wide">我喜欢的诗</h1>
        </div>

        <div className="bg-surface/40 p-1 rounded-full flex mb-6 mx-4 border border-card-border backdrop-blur-sm">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold tracking-wider ${
              viewMode === 'list'
                ? 'bg-surface text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List size={14} />
            <span>列表</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold tracking-wider ${
              viewMode === 'grid'
                ? 'bg-surface text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <LayoutGrid size={14} />
            <span>网格</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 w-full max-w-lg mx-auto scroll-smooth">
        {likedPoems.length === 0 ? (
          <div className="text-center py-20 text-text-secondary/60 flex flex-col items-center justify-center gap-3">
            <Bookmark size={40} className="stroke-[1.2] opacity-40" />
            <div className="space-y-1">
              <p className="text-sm font-medium">还没有喜欢的诗</p>
              <p className="text-xs opacity-80">在首页向右滑动，喜欢打动你的诗</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-5 py-2 bg-primary text-background font-sans font-semibold rounded-full text-xs tracking-wider hover:opacity-90 transition-opacity"
            >
              去读诗
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {likedPoems.map((poem) => (
              <div
                key={poem.id}
                onClick={() => setSelectedPoem(poem)}
                className="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-card-border cursor-pointer relative overflow-hidden group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0 text-primary">
                  <Bookmark className="fill-current" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-serif font-bold truncate text-base tracking-wide">{poem.title}</p>
                  <p className="text-text-secondary text-xs font-sans mt-0.5">— {poem.lines[0]}...</p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, poem)}
                  className="p-2 text-text-secondary/50 hover:text-danger hover:bg-danger/10 rounded-full transition-colors duration-200 z-10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {likedPoems.map((poem) => (
              <div
                key={poem.id}
                onClick={() => setSelectedPoem(poem)}
                className="bg-surface p-4 rounded-2xl border border-card-border flex flex-col aspect-square justify-between cursor-pointer relative overflow-hidden"
              >
                <div className="flex justify-between items-center z-10 w-full">
                  <Bookmark size={16} className="text-primary fill-current" />
                  <button
                    onClick={(e) => handleDelete(e, poem)}
                    className="p-1 text-text-secondary/40 hover:text-danger rounded-full transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center text-center my-2 z-10 px-1">
                  <p className="text-text-primary font-serif font-bold text-base leading-relaxed tracking-wider">{poem.title}</p>
                </div>
                <p className="text-text-secondary text-xs tracking-wider text-center z-10 opacity-70">
                  {poem.lines.length} 行诗，{poem.tags[0]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-surface border border-card-border rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col items-stretch justify-between text-left min-h-[440px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsShareOpen(true)}
                className="absolute top-6 left-6 z-30 p-2 rounded-full bg-background/80 hover:bg-background border border-card-border text-text-primary transition-colors duration-200"
                title="分享这首诗"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => { setSelectedPoem(null); setIsShareOpen(false); }}
                className="absolute top-6 right-6 z-30 p-2 rounded-full bg-background/80 hover:bg-background border border-card-border text-text-primary transition-colors duration-200"
              >
                <X size={18} />
              </button>
              <div className="relative z-10 flex-1 flex flex-col justify-start items-start gap-5 pt-8 pb-6 w-full">
                <div className="w-full shrink-0 space-y-2 text-xs font-sans tracking-[0.1em] text-text-secondary">
                  <div className="flex items-center justify-between gap-3 opacity-75">
                    <span className="font-semibold">Poetry Flow</span>
                    {selectedTopic && <span className="max-w-[58%] whitespace-nowrap text-right">{selectedTopic}</span>}
                  </div>
                  <div aria-hidden="true" className="flex items-center gap-2 opacity-55">
                    <span className="h-px w-8 bg-primary/50" />
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    <span className="h-px flex-1 bg-card-border" />
                  </div>
                </div>
                <div className={`flex flex-col items-start ${selectedTypography?.contentGapClass ?? 'gap-5'} w-full pt-3`}>
                  <h2 style={{ fontSize: selectedTypography?.titleSize }} className="font-serif font-bold text-primary tracking-[0.08em]">{selectedPoem.title}</h2>
                  <div className="w-12 h-px bg-primary/30 rounded-full" />
                </div>
                <div style={selectedTypography?.readingStyle} className={`${selectedTypography?.bodyGapClass ?? 'space-y-2'} font-serif font-medium text-text-primary tracking-[0.025em]`}>
                  {selectedPoem.lines.map((line, idx) => <p key={idx}>{line}</p>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recentlyRemoved && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="status"
            className="absolute inset-x-0 bottom-[5.25rem] z-30 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto flex items-center gap-3 border border-card-border bg-surface/96 px-3 py-2 text-xs font-sans text-text-secondary shadow-sm">
              <span>已移出喜欢</span>
              <button
                onClick={handleUndoRemove}
                className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-text-primary"
              >
                <RotateCcw size={14} />
                撤销
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
