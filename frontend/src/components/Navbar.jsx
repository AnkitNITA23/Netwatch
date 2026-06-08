import React, { useState } from 'react';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { MdNetworkCheck } from 'react-icons/md';

export const Navbar = ({ theme, onThemeToggle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg border-b border-neon-blue/20 backdrop-blur-lg z-50 shadow-lg shadow-neon-blue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple">
              <MdNetworkCheck className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                NetWatch
              </h1>
              <p className="text-xs text-gray-400">Network Operations Center</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm text-gray-300">
              Real-time Network Monitoring
            </span>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false 
                })}
              </div>
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-lg bg-dark-surface-light/50 hover:bg-dark-surface-light transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <FiSun className="text-neon-blue" size={18} />
                ) : (
                  <FiMoon className="text-neon-purple" size={18} />
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-success font-semibold">Online</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg bg-dark-surface-light/50 hover:bg-dark-surface-light transition-colors duration-200"
            >
              {theme === 'dark' ? (
                <FiSun className="text-neon-blue" size={18} />
              ) : (
                <FiMoon className="text-neon-purple" size={18} />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-surface-light/50 hover:bg-dark-surface-light transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <FiX className="text-neon-blue" size={20} />
              ) : (
                <FiMenu className="text-neon-blue" size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-neon-blue/20 mt-4">
            <div className="text-sm text-gray-300 py-2">
              Real-time Network Monitoring
            </div>
            <div className="text-sm text-gray-400 py-2">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit' 
              })}
            </div>
            <div className="flex items-center gap-2 py-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success font-semibold">Online</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
