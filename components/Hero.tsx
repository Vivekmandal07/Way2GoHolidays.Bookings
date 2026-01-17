
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
    <div className="relative min-h-[700px] md:min-h-[900px] flex flex-col items-center justify-start overflow-hidden pt-0">
      <div 
        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
        style={{ backgroundImage: `url('${PICS.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/90"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-6xl w-full flex flex-col items-center">
        {/* Search Bar Container */}
        <div className="w-full max-w-2xl mx-auto mt-6 md:mt-2 mb-10 md:mb-16 px-2 animate-fade-in relative z-[60]">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <input 
              type="text"
              placeholder="Search destinations or packages..."
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-5 md:py-6 rounded-full text-lg md:text-xl outline-none focus:bg-white focus:text-slate-900 transition-all shadow-2xl placeholder:text-white/60 focus:placeholder:text-slate-400 font-medium"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 md:p-4 rounded-full hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionRef}
                className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-[70] animate-in slide-in-from-top-4 duration-300"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-8 py-4 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-4 group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="text-slate-700 font-bold">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Hero Content Section */}
        <div className="mt-8 md:mt-16 animate-fade-in-up">
          <span className="inline-block bg-blue-600/30 backdrop-blur-md px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 border border-blue-400/30">
            Adventure Awaits
          </span>
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
            Let's Make Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Dream Trip</span> Real
          </h2>
          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Experience world-class luxury and seamless travel planning with Delhi's premier holiday designers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onBookNow}
              className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-3"
            >
              <ion-icon name="calendar-outline"></ion-icon>
              Book Now
            </button>
            <button 
              onClick={onCreatePackage}
              className="w-full sm:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <ion-icon name="color-palette-outline"></ion-icon>
              Custom Plan
            </button>
            <button 
              onClick={onContactExpert}
              className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ion-icon name="headset-outline"></ion-icon>
              Expert Help
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl border-t border-white/10 pt-12 opacity-60">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black">50+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Destinations</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black">12k+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Happy Guests</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black">4.9/5</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">User Rating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black">24/7</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Exporting the Hero component as default to resolve the import error in App.tsx
export default Hero;
