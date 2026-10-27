import React, { useState, useEffect, useRef } from 'react';
import { Check, Coffee, MapPin, Utensils, UtensilsCrossed } from 'lucide-react';
import { Package, ItineraryDay } from '../types';
import { CONTACT_DETAILS, DESTINATION_CITIES, getDestinationImage } from '../constants';

const HOTEL_ROOM_IMAGE =
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80';

const dayDetailFields = [
  { key: 'sightseeingIncluded', label: 'Sightseeing', Icon: MapPin },
  { key: 'breakfastIncluded', label: 'Breakfast', Icon: Coffee },
  { key: 'lunchIncluded', label: 'Lunch', Icon: Utensils },
  { key: 'dinnerIncluded', label: 'Dinner', Icon: UtensilsCrossed },
] as const;

interface FullPageItineraryProps {
  pkg: Package;
  onBack: () => void;
  onRaiseYourTrip: (destination: string) => void;
}

const FullPageItinerary: React.FC<FullPageItineraryProps> = ({ pkg, onBack, onRaiseYourTrip }) => {
  const destinationImage = getDestinationImage(pkg.destination, pkg.image);
  const durationDays = Number(pkg.duration.match(/\/\s*(\d+)\s*D/i)?.[1]) || Math.max(
    pkg.itinerary.reduce((maxDay, item) => Math.max(maxDay, item.day), 0),
    pkg.itinerary.length,
    1
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editNotice, setEditNotice] = useState<string | null>(null);
  const [editablePrice, setEditablePrice] = useState(pkg.price);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [editableItinerary, setEditableItinerary] = useState<ItineraryDay[]>(
    pkg.itinerary.map(item => ({ ...item, rating: item.rating || 5 }))
  );
  
  const [numberOfDays, setNumberOfDays] = useState<number>(durationDays);
  const [numberOfNights, setNumberOfNights] = useState<number>(Math.max(0, durationDays - 1));
  const [hotelRoomCategory, setHotelRoomCategory] = useState('Standard');
  const [travelName, setTravelName] = useState<string>('');
  const [travelEmail, setTravelEmail] = useState<string>('');
  const [travelPhone, setTravelPhone] = useState<string>('');
  const [travelOrigin, setTravelOrigin] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>('');
  const [rooms, setRooms] = useState<number>(1);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [childrenAges, setChildrenAges] = useState<string[]>([]);
  const packageAmount = Number(pkg.price.replace(/[^\d.]/g, ''));
  const bookingConfirmationAmount = Number.isFinite(packageAmount) && packageAmount > 0
    ? Math.round(packageAmount * 0.3)
    : null;
  const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

  const formatTravelDate = (value: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const customerDetails = [
    travelName.trim() && ['Guest name', travelName.trim()],
    travelDate && ['Date of journey', formatTravelDate(travelDate)],
    travelOrigin.trim() && ['Starting from', travelOrigin.trim()],
    ['Rooms', String(rooms)],
    ['Adults', String(adults)],
    [
      'Children',
      `${children}${childrenAges.length > 0 ? ` (ages ${childrenAges.join(', ')})` : ''}`,
    ],
    travelEmail.trim() && ['Email', travelEmail.trim()],
    travelPhone.trim() && ['WhatsApp', travelPhone.trim()],
  ].filter((detail): detail is [string, string] => Boolean(detail));
  const getDayCity = (day: ItineraryDay) => {
    if (day.city?.trim()) return day.city.trim();
    const searchableDay = `${day.title} ${day.activities}`.toLowerCase();
    const destinationCities = DESTINATION_CITIES[pkg.destination] || [];
    return destinationCities.find(city => {
      const aliases = [city, ...Array.from(city.matchAll(/\(([^)]+)\)/g), match => match[1])];
      return aliases.some(alias => searchableDay.includes(alias.toLowerCase()));
    }) || pkg.destination;
  };
  const quotedCities = Array.from(new Set(
    editableItinerary
      .filter(day => !/departure|depart/i.test(day.title))
      .map(getDayCity)
      .filter(Boolean)
  ));
  const hotelStays = editableItinerary.reduce<Array<{ hotel: string; nights: number; cities: string[] }>>((stays, day) => {
    const hotel = day.hotel.trim();
    if (!hotel || hotel.toLowerCase() === 'n/a' || /departure|depart/i.test(day.title)) return stays;

    const existingStay = stays.find(stay => stay.hotel.toLowerCase() === hotel.toLowerCase());
    if (existingStay) {
      existingStay.nights += 1;
      const city = getDayCity(day);
      if (!existingStay.cities.includes(city)) existingStay.cities.push(city);
    } else {
      stays.push({ hotel, nights: 1, cities: [getDayCity(day)] });
    }
    return stays;
  }, []);

  const getDayDescriptionPlaceholder = (day: ItineraryDay) => {
    const title = day.title.toLowerCase();
    if (/arrival|arrive/.test(title) || day.day === 1) {
      return `Arrival: Pick-up from [airport] and transfer to [hotel] by [car/other transport] ([distance] km, about [travel time]). En route: [optional stop/activity]. Evening: [nearby activity].`;
    }
    if (/departure|depart/.test(title) || day.day === numberOfDays) {
      return `After breakfast, transfer from [hotel/city] to [airport/station] by [transport] ([distance] km, about [travel time]). Include the pick-up time and any optional costs.`;
    }
    return `After breakfast, [activity or transfer] in [city]. If travelling to [next city], include transport ([distance] km, about [travel time]), en-route stops if travelling by car, and a possible evening activity. List optional activities or costs payable on your own.`;
  };

  

  useEffect(() => {
    if (children === 0) {
      setChildrenAges([]);
      return;
    }

    setChildrenAges(prev => {
      const next = Array.from({ length: children }, (_, i) => prev[i] ?? '<2');
      return next;
    });
  }, [children]);

  const createEmptyDay = (dayNumber: number): ItineraryDay => ({
    day: dayNumber,
    title: '',
    activities: '',
    hotel: 'N/A',
    rating: 5,
  });

  useEffect(() => {
    setEditableItinerary(prev => {
      return Array.from({ length: numberOfDays }, (_, index) => {
        const dayNumber = index + 1;
        const currentDay = prev.find(day => day.day === dayNumber);
        const originalDay = pkg.itinerary.find(day => day.day === dayNumber);
        const day = currentDay || originalDay || createEmptyDay(dayNumber);

        return {
          ...day,
          day: dayNumber,
          hotel: day.hotel || 'N/A',
          rating: day.rating || 5,
        };
      });
    });
  }, [numberOfDays, pkg.itinerary]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!editNotice) return;

    const timeout = window.setTimeout(() => setEditNotice(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [editNotice]);

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...editableItinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setEditableItinerary(newItinerary);
  };

  const handleRaiseYourTrip = () => {
    onRaiseYourTrip(pkg.destination);
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditNotice('Itinerary updated successfully. Your changes are visible in this view.');
      return;
    }

    setIsEditMode(true);
    setEditNotice("You're in edit mode. Customize the itinerary to suit your preferences.");
  };

  const handleBookNow = () => {
    let message = `*Interest in ${pkg.title}*\n`;
    message += `*Destination:* ${pkg.destination}\n`;
    message += `*Price Quote:* ${editablePrice}\n`;
    if (travelOrigin) message += `*Starting From:* ${travelOrigin}\n`;
    if (travelName) message += `*Traveller:* ${travelName}\n`;
    if (travelEmail) message += `*Email:* ${travelEmail}\n`;
    if (travelPhone) message += `*WhatsApp:* ${travelPhone}\n`;
    if (travelDate) message += `*Travel Date:* ${formatTravelDate(travelDate)}\n`;
    message += `*Rooms:* ${rooms} | *Adults:* ${adults} | *Children:* ${children}\n`;

    if (children > 0) {
      const ages = childrenAges.filter(Boolean).join(', ');
      if (ages) message += `*Children Ages:* ${ages}\n`;
    }

    message += `\nI'm viewing this day-wise itinerary and want to proceed with booking!\n\n`;
    message += `*Thankyou for Connecting Way2Go Holidays!*\n`;
    message += `Our Destination Expert will Connect you very Shortly!`;

    window.open(`${CONTACT_DETAILS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    const originalTitle = document.title;
    document.title = `Way2Go_${pkg.title.replace(/\s+/g, '_')}`;

    try {
      await document.fonts.ready;
      await Promise.all(
        Array.from(contentRef.current.querySelectorAll('img')).map(image => {
          if (image.complete) return image.decode().catch(() => undefined);
          return new Promise<void>(resolve => {
            const finishLoading = () => {
              image.decode().catch(() => undefined).finally(resolve);
            };
            image.addEventListener('load', finishLoading, { once: true });
            image.addEventListener('error', () => resolve(), { once: true });
          });
        })
      );
      window.print();
    } finally {
      document.title = originalTitle;
      setIsDownloading(false);
    }
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
            onClick={handleToggleEditMode}
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
          <button
            onClick={handleRaiseYourTrip}
            className="group hidden sm:inline-flex rounded-xl border-2 border-blue-600 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-blue-700 transition hover:bg-blue-50"
          >
            <span className="inline-block transition-transform duration-200 group-hover:scale-110">Raise Your Trip</span>
          </button>
        </div>
      </nav>

      {editNotice && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-20 right-4 left-4 md:left-auto z-[170] md:max-w-md rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
            isEditMode
              ? 'border-blue-200 bg-blue-50 text-blue-900'
              : 'border-green-200 bg-green-50 text-green-900'
          }`}
        >
          {editNotice}
        </div>
      )}

      {/* Main Content Area focused on full capture */}
      <div ref={contentRef} id="pdf-content" className="bg-white">
        <header className="relative h-[30vh] md:h-[60vh] overflow-hidden">
          <img src={destinationImage} alt={`${pkg.destination} destination`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#092b50]/90 via-[#092b50]/55 to-transparent"></div>
          <div className="pdf-cover-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-b from-transparent via-white/45 to-white backdrop-blur-[2px]"></div>
          <div className="pdf-cover-brand absolute top-4 left-5 md:top-8 md:left-12 rounded-xl bg-white p-4 shadow-lg">
            <p className="text-lg font-black tracking-wide">
              <span className="text-orange-500">Way2Go</span>{' '}
              <span className="text-sky-500">Holidays</span>
            </p>
            <p className="mt-1 text-sm font-bold text-slate-700">
              Dear {travelName.trim() || 'Guest'},
            </p>
          </div>
          <div className="pdf-cover-caption absolute bottom-6 left-0 right-0 container mx-auto px-5 md:px-12">
            <div className="max-w-4xl space-y-2">
               <h1 className="text-2xl md:text-7xl font-bold text-white tracking-tighter leading-tight origin-left transition-transform hover:scale-105 cursor-default">
                 {pkg.title}
               </h1>
               <p className="text-xs md:text-base font-medium text-white/90">
                 Quotation by <span className="font-bold text-[#c7c7d6]">Way2Go Holidays</span>
               </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-5 md:px-12 py-8 md:py-20">
          <section className="pdf-price-summary mb-8 md:mb-12 overflow-hidden rounded-2xl bg-[#123b78] text-white shadow-lg print-summary">
            <div className="pdf-price-summary-content grid grid-cols-1 divide-y divide-white/15 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-5 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Total package cost</p>
                <p className="mt-2 text-3xl font-black tracking-tight">{pkg.price}</p>
              </div>
              <div className="p-5 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Booking confirmation amount</p>
                <p className="mt-2 text-3xl font-black tracking-tight">
                  {bookingConfirmationAmount === null ? 'Not available' : formatCurrency(bookingConfirmationAmount)}
                </p>
              </div>
            </div>
          </section>

          {customerDetails.length > 0 && (
            <section className="pdf-only pdf-customer-details mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-7 print-summary">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#1f70b5]">
                Traveller details
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {customerDetails.map(([label, value]) => (
                  <div key={label} className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-bold leading-snug text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="pdf-only pdf-stay-summary mb-12 rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm md:p-7 print-summary">
            <h2 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#1f70b5]">
              Cities &amp; hotel plan
            </h2>
            <div className="mb-4 rounded-xl border border-blue-100 bg-white p-4">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Cities included</p>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-900">
                {quotedCities.length > 0 ? quotedCities.join(' · ') : pkg.destination}
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-blue-100 bg-white">
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.3fr)] gap-3 bg-[#123b78] px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">
                <span>Hotel name</span>
                <span>Nights</span>
                <span>Room category</span>
              </div>
              {hotelStays.length > 0 ? hotelStays.map(stay => (
                <div key={stay.hotel} className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.3fr)] gap-3 border-t border-slate-100 px-4 py-3 text-sm">
                  <span className="break-words font-bold text-slate-900">
                    {stay.hotel}
                    <span className="mt-1 block text-xs font-medium text-slate-500">{stay.cities.join(' · ')}</span>
                  </span>
                  <span className="font-semibold text-slate-700">{stay.nights} night{stay.nights === 1 ? '' : 's'}</span>
                  <span className="font-semibold text-slate-700">{hotelRoomCategory}</span>
                </div>
              )) : (
                <div className="px-4 py-3 text-sm text-slate-600">
                  No hotel stays are listed in this itinerary yet.
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-24">
            
            <div className="lg:col-span-8 space-y-12 md:space-y-20">
              <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                 <div className="max-w-xl">
                   <h3 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2 hover:text-blue-600 transition-colors cursor-default">Your trip at a glance</h3>
                   <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                     A day-by-day plan for your {pkg.duration} trip to {pkg.destination}.
                   </p>
                   <p className="text-xs md:text-sm text-slate-400 mt-3">
                    Prices depend on availability. Optional activities or upgrades may change the final price.
                   </p>
                 </div>
                  <div className="pdf-only pdf-package-quote bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 w-full md:w-auto text-left md:text-right group hover:scale-110 transition-transform shadow-sm">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Package Quote</span>
                    <span className="text-2xl md:text-3xl font-bold text-[#1f70b5] tracking-tighter transition-all group-hover:text-blue-700 block">{pkg.price}</span>
                 </div>
              </div>
             {/* Trip Duration */}
<div className="screen-only bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-6 rounded-3xl border border-blue-100 shadow-sm focus-within:border-blue-400 focus-within:shadow-lg">
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

    <div>
      <h4 className="text-lg md:text-xl font-bold text-slate-900">
        Trip Duration
      </h4>
      <p className="text-sm text-slate-500 mt-1">
        Select the number of nights for your trip.
      </p>
    </div>

    <div className="flex items-end gap-3">

      {/* Nights Input */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Nights
        </label>

        <input
          type="number"
          min={0}
          max={60}
          value={numberOfNights === 0 ? '' : numberOfNights}
          onChange={(e) => {
            const rawValue = e.target.value;
            const nights = rawValue === '' ? 0 : Math.max(0, Number(rawValue) || 0);

            setNumberOfNights(nights);
            setNumberOfDays(nights + 1);
          }}
          className="w-32 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* + */}
      <div className="pb-2 text-xl font-bold text-slate-400">
        +
      </div>

      {/* Days Automatically Calculated */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Days
        </label>

        <div className="w-32 rounded-xl border border-blue-200 bg-blue-100 px-4 py-3 text-sm font-bold text-blue-700">
          {numberOfDays}
        </div>
      </div>

      {/* Explanation */}
      <div className="pb-2 hidden md:block">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {numberOfNights} Night{numberOfNights !== 1 ? 's' : ''} + 1 Day
        </span>
      </div>

    </div>
  </div>
</div>

{isEditMode && (
  <section className="screen-only rounded-2xl border border-orange-200 bg-orange-50 p-5">
    <label htmlFor="hotel-room-category" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
      Hotel room category for this quote
    </label>
    <select
      id="hotel-room-category"
      value={hotelRoomCategory}
      onChange={event => setHotelRoomCategory(event.target.value)}
      className="mt-2 w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800"
    >
      {['Standard', 'Deluxe', 'Super-Deluxe', 'Executive', 'Premium'].map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  </section>
)}

              {/* Booking Details */}
              <div className="screen-only bg-gradient-to-r from-orange-100 to-orange-100 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 transition-all duration-300 focus-within:border-orange-400 focus-within:shadow-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg md:text-xl font-bold text-slate-900">Travel Details</h4>
                  <span className="text-sm text-slate-500">Specify your travel preferences</span>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Traveller Name</label>
                    <input
                      type="text"
                      value={travelName}
                      onChange={(e) => setTravelName(e.target.value)}
                      placeholder="Enter traveller name"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      value={travelEmail}
                      onChange={(e) => setTravelEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp No.</label>
                    <input
                      type="tel"
                      value={travelPhone}
                      onChange={(e) => setTravelPhone(e.target.value)}
                      placeholder="Enter WhatsApp number"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Travel Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                    {travelDate && (
                      <p className="text-xs text-slate-500 mt-1">{formatTravelDate(travelDate)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starting From</label>
                    <input
                      type="text"
                      value={travelOrigin}
                      onChange={(e) => setTravelOrigin(e.target.value)}
                      placeholder="City / airport"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rooms</label>
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adults</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Children</label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                    >
                      {Array.from({ length: 30 }, (_, i) => i).map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {children > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {childrenAges.map((age, idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Child {idx + 1} age</label>
                        <select
                          value={age}
                          onChange={(e) => {
                            const next = [...childrenAges];
                            next[idx] = e.target.value;
                            setChildrenAges(next);
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                        >
                          <option value="<2 yrs">&lt;2 yrs</option>
                          {Array.from({ length: 16 }, (_, i) => i + 2).map((ageOption) => (
                            <option key={ageOption} value={`${ageOption}+`}>{ageOption}+ yrs</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Day wise details */}
              <div className="relative space-y-10 md:space-y-16">
                <div className="absolute left-6 md:left-12 top-4 bottom-4 w-0.5 bg-slate-100 no-print"></div>
                
                {editableItinerary.map((day, idx) => {
  const isEmptyDay = !day.title && !day.activities;
          const showHotelSection = isEmptyDay || (!isEmptyDay && day.hotel !== 'N/A');

          return (
            <div
              key={day.day}
              className="pdf-day relative pl-14 md:pl-32 group break-inside-avoid"
            >

      {/* Day Number */}
      <div
        className={`
          absolute left-0 top-0
          w-12 h-12 md:w-24 md:h-24
          bg-white border-2 text-slate-900
          rounded-2xl md:rounded-3xl
          flex flex-col items-center justify-center
          shadow-sm z-10
          transition-all duration-500

          ${
            isEditMode
              ? 'border-orange-400 scale-105 shadow-md'
              : 'border-slate-100 group-hover:border-blue-500 group-hover:scale-110 group-hover:shadow-lg'
          }
        `}
      >
        <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">
          Day
        </span>

        <span className="text-xl md:text-5xl font-bold tracking-tighter leading-none">
          {day.day}
        </span>
      </div>

      <div className="space-y-3">

        {/* DAY TITLE */}
        {isEditMode ? (
          <>
          <input
            value={day.city || ''}
            placeholder={`Enter city / stop for Day ${day.day}`}
            aria-label={`City or stop for day ${day.day}`}
            onChange={(e) => handleUpdateDay(idx, 'city', e.target.value)}
            className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-slate-700 placeholder:text-orange-300"
          />
          <input
            value={day.title}
            placeholder={
              isEmptyDay
                ? `Enter activity name for Day ${day.day}`
                : 'Enter day title'
            }
            onChange={(e) =>
              handleUpdateDay(idx, 'title', e.target.value)
            }
            className="text-lg md:text-3xl font-bold text-black tracking-tight leading-tight w-full bg-orange-50 border-b-2 border-orange-400 outline-none p-2 rounded-t-lg placeholder:text-orange-300"
          />
          </>
        ) : (
          <h4
            className={`
              text-lg md:text-3xl font-bold
              tracking-tight leading-tight pt-2
              transition-all
              ${
                isEmptyDay
                  ? 'text-slate-300 italic'
                  : 'text-slate-900 group-hover:text-blue-600 group-hover:translate-x-2'
              }
            `}
          >
            {isEmptyDay
              ? `Day ${day.day}`
              : day.title}
          </h4>
        )}

        {/* DAY CONTENT */}
        <div
          className={`
            p-4 md:p-8
            rounded-3xl md:rounded-[2.5rem]
            border
            transition-all duration-500

            ${
              isEmptyDay
                ? 'bg-slate-50/70 border-dashed border-slate-300'
                : isEditMode
                ? 'bg-orange-50/20 border-orange-200'
                : 'bg-white border-slate-100 group-hover:border-blue-100 group-hover:shadow-2xl group-hover:shadow-blue-50/50'
            }
          `}
        >

          {isEditMode ? (
            <div className="mb-5">
              <textarea
                value={day.activities}
                placeholder={`Add detailed plans for Day ${day.day}`}
                rows={4}
                onChange={(e) =>
                  handleUpdateDay(idx, 'activities', e.target.value)
                }
                className="w-full text-sm md:text-base text-slate-800 leading-relaxed mb-2 bg-white border-2 border-orange-100 rounded-xl p-4 outline-none resize-y placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500">
                <span className="font-semibold">Suggested details:</span> {getDayDescriptionPlaceholder(day)} Use confirmed route estimates and mention optional costs payable on your own.
              </p>
            </div>
          ) : (
            <p
              className={`
                text-sm md:text-base
                leading-relaxed
                font-medium
                mb-5

                ${
                  isEmptyDay
                    ? 'text-slate-400 italic'
                    : 'text-slate-600'
                }
              `}
            >
              {isEmptyDay
                ? `Add your activity and description for Day ${day.day}.`
                : day.activities}
            </p>
          )}

          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {dayDetailFields.map(({ key, label, Icon }) => (
              <label
                key={key}
                htmlFor={`day-${day.day}-${key}`}
                className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 transition-colors ${
                  day[key] ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
                } ${isEditMode ? 'cursor-pointer hover:border-blue-300' : ''}`}
              >
                {isEditMode ? (
                  <input
                    id={`day-${day.day}-${key}`}
                    type="checkbox"
                    checked={Boolean(day[key])}
                    onChange={(e) => handleUpdateDay(idx, key, e.target.checked)}
                    className="h-4 w-4 shrink-0 accent-blue-600"
                  />
                ) : (
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      day[key] ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {day[key] && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                )}
                <Icon className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </label>
            ))}
          </div>

          {/* HOTEL */}
          {showHotelSection && (
            <div
              className={`
                flex items-center
                p-4 md:p-6
                rounded-2xl md:rounded-3xl
                border gap-4 md:gap-6
                transition-all duration-300

                ${
                  isEditMode
                    ? 'bg-white border-orange-200'
                    : 'bg-slate-50 border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100'
                }
              `}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 no-print shadow-lg transition-transform group-hover:scale-110">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011 1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
                {day.hotel && day.hotel !== 'N/A' && (
                  <div className="w-28 shrink-0 overflow-hidden rounded-xl md:w-40">
                    <img
                      src={day.hotelImage || HOTEL_ROOM_IMAGE}
                      alt={day.hotelImage ? `Room at ${day.hotel}` : 'Representative hotel room'}
                      className="h-20 w-full object-cover md:h-28"
                    />
                    {!day.hotelImage && (
                      <span className="block px-1 pt-1 text-[9px] font-medium text-slate-500">
                        Representative room photo
                      </span>
                    )}
                  </div>
                )}
                <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 md:gap-4 mb-1">
                  <span className="text-[8px] md:text-[10px] font-bold text-blue-500 uppercase tracking-widest no-print">
                    Accommodation
                  </span>

                  {!isEmptyDay && day.hotel !== 'N/A' && (
                    <StarRating
                      rating={day.rating || 5}
                      dayIndex={idx}
                      editable={isEditMode}
                    />
                  )}
                </div>

                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      value={day.hotel === 'N/A' ? '' : day.hotel}
                      placeholder="Enter hotel name"
                      onChange={(e) =>
                        handleUpdateDay(idx, 'hotel', e.target.value)
                      }
                      className="w-full font-bold text-black text-sm md:text-xl outline-none border-b border-orange-100 bg-white placeholder:text-slate-300"
                    />
                    <input
                      type="url"
                      value={day.hotelImage || ''}
                      placeholder="Optional: this hotel's room image URL"
                      aria-label={`Room image URL for day ${day.day}`}
                      onChange={(e) => handleUpdateDay(idx, 'hotelImage', e.target.value)}
                      className="no-print w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                    />
                  </div>
                ) : isEmptyDay ? (
                  <span className="text-sm md:text-xl font-bold text-slate-300 italic block truncate transition-all">
                    Enter hotel name
                  </span>
                ) : (
                  <span className="text-sm md:text-xl font-bold text-slate-900 block truncate transition-all group-hover:text-blue-700">
                    {day.hotel}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* EMPTY DAY INDICATOR */}
          {isEmptyDay && !isEditMode && (
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 rounded-xl bg-white border border-dashed border-slate-300 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              <span className="text-sm font-semibold">
                Click Edit to add this day's itinerary
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
})}
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
                      <span className="group-hover:scale-110 transition-transform">{isDownloading ? 'Preparing...' : 'Save as PDF'}</span>
                    </button>
                  </div>

                  <div className="hidden lg:block mt-12 pt-10 border-t border-white/10 space-y-6 w-full">
                    <div className="flex justify-between items-center group cursor-default">
                      <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Duration</span>
                      <span className="font-bold text-xl transition-all group-hover:text-blue-400 group-hover:scale-125">{pkg.duration}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-default">
                      <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Quote</span>
                      <span className="font-bold text-3xl text-blue-400 transition-all group-hover:text-blue-300 group_hover:scale-110">{editablePrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-12 md:mt-20 border-t border-slate-200 pt-10 md:pt-14">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Way2Go Holidays</p>
              <h3 className="mt-2 text-2xl md:text-4xl font-bold tracking-tight text-slate-900">
                Company Bio &amp; Policies
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <section className="break-inside-avoid rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7">
                <h4 className="mb-3 text-lg md:text-xl font-bold text-slate-900">Company Bio</h4>
                <p className="text-sm md:text-base leading-relaxed text-slate-600">
                  Way2Go Holidays is a New Delhi-based travel company specializing in domestic and
                  international holiday packages, honeymoon tours, family vacations, group tours,
                  and customized travel experiences for any destination. We are committed to
                  providing the best hotels, sightseeing, and transportation at competitive prices,
                  along with 24×7 customer support to ensure a smooth and memorable journey for every
                  traveler. Customer satisfaction and personalized service are our top priorities.
                </p>
              </section>

              <section className="break-inside-avoid rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7">
                <h4 className="mb-3 text-lg md:text-xl font-bold text-slate-900">Terms &amp; Conditions</h4>
                <p className="text-sm md:text-base leading-relaxed text-slate-600">
                  Way2Go Holidays is a Delhi-based travel company specializing in domestic and
                  international holiday packages, honeymoon tours, family vacations, group tours,
                  and customized travel experiences. We are committed to providing the best hotels,
                  sightseeing, and transportation at competitive prices for any destination, along
                  with 24×7 customer support to ensure a smooth and memorable journey for every
                  traveler. Customer satisfaction and personalized service are our top priorities.
                </p>
              </section>

              <section className="break-inside-avoid rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7">
                <h4 className="mb-3 text-lg md:text-xl font-bold text-slate-900">Payment Policy</h4>
                <div className="space-y-3 text-sm md:text-base leading-relaxed text-slate-600">
                  <p>
                    A minimum advance payment of 30% of the total tour/package cost is required to
                    confirm a booking. The remaining balance must be paid at least 15 days before
                    travel. Hotels, flights, and transfers are subject to availability at the time
                    of confirmation.
                  </p>
                  <p>
                    Flight bookings require 100% payment at the time of booking because tickets are
                    subject to instant issuance and fare changes. Flight cancellations are subject
                    to the airline&apos;s policy.
                  </p>
                  <p>
                    Non-refundable hotel bookings require 100% payment. Once confirmed, the amount
                    paid is non-refundable in accordance with the hotel&apos;s cancellation policy.
                  </p>
                </div>
              </section>

              <section className="break-inside-avoid rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7">
                <h4 className="mb-3 text-lg md:text-xl font-bold text-slate-900">Payment Methods</h4>
                <p className="mb-3 text-sm md:text-base leading-relaxed text-slate-600">
                  We accept payments only through these official methods:
                </p>
                <ul className="mb-3 list-disc space-y-1 pl-5 text-sm md:text-base leading-relaxed text-slate-600">
                  <li>Company QR code (scanner)</li>
                  <li>Bank account transfer (NEFT/RTGS/IMPS)</li>
                </ul>
                <div className="space-y-2 text-sm md:text-base leading-relaxed text-slate-600">
                  <p>We do not accept payments through any personal UPI ID.</p>
                  <p>
                    Payments made to an unauthorized account or UPI ID are at the payer&apos;s own
                    risk. Booking confirmation is subject to service availability and receipt of the
                    required payment. All payments must be made using a payment method approved by
                    Way2Go Holidays.
                  </p>
                </div>
              </section>

              <section className="break-inside-avoid rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7 md:col-span-2">
                <h4 className="mb-3 text-lg md:text-xl font-bold text-slate-900">Cancellation Policy</h4>
                <p className="mb-3 text-sm md:text-base leading-relaxed text-slate-600">
                  A 30% cancellation charge applies to guest cancellations. For cancellations
                  within the following periods, the applicable charge is based on the total
                  package cost:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm md:text-base leading-relaxed text-slate-600">
                  <li>15–20 days before travel: 50%</li>
                  <li>7–14 days before travel: 60%</li>
                  <li>3–6 days before travel: 75%</li>
                  <li>Within 72 hours of travel or a no-show: no refund</li>
                </ul>
              </section>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        .pdf-only {
          display: none;
        }

        .pdf-day {
          break-inside: auto;
          page-break-inside: auto;
        }

        .pdf-day + .pdf-day {
          break-before: auto;
          page-break-before: auto;
        }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: #fff !important;
          }
          body > #root { display: none !important; }
          body > .itinerary-print-container {
            position: static !important;
            inset: auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #fff !important;
            animation: none !important;
          }
          .itinerary-print-container > div {
            min-height: 0 !important;
            padding-bottom: 0 !important;
          }
          .no-print { display: none !important; }
          .screen-only { display: none !important; }
          .print-summary { break-inside: avoid; page-break-inside: avoid; }
          .print-summary,
          .print-summary * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .pdf-price-summary-content {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            grid-template-rows: 1fr !important;
            divide-y: 0 !important;
          }
          .pdf-price-summary-content > div {
            border: 0 !important;
            border-top: 0 !important;
            padding: 8mm !important;
          }
          .pdf-price-summary-content > div + div {
            border-left: 1px solid rgba(255, 255, 255, 0.2) !important;
          }
          .pdf-customer-details {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 4mm !important;
          }
          .pdf-only.pdf-customer-details { display: grid !important; }
          .pdf-only.pdf-package-quote { display: block !important; }
          .pdf-only.pdf-stay-summary { display: block !important; }
          .pdf-customer-details > div {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 3mm !important;
          }
          .pdf-customer-details > div > div {
            min-width: 0 !important;
            padding: 3mm !important;
            border: 1px solid #dbe3ed !important;
            border-radius: 3mm !important;
            background: #fff !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          #pdf-content header > div:last-child,
          #pdf-content header > div:last-child h1,
          #pdf-content header > div:last-child p { color: #fff !important; }
          #pdf-content {
            width: 100% !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          #pdf-content > header {
            height: 100mm !important;
            min-height: 100mm !important;
            overflow: hidden !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          #pdf-content > header > img {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
          }
          #pdf-content > header > .pdf-cover-bottom-fade {
            height: 18mm !important;
            background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.45) 48%, #fff 100%) !important;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
          }
          #pdf-content > header > .pdf-cover-brand {
            top: 10mm !important;
            right: auto !important;
            left: 12mm !important;
            z-index: 2 !important;
          }
          #pdf-content > header > .pdf-cover-caption {
            right: 12mm !important;
            bottom: 18mm !important;
            left: 12mm !important;
            width: auto !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #pdf-content > main {
            width: 100% !important;
            max-width: none !important;
            padding: 8mm 12mm !important;
          }
          .pdf-day {
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          .pdf-day + .pdf-day { break-before: auto; page-break-before: auto; }
          .pdf-day h4,
          .pdf-day .rounded-xl,
          .pdf-day .rounded-2xl { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default FullPageItinerary;
