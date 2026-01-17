
import React, { useState } from 'react';
import { Package, ItineraryDay } from '../types';

interface PackageDetailsModalProps {
  pkg: Package;
  onClose: () => void;
  onBook: () => void;
}

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ pkg, onClose, onBook }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editableItinerary, setEditableItinerary] = useState<ItineraryDay[]>(pkg.itinerary.map(item => ({ ...item, rating: item.rating || 5 })));
  const [editablePrice, setEditablePrice] = useState(pkg.price);

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...editableItinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setEditableItinerary(newItinerary);
  };

  const downloadPdf = async () => {
    const element = document.getElementById('package-detail-modal-content');
    if (!element) return;
    setIsDownloading(true);

    // @ts-ignore
    const html2pdf = window.html2pdf;
    if (html2pdf) {
      // Temporarily remove max-height and overflow for capture to get everything
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';

      const opt = {
        margin: [0, 0],
        filename: `HolidayPlan_${pkg.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          height: element.scrollHeight,
          logging: false
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      try {
        await html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error("PDF generation failed:", err);
        window.print();
      } finally {
        element.style.maxHeight = originalMaxHeight;
        element.style.overflow = originalOverflow;
      }
    } else {
      window.print();
    }
    setIsDownloading(false);
  };

  const generateWhatsappMessage = (type: 'Summary' | 'Booking') => {
    let message = type === 'Booking' 
      ? `*Booking Request for: ${pkg.title}*\n`
      : `*Trip Summary: ${pkg.title}*\n`;
    
    message += `*Destination:* ${pkg.destination}\n`;
    message += `*Duration:* ${pkg.duration}\n`;
    message += `*Price Quote:* ${editablePrice}\n\n`;
    message += `*Itinerary Details:*\n`;
    
    editableItinerary.forEach((item) => {
      const stars = "⭐".repeat(item.rating || 5);
      message += `Day ${item.day}: ${item.title}\n`;
      message += `🏨 Hotel: ${item.hotel} (${stars})\n`;
      message += `✨ Activities: ${item.activities}\n\n`;
    });

    if (type === 'Booking') {
      message += `_I want to confirm this booking with the details above._`;
    } else {
      message += `_Shared via Way2GoHolidays_`;
    }
    
    return `https://wa.me/917303402841?text=${encodeURIComponent(message)}`;
  };

  const handleFinalBooking = () => {
    window.open(generateWhatsappMessage('Booking'), '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md no-print" onClick={onClose}></div>
      
      <div id="package-detail-modal-content" className="relative bg-white w-full max-w-5xl max-h-[95vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col print:max-h-none print:shadow-none print:rounded-none print:static">
        
        {/* Header Area */}
        <div className="relative h-48 sm:h-80 shrink-0">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent no-print"></div>
          
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-3 no-print z-20">
            <button onClick={onClose} className="p-2 sm:p-3 bg-white/10 backdrop-blur-md text-white hover:bg-white/30 rounded-full transition-all hover:scale-125 active:scale-90">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-4 sm:bottom-8 left-6 sm:left-10 w-full pr-12 sm:pr-24 z-10">
            <h1 className="text-xl sm:text-5xl font-bold text-white leading-tight drop-shadow-lg transition-transform hover:scale-105 cursor-default">
              {pkg.title}
            </h1>
          </div>
        </div>

        {/* Itinerary List */}
        <div className="flex-grow overflow-y-auto px-5 sm:px-12 py-6 sm:py-10 bg-slate-50/50 print:bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center mb-6 sm:mb-10 bg-white border border-blue-100 p-5 sm:p-6 rounded-[2rem] no-print shadow-sm">
             <div className="flex items-center gap-4 mb-4 md:mb-0">
               <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform hover:rotate-12">
                 <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
               </div>
               <div className="cursor-default select-none transition-transform hover:scale-105">
                 <p className="text-slate-900 font-bold text-base sm:text-lg">{isEditMode ? 'Editing Plan' : 'Expert Plan'}</p>
                 <p className="text-slate-500 text-[10px] sm:text-sm">Way2Go Premium Package</p>
               </div>
             </div>
             <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 group transition-all hover:scale-105">
                <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-widest mb-1">Package Quote</span>
                {isEditMode ? (
                  <input 
                    value={editablePrice}
                    onChange={(e) => setEditablePrice(e.target.value)}
                    className="text-xl font-bold text-black tracking-tighter bg-white border-2 border-orange-200 rounded-lg px-2 py-1 outline-none w-full md:text-right"
                  />
                ) : (
                  <span className="text-xl sm:text-3xl font-bold text-blue-600 tracking-tighter transition-colors group-hover:text-blue-700 block">{editablePrice}</span>
                )}
             </div>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {editableItinerary.map((item, index) => (
              <div key={index} className="relative pl-0 sm:pl-20 group break-inside-avoid">
                <div className={`bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border shadow-sm transition-all duration-300 ${isEditMode ? 'border-orange-100' : 'border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 hover:scale-[1.01]'}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-110">Day {item.day}</span>
                  </div>
                  {isEditMode ? (
                    <input 
                      value={item.title}
                      onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                      className="text-lg sm:text-3xl font-bold text-black leading-tight w-full bg-orange-50/30 border-2 border-orange-100 rounded-xl p-3 mb-4 outline-none"
                    />
                  ) : (
                    <h5 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 transition-all group-hover:text-blue-600 cursor-default">{item.title}</h5>
                  )}
                  {isEditMode ? (
                    <textarea 
                      value={item.activities}
                      rows={3}
                      onChange={(e) => handleUpdateDay(index, 'activities', e.target.value)}
                      className="w-full text-black font-bold text-sm sm:text-lg mb-4 bg-orange-50/30 border-2 border-orange-100 rounded-xl p-4 outline-none resize-none"
                    />
                  ) : (
                    <p className="text-slate-600 font-medium mb-6 text-sm sm:text-lg">{item.activities}</p>
                  )}
                  {item.hotel !== 'N/A' && (
                    <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 flex items-center gap-4 sm:gap-6 transition-all hover:bg-blue-50/30 group/hotel">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 no-print shadow-lg transition-transform group-hover/hotel:scale-110 group-hover/hotel:rotate-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-widest no-print">Stay</span>
                          <div className="flex gap-0.5 no-print">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </div>
                        {isEditMode ? (
                          <input 
                            value={item.hotel}
                            onChange={(e) => handleUpdateDay(index, 'hotel', e.target.value)}
                            className="w-full font-bold text-black text-sm sm:text-lg bg-white border-2 border-orange-100 rounded-lg px-2 py-1 outline-none"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 text-sm sm:text-lg block truncate transition-colors group-hover/hotel:text-blue-700">{item.hotel}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 sm:p-8 bg-white border-t border-slate-100 shrink-0 flex flex-wrap gap-2 sm:gap-4 no-print">
          <button 
            onClick={downloadPdf}
            disabled={isDownloading}
            className={`group flex-1 py-3 sm:py-4 px-2 sm:px-4 border-2 border-slate-200 rounded-xl sm:rounded-2xl font-bold text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 text-[9px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${isDownloading ? 'opacity-50' : ''}`}
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="group-hover:scale-110 transition-transform">{isDownloading ? 'Saving...' : 'Download PDF'}</span>
          </button>
          
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`group flex-1 py-3 sm:py-4 px-2 sm:px-4 border-2 rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-110 active:scale-95 text-[9px] sm:text-xs uppercase tracking-widest ${isEditMode ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600'}`}
          >
            <span className="group-hover:scale-110 transition-transform">{isEditMode ? 'Finish' : 'Edit'}</span>
          </button>

          <button 
            onClick={handleFinalBooking}
            className="group w-full sm:flex-[2] py-4 sm:py-4 px-6 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            <span className="group-hover:scale-110 transition-transform">Book This Holiday</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsModal;
