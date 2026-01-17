
import React, { useState } from 'react';
import { CONTACT_DETAILS } from '../constants';

interface NavbarProps {
  scrollTo: (id: string) => void;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrollTo, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'AI Planner', action: () => scrollTo('ai-planner') },
    { label: 'Destinations', action: () => scrollTo('destinations') },
    { label: 'Packages', action: () => scrollTo('packages') },
    { label: 'Gallery', action: () => scrollTo('gallery') },
    { label: 'About Us', action: () => scrollTo('about') },
  ];

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-50 h-24 md:h-28 transition-all duration-300 border-b border-gray-100 flex items-center">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* REFINED BOLD BRAND LOGO - SOFTENED WEIGHT */}
        <div 
          className="flex items-center cursor-pointer group py-2"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex flex-col">
            <h1 className="flex items-baseline">
              <span className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none select-none drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">Way2Go</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Holidays</span>
              </span>
            </h1>
            <div className="h-1.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 rounded-full mt-1 opacity-80"></div>
          </div>
        </div>

        {/* Desktop Nav & Login Button */}
        <div className="hidden xl:flex items-center space-x-10">
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-[16px] text-gray-700 hover:text-blue-700 font-bold transition-all duration-200 relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="flex items-center border-l border-gray-200 pl-8 space-x-6">
            <button 
              onClick={onLogin}
              className="bg-blue-700 text-white px-8 py-3.5 rounded-full hover:bg-blue-800 transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 whitespace-nowrap animate-glow-pulse"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="xl:hidden flex items-center space-x-4">
          <button 
            className="text-gray-800 p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-24 left-0 w-full bg-white border-t p-6 flex flex-col space-y-4 shadow-2xl animate-in slide-in-from-top duration-300 z-50 max-h-[calc(100vh-96px)] overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { link.action(); setIsMenuOpen(false); }}
              className="text-left text-xl text-gray-700 hover:text-blue-700 font-bold py-2 border-b border-gray-50 last:border-0"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={() => { onLogin(); setIsMenuOpen(false); }}
              className="w-full bg-blue-700 text-white px-6 py-4 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-transform animate-glow-pulse"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
