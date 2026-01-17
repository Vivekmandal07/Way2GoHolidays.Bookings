
import React from 'react';
import { Destination } from '../types';

interface DestinationsSectionProps {
  title: string;
  destinations: Destination[];
  onExplore: (destinationName: string) => void;
}

const DestinationsSection: React.FC<DestinationsSectionProps> = ({ title, destinations, onExplore }) => {
  const category = title.toLowerCase().includes('international') ? 'International' : 'Domestic';

  const handleViewAll = () => {
    const el = document.getElementById('packages');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-white first:pt-24 last:pb-16">
      <div className="container mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="reveal-heading text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter relative inline-block">
            {title}
            <div className="heading-underline"></div>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {destinations.map((dest) => (
            <div 
              key={dest.id} 
              className="group bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                   <div className="bg-blue-600/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1 inline-block">
                     Featured
                   </div>
                   <h3 className="text-2xl font-bold text-white tracking-tight transition-transform hover:scale-105 origin-left">{dest.name}</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-500 font-medium mb-6 line-clamp-2 leading-relaxed">{dest.description}</p>
                <button 
                  onClick={() => onExplore(dest.name)}
                  className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:scale-105 active:scale-95 group/btn shadow-sm"
                >
                  <span className="transition-transform duration-300 group-hover/btn:scale-110">Explore Plan</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button 
            onClick={handleViewAll}
            className="group relative w-full sm:w-auto px-12 py-5 bg-white border-2 border-blue-600 text-blue-700 rounded-[2rem] font-bold text-sm uppercase tracking-widest transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 shadow-xl shadow-blue-100/50"
          >
            <span className="transition-transform duration-300 group-hover:scale-110">Explore All {category} Destinations</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-4 h-4 transform group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
