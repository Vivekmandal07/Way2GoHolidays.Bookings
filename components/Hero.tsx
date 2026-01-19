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
    <div className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
        style={{ backgroundImage: `url('${PICS.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/80"></div>
      </div>

      <div className="relative z-10 text-center text-white px-5 max-w-5xl w-full flex flex-col items-center">
        
        {/* Refined Search Bar */}
        <div className="w-full max-w-xl mx-auto mb-8 animate-fade-in relative z-[60] pt-12 md:pt-16">
          <form 
            onSubmit={handleSearch}
            className="glass-card flex items-center p-1 rounded-full transition-all duration-300 shadow-2xl hover:scale-[1.01] focus-within:border-white focus-within:ring-2 focus-within:ring-white/10"
          >
            <div className="flex items-center pl-3 sm:pl-4 pr-1 sm:pr-2 text-white/60 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text"
              placeholder="Where to?"
              className="flex-grow min-w-0 bg-transparent border-none outline-none text-white font-medium text-xs sm:text-sm placeholder:text-white/40 py-2.5 sm:py-3"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => searchValue.trim() && setShowSuggestions(true)}
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 sm:px-8 py-2 sm:py-2.5 rounded-full transition-all text-[11px] sm:text-xs shadow-lg active:scale-95 shrink-0 whitespace-nowrap"
            >
              Go
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionRef}
              className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-5 py-3 hover:bg-blue-600 transition-colors text-white font-medium border-b border-white/5 last:border-none flex items-center space-x-3"
                >
                  <span className="text-xs md:text-sm">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Floating animated headers */}
        <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col items-center space-y-2 animate-float">
            <span className="text-blue-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">
              Premium Travel Services
            </span>
            <span className="text-orange-400 font-bold text-[9px] md:text-[11px] uppercase tracking-widest bg-orange-400/10 px-4 py-1.5 rounded-full border border-orange-400/30 backdrop-blur-sm">
              100% Free Access
            </span>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tighter leading-[1.1] sm:leading-[1]">
              Your Journey,<br/> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-cyan-300">
                Our Passion
              </span>
            </h1>
            
            <p className="text-sm md:text-xl mb-8 text-blue-50 max-w-xl mx-auto font-medium leading-relaxed opacity-80 px-2">
              Bespoke travel experiences crafted for those who seek the extraordinary. Plan your next adventure for free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-4xl mx-auto">
              <button 
                onClick={onBookNow}
                className="w-full sm:w-auto bg-[#2563EB] text-white px-10 py-4 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest"
              >
                Book Now
              </button>
              
              <button 
                onClick={onCreatePackage}
                className="w-full sm:w-auto bg-transparent text-white border-2 border-white/40 px-10 py-4 rounded-full font-bold text-sm transition-all hover:bg-white/10 hover:scale-105 active:scale-95 uppercase tracking-widest"
              >
                Create Package
              </button>

              <button 
                onClick={onContactExpert}
                className="w-full sm:w-auto bg-[#F97316] text-white px-10 py-4 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center space-x-2 uppercase tracking-widest"
              >
                <ion-icon name="headset" style={{ fontSize: '20px' }}></ion-icon>
                <span>Talk to Expert</span>
              </button>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-ken-burns {
          animation: kenburns 40s infinite alternate ease-in-out;
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;