import React, { useState } from 'react';

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
    <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-[100] h-20 transition-all duration-300 border-b border-gray-100 flex items-center">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* REVERTED TYPOGRAPHIC LOGO - Bold weight, Way2Go in Navy, Holidays in Blue */}
        <div 
          className="flex items-center cursor-pointer group relative py-2"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <h1 className="text-xl md:text-[33px] font-bold tracking-tight select-none transition-transform duration-300 group-hover:scale-[1.01] flex items-baseline">
            <span className="text-[#1E3A8A]">Way</span>
            <span className="text-[#1E3A8A]">2Go</span>
            <span className="text-[#1D4ED8]">Holidays</span>
          </h1>
          
          {/* Bold Animated Hover Underscore - Left to Right (Whole Logo, 4px) */}
          <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#1D4ED8] transition-all duration-500 ease-out group-hover:w-full z-10"></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-sm text-gray-700 hover:text-blue-700 font-semibold transition-all duration-200 relative group py-1"
              >
                {link.label}
                {/* Bold Underscore animation for Links - Left to Right (2px) */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1D4ED8] transition-all duration-500 ease-out group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="flex items-center border-l border-gray-200 pl-8">
            <button 
              onClick={onLogin}
              className="bg-[#1D4ED8] text-white px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:brightness-110 active:scale-95 animate-wave-out"
            >
              SIGN IN
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center">
          <button 
            className="text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-t p-6 flex flex-col space-y-3 shadow-2xl animate-in slide-in-from-top duration-300 z-50">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { link.action(); setIsMenuOpen(false); }}
              className="text-left text-base text-gray-700 hover:text-blue-700 font-bold py-3 border-b border-gray-50 last:border-0"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-4 pt-6">
            <button 
              onClick={() => { onLogin(); setIsMenuOpen(false); }}
              className="w-full bg-[#1D4ED8] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl"
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