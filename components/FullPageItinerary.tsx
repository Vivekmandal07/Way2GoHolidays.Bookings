
import React, { useState, useEffect, useRef } from 'react';
import { Package, ItineraryDay } from '../types';
import { CONTACT_DETAILS } from '../constants';

interface FullPageItineraryProps {
  pkg: Package;
  onBack: () => void;
}

const FullPageItinerary: React.FC<FullPageItineraryProps> = ({ pkg, onBack }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePrice, setEditablePrice] = useState(pkg.price);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [editableItinerary, setEditableItinerary] = useState<ItineraryDay[]>(
    pkg.itinerary.map(item => ({ ...item, rating: item.rating || 5 }))
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...editableItinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setEditableItinerary(newItinerary);
  };

  const handleBookNow = () => {
    let message = `*Interest in ${pkg.title}*\n`;
    message += `*Destination:* ${pkg.destination}\n`;
    message += `*Price Quote:* ${editablePrice}\n\n`;
    message += `I'm viewing this day-wise itinerary and want to proceed with booking!\n\n; *Thankyou for Connecting Way2GoHolidays!*\n; Our Destination Expert will Connect you very Shortly!`;
    window.open(`${CONTACT_DETAILS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    
    // @ts-ignore
    const html2pdf = window.html2pdf;
    
    if (html2pdf) {
      const element = contentRef.current;
      
      // Configuration to ensure full content capture
      const opt = {
        margin: [0, 0],
        filename: `Way2Go_${pkg.title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          // Crucial: ensure the capture height is calculated correctly
          height: element.scrollHeight,
          logging: false
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      try {
        await html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error("PDF Download failed:", err);
        window.print();
      }
    } else {
      window.print();
    }
    
    setIsDownloading(false);
  };

  const StarRating = ({ rating, dayIndex, editable }: { rating: number, dayIndex: number, editable: boolean }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!editable}
            onClick={() => handleUpdateDay(dayIndex, 'rating', star)}
            className={`transition-all duration-300 ${
              star <= rating ? 'text-yellow-400' : 'text-slate-200'
            } ${editable ? 'cursor-pointer hover:scale-150 hover:text-yellow-500' : 'cursor-default'}`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen pb-32 md:pb-20">
      {/* Interactive Sticky Nav */}
      <nav className="sticky top-0 left-0 right-0 z-[160] bg-white/95 backdrop-blur-xl border-b border-slate-100 h-16 md:h-24 px-4 md:px-12 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center space-x-3 md:space-x-6">
          <button 
            onClick={onBack}
            className="group p-2 md:p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-blue-600 border border-slate-200 hover:scale-125 active:scale-90"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="block cursor-default select-none transition-transform hover:scale-105">
            <h2 className="text-sm md:text-xl font-bold text-slate-900 tracking-tighter line-clamp-1 max-w-[150px] md:max-w-none group-hover:text-blue-600 transition-colors">{pkg.title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest">{pkg.duration}</span>
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">{pkg.destination}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`group flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-2xl font-bold text-[9px] md:text-[11px] uppercase tracking-widest border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${isEditMode ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 bg-white'}`}
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span className="hidden md:inline group-hover:scale-110 transition-transform">{isEditMode ? 'Finish' : 'Edit'}</span>
          </button>

          <button 
            onClick={handleBookNow}
            className="group bg-blue-600 text-white px-5 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-110 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="hidden sm:inline group-hover:scale-110 transition-transform">Book Now</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </nav>

      {/* Main Content Area focused on full capture */}
      <div ref={contentRef} id="pdf-content" className="bg-white">
        <header className="relative h-[30vh] md:h-[60vh] overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20 no-print"></div>
          <div className="absolute bottom-6 left-0 right-0 container mx-auto px-5 md:px-12">
            <div className="max-w-4xl space-y-2">
               <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg no-print animate-pulse">
                 Detailed Itinerary
               </div>
               <h1 className="text-2xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight origin-left transition-transform hover:scale-105 cursor-default">
                 {pkg.title}
               </h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-5 md:px-12 py-8 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-24">
            
            <div className="lg:col-span-8 space-y-12 md:space-y-20">
              <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                 <div className="max-w-xl">
                   <h3 className="text-2xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2 hover:text-blue-600 transition-colors cursor-default">The Experience</h3>
                   <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
                     Your curated {pkg.duration} holiday to {pkg.destination}. Every detail designed for perfection.
                   </p>
                 </div>
                 <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 w-full md:w-auto text-left md:text-right group hover:scale-110 transition-transform shadow-sm">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Package Quote</span>
                    {isEditMode ? (
                      <input 
                        value={editablePrice}
                        onChange={(e) => setEditablePrice(e.target.value)}
                        className="text-xl md:text-2xl font-bold text-black tracking-tighter bg-white border-2 border-orange-200 rounded-lg px-2 py-1 outline-none w-full md:text-right"
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl font-bold text-blue-600 tracking-tighter transition-all group-hover:text-blue-700 block">{editablePrice}</span>
                    )}
                 </div>
              </div>

              {/* Day wise details */}
              <div className="relative space-y-12 md:space-y-20">
                <div className="absolute left-6 md:left-12 top-4 bottom-4 w-0.5 bg-slate-100 no-print"></div>
                
                {editableItinerary.map((day, idx) => (
                  <div key={day.day} className="relative pl-14 md:pl-32 group break-inside-avoid">
                    <div className={`absolute left-0 top-0 w-12 h-12 md:w-24 md:h-24 bg-white border-2 text-slate-900 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-sm z-10 no-print transition-all duration-500 ${isEditMode ? 'border-orange-400 scale-105 shadow-md' : 'border-slate-100 group-hover:border-blue-500 group-hover:scale-110 group-hover:shadow-lg'}`}>
                      <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">Day</span>
                      <span className="text-xl md:text-5xl font-bold tracking-tighter leading-none">{day.day}</span>
                    </div>
                    
                    <div className="space-y-4">
                      {isEditMode ? (
                        <input 
                          value={day.title}
                          onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                          className="text-lg md:text-4xl font-bold text-black tracking-tight leading-tight w-full bg-orange-50 border-b-2 border-orange-400 outline-none p-2 rounded-t-lg"
                        />
                      ) : (
                        <h4 className="text-lg md:text-4xl font-bold text-slate-900 tracking-tight leading-tight pt-2 transition-all group-hover:text-blue-600 group-hover:translate-x-2 cursor-default">
                          {day.title}
                        </h4>
                      )}
                      
                      <div className={`p-5 md:p-12 rounded-3xl md:rounded-[2.5rem] border transition-all duration-500 ${isEditMode ? 'bg-orange-50/20 border-orange-200' : 'bg-white border-slate-100 group-hover:border-blue-100 group-hover:shadow-2xl group-hover:shadow-blue-50/50'}`}>
                        {isEditMode ? (
                          <textarea 
                            value={day.activities}
                            rows={3}
                            onChange={(e) => handleUpdateDay(idx, 'activities', e.target.value)}
                            className="w-full text-base md:text-xl text-black leading-relaxed font-bold mb-6 bg-white border-2 border-orange-100 rounded-xl p-4 outline-none resize-none"
                          />
                        ) : (
                          <p className="text-sm md:text-xl text-slate-600 leading-relaxed font-medium mb-6">
                            {day.activities}
                          </p>
                        )}
                        
                        {day.hotel !== 'N/A' && (
                          <div className={`flex items-center p-4 md:p-6 rounded-2xl md:rounded-3xl border gap-4 md:gap-6 transition-all duration-300 ${isEditMode ? 'bg-white border-orange-200' : 'bg-slate-50 border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100'}`}>
                            <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 no-print shadow-lg transition-transform group-hover:scale-110">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 md:gap-4 mb-1">
                                <span className="text-[8px] md:text-[10px] font-bold text-blue-500 uppercase tracking-widest no-print">Accommodation</span>
                                <StarRating rating={day.rating || 5} dayIndex={idx} editable={isEditMode} />
                              </div>
                              {isEditMode ? (
                                <input 
                                  value={day.hotel}
                                  onChange={(e) => handleUpdateDay(idx, 'hotel', e.target.value)}
                                  className="w-full font-bold text-black text-sm md:text-xl outline-none border-b border-orange-100 bg-white"
                                />
                              ) : (
                                <span className="text-sm md:text-xl font-bold text-slate-900 block truncate transition-all group-hover:text-blue-700">{day.hotel}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 no-print">
              <div className="fixed bottom-6 left-5 right-5 z-[180] lg:static lg:block space-y-6">
                <div className="bg-slate-950 text-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden flex lg:flex-col items-center justify-between gap-4 border border-white/5">
                  <div className="hidden lg:block w-full">
                    <h5 className="text-3xl font-bold mb-10 tracking-tighter text-center lg:text-left">Plan Actions</h5>
                  </div>
                  
                  <div className="flex lg:flex-col gap-4 w-full">
                    <button 
                      onClick={handleBookNow}
                      className="group flex-1 bg-blue-600 text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-bold text-[10px] md:text-lg uppercase tracking-widest hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-900/40 flex items-center justify-center hover:scale-105 active:scale-95"
                    >
                      <span className="group-hover:scale-110 transition-transform">Confirm Booking</span>
                    </button>
                    <button 
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className={`group flex-1 bg-white/5 text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-bold text-[10px] md:text-sm uppercase tracking-widest hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isDownloading ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-5 h-5 transition-transform group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      )}
                      <span className="group-hover:scale-110 transition-transform">{isDownloading ? 'Saving...' : 'Download PDF'}</span>
                    </button>
                  </div>

                  <div className="hidden lg:block mt-12 pt-10 border-t border-white/10 space-y-6 w-full">
                    <div className="flex justify-between items-center group cursor-default">
                      <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Duration</span>
                      <span className="font-bold text-xl transition-all group-hover:text-blue-400 group-hover:scale-125">{pkg.duration}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-default">
                      <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Quote</span>
                      <span className="font-bold text-3xl text-blue-400 transition-all group-hover:text-blue-300 group-hover:scale-110">{editablePrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #pdf-content { width: 100% !important; padding: 0 !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default FullPageItinerary;
