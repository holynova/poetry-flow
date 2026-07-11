import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Sun, Moon, Github } from 'lucide-react';
import type { ThemeId } from '../types';

interface HomeHeaderProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ currentTheme, onThemeChange }) => {
  const navigate = useNavigate();

  const toggleTheme = () => {
    onThemeChange(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="flex items-center justify-between px-6 pb-4 pt-[max(1.2rem,env(safe-area-inset-top))] shrink-0 z-20 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-1">
        {/* Profile/Stats link */}
        <button 
          onClick={() => navigate('/stats')} 
          className="p-2.5 rounded-full hover:bg-surface/40 text-text-secondary active:scale-95 transition-all duration-200"
          title="我的足迹"
        >
          <User size={22} />
        </button>

        {/* GitHub Repo link */}
        <a 
          href="https://github.com/holynova/poetry-flow"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full hover:bg-surface/40 text-text-secondary active:scale-95 transition-all duration-200"
          title="GitHub 仓库"
        >
          <Github size={22} />
        </a>
      </div>

      {/* Modern Day/Night Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-full hover:bg-surface/40 text-text-secondary active:scale-95 transition-all duration-200 border border-card-border shadow-sm bg-surface/25 backdrop-blur-sm"
        title={currentTheme === 'light' ? '切换至夜幕模式' : '切换至日光模式'}
      >
        {currentTheme === 'light' ? (
          <Sun size={20} className="text-amber-500 animate-pulse" />
        ) : (
          <Moon size={20} className="text-teal-400" />
        )}
      </button>

      {/* Favorites link */}
      <button 
        onClick={() => navigate('/favorites')}
        className="p-2.5 rounded-full hover:bg-surface/40 text-primary active:scale-95 transition-all duration-200"
      >
        <Heart size={22} className="fill-current" />
      </button>
    </header>
  );
};
export default HomeHeader;
