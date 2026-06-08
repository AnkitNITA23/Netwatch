import React from 'react';
import Navbar from '../components/Navbar';

export const MainLayout = ({ children, theme, onThemeToggle }) => {
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <Navbar theme={theme} onThemeToggle={onThemeToggle} />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
