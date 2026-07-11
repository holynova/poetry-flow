import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { Stats } from './pages/Stats';
import { Favorites } from './pages/Favorites';
import { AnimatePresence } from 'framer-motion';
import type { ThemeId } from './types';

const AnimatedRoutes: React.FC<{
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}> = ({ currentTheme, onThemeChange }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home currentTheme={currentTheme} onThemeChange={onThemeChange} />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('poetry-flow-theme');
    return (saved as ThemeId) || 'light';
  });

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('poetry-flow-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="w-full h-dvh bg-background text-text-primary font-sans antialiased overflow-hidden transition-colors duration-300">
        <AnimatedRoutes currentTheme={theme} onThemeChange={setTheme} />
      </div>
    </Router>
  );
};

export default App;
