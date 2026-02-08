import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, darkMode, toggleTheme }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const navBtnClass = (view: ViewState) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
    currentView === view
      ? 'bg-primary/10 text-primary' 
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-dark/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentView('home')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg transform group-hover:rotate-12 transition-transform">
              N
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Nisar Creative
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-1">
              <button onClick={() => setCurrentView('home')} className={navBtnClass('home')}>
                Home
              </button>
              <button onClick={() => setCurrentView('studio')} className={navBtnClass('studio')}>
                Dev Studio
              </button>
              <button onClick={() => setCurrentView('editor')} className={navBtnClass('editor')}>
                Post Editor
              </button>
              <button onClick={() => setCurrentView('admin')} className={navBtnClass('admin')}>
                Admin
              </button>
              <a
                href="https://sites.google.com/d/1bePsY8n0K3tx5CUBxDlWpAPpkAehqtPN/p/1WlyY3H4ZtDUUcQUG05SSEcgMWHar8J9t/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-4 py-2 rounded-full text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-1 border border-purple-200 dark:border-purple-900 hover:shadow-md"
              >
                <i className="fas fa-external-link-alt text-xs text-purple-600 dark:text-purple-400"></i> 
                Portfolio
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </a>
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 transition-colors"
                >
                  <i className="fas fa-download mr-1"></i> Install App
                </button>
              )}
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {darkMode ? <i className="fas fa-sun text-yellow-400 text-lg"></i> : <i className="fas fa-moon text-indigo-600 text-lg"></i>}
            </button>
          </div>

          {/* Mobile Theme Toggle & Install */}
          <div className="md:hidden flex items-center gap-4">
             {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="p-2 rounded-full text-green-600 dark:text-green-400"
                  aria-label="Install App"
                >
                  <i className="fas fa-download"></i>
                </button>
             )}
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <i className="fas fa-sun text-yellow-400"></i> : <i className="fas fa-moon text-indigo-600"></i>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-dark/95 backdrop-blur-lg pb-safe z-50">
         <div className="flex justify-around items-center h-16">
            <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center p-2 ${currentView === 'home' ? 'text-primary' : 'text-gray-400'}`}>
              <i className="fas fa-home text-lg mb-1"></i>
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button onClick={() => setCurrentView('studio')} className={`flex flex-col items-center p-2 ${currentView === 'studio' ? 'text-primary' : 'text-gray-400'}`}>
              <i className="fas fa-code text-lg mb-1"></i>
              <span className="text-[10px] font-medium">Studio</span>
            </button>
            <button onClick={() => setCurrentView('editor')} className={`flex flex-col items-center p-2 ${currentView === 'editor' ? 'text-primary' : 'text-gray-400'}`}>
              <i className="fas fa-pen-nib text-lg mb-1"></i>
              <span className="text-[10px] font-medium">Editor</span>
            </button>
            <a href="https://sites.google.com/d/1bePsY8n0K3tx5CUBxDlWpAPpkAehqtPN/p/1WlyY3H4ZtDUUcQUG05SSEcgMWHar8J9t/edit" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-2 text-pink-500 relative">
              <i className="fas fa-globe text-lg mb-1 animate-pulse"></i>
              <span className="text-[10px] font-bold">Portfolio</span>
            </a>
            <button onClick={() => setCurrentView('admin')} className={`flex flex-col items-center p-2 ${currentView === 'admin' ? 'text-primary' : 'text-gray-400'}`}>
              <i className="fas fa-user-cog text-lg mb-1"></i>
              <span className="text-[10px] font-medium">Admin</span>
            </button>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;