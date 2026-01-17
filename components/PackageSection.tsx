
import React from 'react';
import { PACKAGES } from '../constants';
import { Package } from '../types';

interface PackageSectionProps {
  onOpenPackage: (pkg: Package) => void;
}

const PackageSection: React.FC<PackageSectionProps> = ({ onOpenPackage }) => {
  const internationalPackages = PACKAGES.filter(p => p.id.startsWith('int-'));
  const domesticPackages = PACKAGES.filter(p => p.id.startsWith('dom-'));

  const renderPackageGrid = (pkgs: Package[], type: 'International' | 'Domestic') => (
    <div className="mb-20 last:mb-0">
      <div className="flex items-center space-x-4 mb-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'International' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
          {type === 'International' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          )}
        </div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">
          {type} Holiday Packages
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {pkgs.map((pkg) => (
          <div key={pkg.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full relative">
            <div className="relative h-60 overflow-hidden shrink-0">
              <img 
                src={pkg.image} 
                alt={pkg.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                {pkg.duration}
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <div className="text-[10px] text-blue-500 font-black mb-2 uppercase tracking-widest">{pkg.destination}</div>
              <h4 className="text-xl font-bold mb-6 text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[3rem]">
                {pkg.title}
              </h4>
              
              <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-tighter">Starting At</span>
                    <div className="text-2xl font-black text-slate-900">{pkg.price}</div>
                  </div>
                  <button 
                    onClick={() => onOpenPackage(pkg)}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 hover:scale-110 transition-all duration-300 text-[10px] font-black uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-1.5"
                  >
                    View Details
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Handpicked For You</span>
          <h2 className="reveal-heading text-4xl md:text-6xl font-black text-slate-900 tracking-tighter relative inline-block">
            Featured Holiday Packages
            <div className="heading-underline"></div>
          </h2>
          <p className="mt-8 text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            Explore our curated collections of the world's most breathtaking destinations.
          </p>
        </div>

        {renderPackageGrid(internationalPackages, 'International')}
        {renderPackageGrid(domesticPackages, 'Domestic')}
      </div>
    </section>
  );
};

export default PackageSection;
