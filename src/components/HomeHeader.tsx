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
  const toolbarButtonClass = 'flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-surface/40';

  const toggleTheme = () => {
    onThemeChange(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="flex items-center justify-end px-6 pb-4 pt-[max(1.2rem,env(safe-area-inset-top))] shrink-0 z-20 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-1">
        {/* Profile/Stats link */}
        <button
          onClick={() => navigate('/stats')}
          className={toolbarButtonClass}
          title="我的足迹"
          aria-label="我的足迹"
        >
          <User size={22} />
        </button>

        <a
          href="https://github.com/holynova/poetry-flow"
          target="_blank"
          rel="noopener noreferrer"
          className={toolbarButtonClass}
          title="GitHub 仓库"
          aria-label="GitHub 仓库"
        >
          <Github size={22} />
        </a>

        <button
          onClick={toggleTheme}
          className={toolbarButtonClass}
          title={currentTheme === 'light' ? '切换至夜幕模式' : '切换至日光模式'}
          aria-label={currentTheme === 'light' ? '切换至夜幕模式' : '切换至日光模式'}
        >
          {currentTheme === 'light' ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <button
          onClick={() => navigate('/favorites')}
          className={toolbarButtonClass}
          aria-label="我的喜欢"
        >
          <Heart size={22} className="fill-current" />
        </button>
      </div>
    </header>
  );
};
export default HomeHeader;
