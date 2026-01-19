
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
    <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-[100] h-20 md:h-20 transition-all duration-300 border-b border-gray-100 flex items-center overflow-hidden">
      <div className="container mx-auto px-5 h-full flex items-center justify-between max-w-full">
        {/* BRAND LOGO */}
        <div 
          className="flex items-center cursor-pointer group py-2 mr-16"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex flex-col">
            <h1 className="flex items-baseline">
              <span className="text-xl md:text-3xl font-extrabold tracking-tight leading-none select-none drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">Way2Go</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Holidays</span>
              </span>
            </h1>
            <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 rounded-full mt-0.5 opacity-80"></div>
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
              className="bg-[#1148CB] text-white px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:brightness-110 active:scale-95 animate-wave-out"
            >
              SIGN IN
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
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-white border-t p-6 flex flex-col space-y-3 shadow-2xl animate-in slide-in-from-top duration-300 z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { link.action(); setIsMenuOpen(false); }}
              className="text-left text-lg text-gray-700 hover:text-blue-700 font-bold py-3 border-b border-gray-50 last:border-0"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-4 pt-6 border-t border-gray-100">
            <button 
              onClick={() => { onLogin(); setIsMenuOpen(false); }}
              className="w-full bg-[#1148CB] text-white py-5 rounded-full font-black text-xl uppercase tracking-[0.2em] shadow-xl animate-wave-out flex items-center justify-center"
            >
              SIGN IN
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
