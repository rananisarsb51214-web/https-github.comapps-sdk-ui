import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ContactLinks from './components/ContactLinks';
import PostCreator from './components/PostCreator';
import LinkManager from './components/LinkManager';
import DevStudio from './components/DevStudio';
import { ViewState, SocialLink } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [customLinks, setCustomLinks] = useState<SocialLink[]>([]);

  // Check system preference on load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const addLink = (link: SocialLink) => {
    setCustomLinks([...customLinks, link]);
  };

  const removeLink = (id: string) => {
    setCustomLinks(customLinks.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark transition-colors duration-300 font-sans overflow-x-hidden">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white dark:bg-dark pt-20 pb-24 lg:pt-32 lg:pb-36">
               <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 animate-float">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                  <span className="block">Fully Functional</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-x">Creative Hub & Tools</span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 md:mt-8 md:text-2xl md:max-w-3xl leading-relaxed">
                  A unique space for your digital presence. Manage links, create border-free content, and showcase your portfolio with AI-powered tools.
                </p>
                
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
                  <a 
                    href="https://sites.google.com/d/1bePsY8n0K3tx5CUBxDlWpAPpkAehqtPN/p/1WlyY3H4ZtDUUcQUG05SSEcgMWHar8J9t/edit" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-[150%] group-hover:animate-shine"></div>
                    <i className="fas fa-globe mr-2"></i> View My Portfolio
                  </a>
                  
                  <button 
                    onClick={() => setCurrentView('studio')} 
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-primary text-lg font-bold rounded-full text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <i className="fas fa-code mr-2"></i> Open Studio
                  </button>
                  
                  <button 
                    onClick={() => setCurrentView('admin')} 
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-700 text-lg font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-md"
                  >
                    Manage Links
                  </button>
                </div>
              </div>
            </div>

            <ContactLinks extraLinks={customLinks} />

            <div className="max-w-7xl mx-auto px-4 py-16">
               <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-6 md:p-16 text-white shadow-2xl relative overflow-hidden group transform transition-all hover:scale-[1.01]">
                 <div className="relative z-10">
                   <h2 className="text-3xl md:text-4xl font-bold mb-6">Responsive Social Media Templates</h2>
                   <p className="mb-8 opacity-90 max-w-2xl text-lg md:text-xl leading-relaxed">
                     Use our AI-powered enhanced editing tool to create border-free, aesthetically pleasing posts for Instagram, Twitter, and LinkedIn.
                   </p>
                   <button onClick={() => setCurrentView('editor')} className="bg-white text-purple-600 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
                     Create Now <i className="fas fa-magic"></i>
                   </button>
                 </div>
                 <div className="absolute -right-12 -top-12 h-80 w-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500 animate-pulse"></div>
                 <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
               </div>
            </div>
          </div>
        )}

        {currentView === 'studio' && (
          <div className="animate-fade-in h-[calc(100vh-64px)] overflow-hidden">
             <DevStudio />
          </div>
        )}

        {currentView === 'editor' && (
          <div className="py-12 animate-fade-in">
             <div className="max-w-7xl mx-auto px-4 text-center mb-10">
               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Content Creation Studio</h1>
               <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">Design unique, border-free cards with AI assistance.</p>
             </div>
             <PostCreator />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="py-12 animate-fade-in">
             <div className="max-w-7xl mx-auto px-4 text-center mb-10">
               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Administration</h1>
               <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">Manage your product codes, links, and settings.</p>
             </div>
             <LinkManager links={customLinks} addLink={addLink} removeLink={removeLink} />
          </div>
        )}
      </main>

      {/* Footer only for non-studio views since Studio has its own footer */}
      {currentView !== 'studio' && (
        <footer className="bg-white dark:bg-card border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-base text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              &copy; 2024 Nisar Creative Hub. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a href="https://github.com/rana51214/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors transform hover:scale-110">
                <i className="fab fa-github text-2xl"></i>
              </a>
              <a href="https://wa.me/message/3A7MFOQTRE2ZL1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors transform hover:scale-110">
                <i className="fab fa-whatsapp text-2xl"></i>
              </a>
              <a href="mailto:rananisar943@gmail.com" className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110">
                <i className="fas fa-envelope text-2xl"></i>
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;