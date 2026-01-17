
import React, { useState, useEffect } from 'react';
import { Package, ItineraryDay } from '../types';
import { CONTACT_DETAILS } from '../constants';

interface FullPageItineraryProps {
  pkg: Package;
  onBack: () => void;
}

const FullPageItinerary: React.FC<FullPageItineraryProps> = ({ pkg, onBack }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePrice, setEditablePrice] = useState(pkg.price);
  const [editableItinerary, setEditableItinerary] = useState<ItineraryDay[]>(
    pkg.itinerary.map(item => ({ ...item, rating: item.rating || 5 }))
  );

  useEffect(() => {
    // Lock body scroll when full-screen popup is open
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
    message += `I'm viewing the full-screen itinerary and want to proceed with booking!`;
    window.open(`${CONTACT_DETAILS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* STICKY HEADER ACTIONS - OPTIMIZED FOR MOBILE */}
      <nav className="sticky top-0 left-0 right-0 z-[160] bg-white/95 backdrop-blur-xl border-b border-slate-100 h-16 md:h-24 px-4 md:px-12 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center space-x-3 md:space-x-6">
          <button 
            onClick={onBack}
            className="group p-2 md:p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-blue-600 border border-slate-200 active:scale-110 active:bg-blue-50"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="hidden sm:block overflow-hidden">
            <h2 className="text-sm md:text-xl font-black text-slate-900 tracking-tighter truncate max-w-[150px] lg:max-w-none">{pkg.title}</h2>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest">{pkg.duration}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{pkg.destination}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`group flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest border-2 transition-all duration-300 active:scale-110 ${isEditMode ? 'bg-orange-500 border-orange-500 text-white shadow-lg active:bg-orange-600' : 'border-slate-100 text-slate-500 hover:border-blue-500 hover:text-blue-600 bg-white active:bg-blue-50 active:border-blue-400'}`}
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span className="hidden md:inline">{isEditMode ? 'Save' : 'Edit'}</span>
          </button>

          <button 
            onClick={handleDownloadPDF}
            className="group flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl border-2 border-slate-100 text-slate-500 hover:border-slate-900 hover:text-slate-900 font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all duration-300 bg-white active:scale-110 active:bg-slate-900 active:text-white active:border-slate-900 shadow-sm active:shadow-xl"
          >
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="hidden md:inline">PDF</span>
          </button>

          <button 
            onClick={handleBookNow}
            className="group bg-blue-600 text-white px-4 md:px-8 py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 active:scale-110 active:bg-blue-800 active:shadow-blue-200"
          >
            <span>Book</span>
            <svg className="w-3.5 h-3.5 hidden md:block transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </nav>

      {/* BANNER */}
      <header className="relative h-[30vh] md:h-[60vh] overflow-hidden print:h-48 print:static">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20 print:hidden"></div>
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 container mx-auto px-4 md:px-12 print:static print:p-6">
          <div className="max-w-4xl space-y-2 md:space-y-3">
             <div className="inline-block bg-blue-600 text-white px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg no-print">
               Detailed Itinerary
             </div>
             <h1 className="text-2xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight print:text-3xl">
               {pkg.title}
             </h1>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="container mx-auto px-4 md:px-12 py-8 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-24">
          
          <div className="lg:col-span-8 space-y-12 md:space-y-20 print:lg:col-span-12 print:space-y-10">
            {/* INTRO */}
            <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
               <div className="max-w-xl">
                 <h3 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-2 md:mb-4">Day-by-Day Journey</h3>
                 <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
                   Your curated {pkg.duration} holiday to {pkg.destination}.
                 </p>
               </div>
               <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 print:bg-white w-full md:w-auto text-left md:text-right">
                  <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Current Quotation</span>
                  {isEditMode ? (
                    <input 
                      value={editablePrice}
                      onChange={(e) => setEditablePrice(e.target.value)}
                      className="text-xl md:text-2xl font-black text-orange-600 tracking-tighter bg-white border-2 border-orange-200 rounded-lg px-2 py-1 outline-none focus:border-orange-500 w-full md:text-right"
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl font-black text-blue-600 tracking-tighter">{editablePrice}</span>
                  )}
               </div>
            </div>

            {/* TIMELINE - OPTIMIZED PADDING */}
            <div className="relative space-y-12 md:space-y-20 print:space-y-8">
              <div className="absolute left-6 md:left-12 top-4 bottom-4 w-0.5 bg-slate-100 no-print"></div>
              
              {editableItinerary.map((day, idx) => (
                <div key={day.day} className="relative pl-14 md:pl-32 group print:pl-0">
                  <div className={`absolute left-0 top-0 w-12 h-12 md:w-24 md:h-24 bg-white border-2 text-slate-900 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-sm z-10 no-print transition-all duration-300 ${isEditMode ? 'border-orange-400 scale-105' : 'border-slate-100 group-hover:border-blue-600 group-hover:text-blue-600'}`}>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Day</span>
                    <span className="text-xl md:text-5xl font-black tracking-tighter">{day.day}</span>
                  </div>
                  
                  <div className="space-y-4 md:space-y-6 print:space-y-2">
                    <div className="hidden print:block font-black text-blue-700 text-lg mb-1">DAY {day.day}</div>
                    
                    {isEditMode ? (
                      <input 
                        value={day.title}
                        onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                        className="text-xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight w-full bg-orange-50 border-b-2 border-orange-400 outline-none p-2 rounded-t-lg focus:bg-orange-100/50 transition-colors"
                      />
                    ) : (
                      <h4 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight print:text-xl">
                        {day.title}
                      </h4>
                    )}
                    
                    <div className={`p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 print:p-0 print:border-none ${isEditMode ? 'bg-orange-50/20 border-orange-200' : 'bg-white border-slate-100'}`}>
                      {isEditMode ? (
                        <textarea 
                          value={day.activities}
                          rows={4}
                          onChange={(e) => handleUpdateDay(idx, 'activities', e.target.value)}
                          className="w-full text-base md:text-xl text-slate-700 leading-relaxed font-medium mb-6 md:mb-8 bg-white border-2 border-orange-100 rounded-2xl p-4 md:p-6 outline-none focus:border-orange-500 resize-none transition-all"
                        />
                      ) : (
                        <p className="text-base md:text-xl text-slate-600 leading-relaxed font-medium mb-6 md:mb-8 print:text-sm">
                          {day.activities}
                        </p>
                      )}
                      
                      {day.hotel !== 'N/A' && (
                        <div className={`flex items-center p-4 md:p-6 rounded-2xl md:rounded-3xl border gap-4 md:gap-6 print:p-3 print:rounded-xl transition-all duration-300 ${isEditMode ? 'bg-white border-orange-200 shadow-sm shadow-orange-50' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'}`}>
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 no-print transition-transform group-hover:scale-105">
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-start gap-4 mb-1">
                                <span className="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest no-print leading-none">Accommodation</span>
                                <div className="flex gap-0.5 md:gap-1 no-print">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => handleUpdateDay(idx, 'rating', star)}
                                      className={`transition-all duration-300 active:scale-125 ${star <= (day.rating || 5) ? 'text-yellow-400' : 'text-slate-200'}`}
                                    >
                                      <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </button>
                                  ))}
                                </div>
                            </div>
                            {isEditMode ? (
                              <input 
                                value={day.hotel}
                                onChange={(e) => handleUpdateDay(idx, 'hotel', e.target.value)}
                                className="w-full font-bold text-slate-900 text-sm md:text-xl outline-none border-b-2 border-orange-100 focus:border-orange-500 bg-white p-1 rounded-t-lg transition-all"
                              />
                            ) : (
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-sm md:text-xl font-bold text-slate-900 block truncate">🏨 {day.hotel}</span>
                              </div>
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

          {/* SIDEBAR - STICKY FOR DESKTOP, FLOW FOR MOBILE */}
          <aside className="lg:col-span-4 no-print">
            <div className="sticky top-24 space-y-6 md:space-y-8">
              <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-blue-900/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <h5 className="text-xl md:text-2xl font-black mb-6 md:mb-8 tracking-tighter">Plan Actions</h5>
                
                <div className="space-y-3 md:space-y-4">
                  <button 
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-base md:text-lg uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-110 active:bg-blue-400 active:shadow-2xl shadow-lg"
                  >
                    Confirm Booking
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="w-full bg-white/10 text-white py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-white/20 border border-white/10 transition-all active:scale-110 active:bg-white active:text-slate-900"
                  >
                    Download as PDF
                  </button>
                </div>

                <div className="mt-8 md:mt-12 pt-6 md:pt-10 border-t border-white/10 space-y-4 md:space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Duration</span>
                    <span className="font-black text-base md:text-lg">{pkg.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Total Price</span>
                    <span className="font-black text-xl md:text-2xl text-blue-400 transition-colors duration-300 group-hover:text-blue-300">{editablePrice}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm text-center hover:shadow-lg transition-all duration-300">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6">Support & Assistance</p>
                <a 
                  href={CONTACT_DETAILS.whatsapp}
                  className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-5 py-2.5 rounded-full font-bold text-xs md:text-sm hover:bg-green-100 transition-all active:scale-110 active:bg-green-600 active:text-white"
                >
                  <ion-icon name="logo-whatsapp"></ion-icon>
                  <span>Chat with Designer</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER BRANDING FOR PRINT */}
      <div className="hidden print:block mt-20 pt-10 border-t-2 border-slate-900 text-center">
         <h2 className="text-3xl font-black text-blue-700 mb-2">Way2GoHolidays</h2>
         <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">Your Journey, Our Passion</p>
         <p className="mt-4 text-xs font-bold text-slate-600">+91 7303402841 | way2goholidays.bookings@gmail.com</p>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          main { padding: 0 !important; }
          header { height: auto !important; margin-bottom: 2rem; }
          @page { margin: 2cm; }
        }
      `}</style>
    </div>
  );
};

export default FullPageItinerary;
