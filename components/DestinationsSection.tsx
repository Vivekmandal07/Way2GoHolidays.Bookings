
import React from 'react';
import { Destination } from '../types';

interface DestinationsSectionProps {
  title: string;
  destinations: Destination[];
  onExplore: (destinationName: string) => void;
}

const DestinationsSection: React.FC<DestinationsSectionProps> = ({ title, destinations, onExplore }) => {
  return (
    <section className="py-20 bg-white first:pt-24 last:pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="reveal-heading text-4xl font-bold relative inline-block">
            {title}
            <div className="heading-underline"></div>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest) => (
            <div 
              key={dest.id} 
              className="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{dest.name}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6 line-clamp-2">{dest.description}</p>
                <button 
                  onClick={() => onExplore(dest.name)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 flex items-center gap-2"
                >
                  Explore Details
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
