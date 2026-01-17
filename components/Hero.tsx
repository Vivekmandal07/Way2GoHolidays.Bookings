
import React, { useState, useEffect, useRef } from 'react';
import { INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS, PACKAGES } from '../constants';
import { PICS } from '../assets/images';
import '../types';

interface HeroProps {
  onBookNow: () => void;
  onCreatePackage: () => void;
  onContactExpert: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow, onCreatePackage, onContactExpert }) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const allSearchTerms = Array.from(new Set([
    ...INTERNATIONAL_DESTINATIONS.map(d => d.name),
    ...DOMESTIC_DESTINATIONS.map(d => d.name),
    ...PACKAGES.map(p => p.destination),
    ...PACKAGES.map(p => p.title)
  ])).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      const filtered = allSearchTerms.filter(term => 
        term.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const el = document.getElementById('packages');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (term: string) => {
    setSearchValue(term);
    setShowSuggestions(false);
    setTimeout(() => {
        const el = document.getElementById('packages');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-[850px] md:min-h-[1000px] flex flex-col items-center justify-start overflow-hidden pt-0">
      <div 
        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
        style={{ backgroundImage: `url('${PICS.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/60 to-slate-950/95"></div>
      </div>

      <div className="relative z-10 text-center text-white px-5 max-w-6xl w-full flex flex-col items-center pt-8 md:pt-12">
        {/* Search Bar optimized for mobile with new light focus and zoom */}
        <div className="w-full max-w-2xl mx-auto mb-10 md:mb-12 animate-fade-in relative z-[60]" style={{ animationDelay: '0.1s' }}>
          <form 
            onSubmit={handleSearch}
            className="glass-card search-focus flex items-center p-1 md:p-1.5 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 group shadow-2xl hover:scale-[1.02]"
          >
            <div className="flex items-center pl-4 md:pl-6 pr-2 md:pr-4 text-blue-300 transition-transform group-focus-within:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text"
              placeholder="Where to?"
              className="flex-grow bg-transparent border-none outline-none text-white font-semibold text-base md:text-lg placeholder:text-blue-100/40 py-3 md:py-3.5 focus:placeholder:text-blue-100/60"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => searchValue.trim() && setShowSuggestions(true)}
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 md:px-8 py-3 md:py-3.5 rounded-full transition-all hover:scale-110 active:scale-90 shadow-lg group/go-btn flex items-center gap-2"
            >
              <span className="group-hover/go-btn:scale-110 transition-transform">Go</span>
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionRef}
              className="absolute left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden z-[100] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-6 py-4 hover:bg-blue-600/30 transition-colors text-white font-semibold border-b border-white/5 last:border-none flex items-center space-x-3"
                >
                  <span className="text-blue-400 text-sm">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  <span className="text-sm md:text-base group-hover:scale-105 transition-transform origin-left">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4 md:mb-6 animate-floating">
          <div className="inline-flex flex-col items-center space-y-2">
            <span className="text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] drop-shadow-lg select-none">
              Premium Travel Services
            </span>
            <span className="text-orange-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
              100% Free Access
            </span>
          </div>
        </div>

        <div className="animate-fade-in pt-0" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-tighter leading-[1] sm:leading-[0.85]">
              Your Journey,<br/> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-cyan-300">
                Our Passion
              </span>
            </h1>
            
            <p className="text-base md:text-2xl mb-10 md:mb-12 text-blue-50 drop-shadow-md max-w-2xl mx-auto font-medium leading-relaxed opacity-90 px-2">
              Bespoke travel experiences crafted for those who seek the extraordinary. Plan your next adventure for free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-5xl mx-auto pb-10">
              {/* BOOK NOW - Solid Blue Pill */}
              <button 
                onClick={onBookNow}
                className="group relative w-full sm:w-auto bg-[#2563EB] text-white px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-lg md:text-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl flex items-center justify-center overflow-hidden outline-none"
              >
                <span className="relative z-10 uppercase tracking-widest transition-transform duration-300 group-hover:scale-110">Book Now</span>
              </button>
              
              {/* CREATE PACKAGE - Ghost/Outline Pill */}
              <button 
                onClick={onCreatePackage}
                className="group relative w-full sm:w-auto bg-white/5 backdrop-blur-md text-white border-2 border-white/40 px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-lg md:text-xl transition-all duration-300 hover:bg-white/10 hover:scale-110 active:scale-95 flex items-center justify-center overflow-hidden outline-none"
              >
                <span className="relative z-10 uppercase tracking-widest transition-transform duration-300 group-hover:scale-110">Create Package</span>
              </button>

              {/* TALK TO EXPERT - Solid Orange Pill with Headset */}
              <button 
                onClick={onContactExpert}
                className="group relative w-full sm:w-auto bg-[#F97316] text-white px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-lg md:text-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl flex items-center justify-center space-x-3 overflow-hidden outline-none"
              >
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                  <ion-icon name="headset" style={{ fontSize: '28px' }}></ion-icon>
                </div>
                <span className="relative z-10 uppercase tracking-widest transition-transform duration-300 group-hover:scale-110">Talk to Expert</span>
              </button>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-ken-burns {
          animation: kenburns 30s infinite alternate ease-in-out;
        }
        .animate-floating {
          animation: floating 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Hero;
