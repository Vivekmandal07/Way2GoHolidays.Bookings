
import React, { useEffect, useRef } from 'react';
import { GALLERY_IMAGES } from '../constants';

const GallerySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('.reveal-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Community</span>
          <h2 className="reveal-heading text-4xl md:text-6xl font-black text-slate-900 tracking-tighter relative inline-block">
            Happy Travelers
            <div className="heading-underline"></div>
          </h2>
          <p className="mt-8 text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            Explore real moments shared by our global traveler family. Your journey could be next!
          </p>
        </div>

        {/* Dynamic Staggered Gallery Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {GALLERY_IMAGES.map((img, i) => (
            <div 
              key={i} 
              className="reveal-item group relative break-inside-avoid rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer border border-slate-100 opacity-0 transform translate-y-16"
              style={{ transitionDelay: `${(i % 4) * 150}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={img.url} 
                  alt={`Happy Traveler ${img.tag}`} 
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                  loading="lazy"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-6 left-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                  <span className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-700 shadow-xl border border-blue-50">
                    {img.tag}
                  </span>
                </div>

                {/* Rich Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                   <div className="flex items-center gap-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                         <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-black text-xs uppercase tracking-[0.2em] drop-shadow-md">Verified Traveler</span>
                        <span className="text-blue-200 text-[10px] font-bold">@way2goholidays</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats Bar */}
        <div className="mt-28 pt-20 border-t border-slate-100 flex flex-wrap items-center justify-center gap-12 md:gap-32">
           <div className="flex flex-col items-center text-center space-y-2 group">
              <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform duration-500">5k+</span>
              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] opacity-60">Trips Completed</span>
           </div>
           <div className="flex flex-col items-center text-center space-y-2 group">
              <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform duration-500">4.9</span>
              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] opacity-60">Avg Traveler Rating</span>
           </div>
           <div className="flex flex-col items-center text-center space-y-2 group">
              <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform duration-500">24/7</span>
              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] opacity-60">Guest Concierge</span>
           </div>
        </div>
      </div>

      <style>{`
        .reveal-item.reveal-active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .reveal-item {
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
  );
};

export default GallerySection;
