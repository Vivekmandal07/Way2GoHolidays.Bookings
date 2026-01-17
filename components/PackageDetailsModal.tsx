
import React, { useState } from 'react';
import { Package, ItineraryDay } from '../types';

interface PackageDetailsModalProps {
  pkg: Package;
  onClose: () => void;
  onBook: () => void;
}

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ pkg, onClose, onBook }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableItinerary, setEditableItinerary] = useState<ItineraryDay[]>(pkg.itinerary.map(item => ({ ...item, rating: item.rating || 5 })));
  const [editablePrice, setEditablePrice] = useState(pkg.price);

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...editableItinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setEditableItinerary(newItinerary);
  };

  const downloadPdf = () => {
    window.print();
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
      message += `_Shared via Way2GoHolidays AI Planner_`;
    }
    
    return `https://wa.me/917303402841?text=${encodeURIComponent(message)}`;
  };

  const sendWhatsappSummary = () => {
    window.open(generateWhatsappMessage('Summary'), '_blank');
  };

  const handleFinalBooking = () => {
    window.open(generateWhatsappMessage('Booking'), '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md no-print" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-5xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col print:max-h-none print:shadow-none print:rounded-none print:static">
        
        {/* Header Area */}
        <div className="relative h-64 md:h-80 shrink-0 print:h-40">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover print:hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent print:hidden"></div>
          
          <div className="absolute top-6 right-6 flex items-center gap-3 no-print z-20">
            <button onClick={onClose} className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-white/30 rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-8 left-10 print:static print:p-6 w-full pr-24 z-10">
            <div className="flex items-center gap-3 mb-4 no-print">
               <span className="bg-white/20 backdrop-blur-lg border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                 {pkg.duration}
               </span>
               <span className="bg-blue-600/30 backdrop-blur-lg border border-blue-400/30 text-blue-50 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                 {pkg.destination}
               </span>
            </div>
            
            <div className="hidden print:block mb-4">
               <h1 className="text-3xl font-black text-blue-700">Way2GoHolidays</h1>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Premium Itinerary</p>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg print:text-slate-900">
              {pkg.title}
            </h1>
          </div>
        </div>

        {/* Itinerary List */}
        <div className="flex-grow overflow-y-auto px-6 md:px-12 py-10 bg-slate-50/50 print:bg-white print:overflow-visible">
          
          <div className={`mb-10 flex flex-col md:flex-row items-center justify-between bg-white border p-6 rounded-[2rem] no-print shadow-sm transition-all duration-500 ${isEditMode ? 'border-orange-200 bg-orange-50/30' : 'border-blue-100'}`}>
             <div className="flex items-center gap-4 mb-4 md:mb-0">
               <div className={`flex items-center justify-center w-12 h-12 rounded-2xl text-2xl transition-colors ${isEditMode ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
               </div>
               <div>
                 <p className="text-slate-900 font-black text-lg leading-tight">
                   {isEditMode ? 'Edit Pricing & Plan' : 'Expert Holiday Plan'}
                 </p>
                 <p className="text-slate-500 text-sm">
                   {isEditMode ? 'Modify price and daily details below.' : 'View details. Use the "Edit Details" button at the bottom to customize.'}
                 </p>
               </div>
             </div>
             <div className="text-right pl-6 border-l border-slate-100 group/price relative">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-widest mb-1">Package Price</span>
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <input 
                      value={editablePrice}
                      onChange={(e) => setEditablePrice(e.target.value)}
                      className="text-3xl font-black text-orange-600 tracking-tighter bg-white border-2 border-orange-200 outline-none text-right w-44 rounded-xl px-3 py-1 transition-all focus:border-orange-500"
                    />
                  ) : (
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">{editablePrice}</span>
                  )}
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-8 print:mb-4">
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">Personalized Itinerary</h4>
            <div className="hidden print:block text-right">
              <p className="text-sm font-bold text-gray-700">{editablePrice}</p>
              <p className="text-xs font-bold text-gray-500">{pkg.duration} | {pkg.destination}</p>
            </div>
          </div>

          <div className="space-y-12 relative print:space-y-6">
            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-slate-200 to-transparent no-print"></div>
            
            {editableItinerary.map((item, index) => (
              <div key={index} className="relative pl-16 md:pl-20 group print:pl-0">
                <div className="absolute left-[1.625rem] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] z-10 no-print transition-transform group-hover:scale-125"></div>
                
                <div className={`bg-white p-8 md:p-10 rounded-[2.5rem] border shadow-sm transition-all duration-300 print:shadow-none print:border-none print:p-0 ${isEditMode ? 'border-orange-100 shadow-orange-50' : 'border-slate-100 group-hover:shadow-xl'}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] shrink-0 border ${isEditMode ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          Day {item.day}
                        </span>
                      </div>
                      <div className="relative flex-grow">
                        {isEditMode ? (
                          <input 
                            value={item.title}
                            onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                            className="text-2xl font-black text-slate-900 leading-tight w-full outline-none bg-orange-50/30 border-2 border-orange-100 focus:border-orange-400 rounded-xl p-3 transition-all"
                          />
                        ) : (
                          <h5 className="text-2xl font-black text-slate-900 leading-tight p-2">{item.title}</h5>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2 no-print">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                          {isEditMode ? 'Edit Activities' : 'Planned Activities'}
                        </span>
                      </div>
                      {isEditMode ? (
                        <textarea 
                          value={item.activities}
                          rows={4}
                          onChange={(e) => handleUpdateDay(index, 'activities', e.target.value)}
                          className="w-full text-slate-800 leading-relaxed outline-none bg-orange-50/30 border-2 border-orange-100 focus:border-orange-400 rounded-2xl p-4 transition-all resize-none font-medium"
                        />
                      ) : (
                        <p className="text-slate-600 leading-relaxed font-medium p-2 text-lg">{item.activities}</p>
                      )}
                    </div>

                    {item.hotel !== 'N/A' && (
                      <div className={`flex items-center p-6 rounded-3xl border transition-colors ${isEditMode ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                        {/* REFINED HOTEL LOGO - STARS REMOVED, LITTLE ZOOM ONLY */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl flex items-center justify-center mr-6 shadow-lg shadow-blue-100 no-print border border-white/20 transition-transform duration-300 hover:scale-105">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] block no-print leading-none">Premium Stay</span>
                            {/* INTERACTIVE STAR RATING SELECTOR - STARS MADE LARGER */}
                            <div className="flex gap-1 no-print">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  disabled={!isEditMode}
                                  onClick={() => handleUpdateDay(index, 'rating', star)}
                                  className={`transition-all duration-200 ${star <= (item.rating || 5) ? 'text-yellow-400' : 'text-slate-300'} ${isEditMode ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
                                >
                                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>
                          {isEditMode ? (
                            <input 
                              value={item.hotel}
                              onChange={(e) => handleUpdateDay(index, 'hotel', e.target.value)}
                              className="w-full font-bold text-slate-900 text-lg bg-white border-2 border-orange-100 rounded-xl px-3 py-1 outline-none focus:border-orange-400 transition-all"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-lg">{item.hotel}</span>
                              <div className="hidden print:flex gap-0.5 ml-2">
                                {[...Array(item.rating || 5)].map((_, i) => (
                                  <span key={i} className="text-xs text-yellow-500">★</span>
                                ))}
                              </div>
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
          
          <div className="hidden print:block mt-12 pt-8 border-t border-gray-100 text-center">
             <p className="text-sm font-bold text-blue-600">www.way2goholidays.com</p>
             <p className="text-xs text-gray-400">Your Journey, Our Passion | +91 7303402841</p>
          </div>
        </div>

        {/* Action Bar - Fixed PDF Button Border */}
        <div className="p-8 bg-white border-t border-slate-100 shrink-0 flex flex-wrap md:flex-nowrap gap-4 no-print shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
          <button 
            onClick={downloadPdf}
            className="group flex-1 min-w-[120px] py-4 px-4 border-2 border-slate-300 rounded-2xl font-black text-slate-500 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-600 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 text-[10px] uppercase tracking-wider shadow-sm hover:shadow-md outline-none"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="transition-transform duration-300 group-hover:scale-110 inline-block">PDF</span>
          </button>
          
          <button 
            onClick={sendWhatsappSummary}
            className="group flex-1 min-w-[120px] py-4 px-4 border-2 border-green-500 text-green-600 rounded-2xl font-black hover:bg-green-50 transition-all flex items-center justify-center gap-2 active:scale-95 text-[10px] uppercase tracking-wider"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.12.552 4.189 1.598 6.04L0 24l6.135-1.61a11.802 11.802 0 005.912 1.569h.005c6.638 0 12.039-5.404 12.042-12.041a11.79 11.79 0 00-3.483-8.498z"/></svg>
            <span className="transition-transform duration-300 group-hover:scale-110 inline-block">Summary</span>
          </button>

          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`group flex-1 min-w-[120px] py-4 px-4 border-2 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 text-[10px] uppercase tracking-wider ${isEditMode ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'border-slate-300 text-slate-600 hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50'}`}
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span className="transition-transform duration-300 group-hover:scale-110 inline-block">{isEditMode ? 'Finish Edit' : 'Edit Details'}</span>
          </button>

          <button 
            onClick={handleFinalBooking}
            className="group flex-[2] min-w-[200px] py-4 px-6 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 overflow-hidden uppercase tracking-widest"
          >
            <span className="transition-transform duration-300 group-hover:scale-110 inline-block">Book This Holiday</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        .py-4\\.5 {
          padding-top: 1.125rem;
          padding-bottom: 1.125rem;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageDetailsModal;
