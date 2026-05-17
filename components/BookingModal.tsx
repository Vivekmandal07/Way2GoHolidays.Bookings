import React, { useState, useRef, useEffect } from 'react';
import { INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS, CONTACT_DETAILS, COUNTRY_CODES } from '../constants';
import { BookingFormData } from '../types';

interface BookingModalProps {
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const allDestinations = [...INTERNATIONAL_DESTINATIONS, ...DOMESTIC_DESTINATIONS,];
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Omit<BookingFormData, 'pax' | 'children' | 'rooms'> & { pax: string, children: string, rooms: string }>({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    rooms: '1',
    pax: '2',
    children: '0',
    childAges: [],
    specialRequest: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideDropdown = dropdownRef.current?.contains(target);
      const isInsideDatePicker = datePickerRef.current?.contains(target);

      if (!isInsideDropdown && !isInsideDatePicker) {
        setIsDropdownOpen(false);
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' });
  };

  const getMonthGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    const grid: Array<{ day: number; inMonth: boolean; monthOffset: number }> = [];

    for (let offset = 0; offset < firstDay; offset += 1) {
      grid.push({ day: prevMonthTotalDays - firstDay + offset + 1, inMonth: false, monthOffset: -1 });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      grid.push({ day, inMonth: true, monthOffset: 0 });
    }

    while (grid.length < 42) {
      grid.push({ day: grid.length - firstDay - totalDays + 1, inMonth: false, monthOffset: 1 });
    }

    return grid;
  };

  const filteredDestinations = allDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChildCountChange = (val: string) => {
    if (val === '') {
      setFormData({ ...formData, children: '' });
      return;
    }
    const count = Math.max(0, parseInt(val) || 0);
    const newAges = Array.from({ length: count }, (_, i) => formData.childAges[i] || '');
    setFormData({ ...formData, children: val, childAges: newAges });
  };

  const handleChildAgeChange = (index: number, age: string) => {
    const newAges = [...formData.childAges];
    newAges[index] = age;
    setFormData({ ...formData, childAges: newAges });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination) {
      alert("Please select a destination from the list.");
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code}${formData.phone}`;
    const childAgesInfo = formData.childAges.length > 0 
      ? `\n*Child Ages:* ${formData.childAges.join(', ')}` 
      : '';

    const message = `*Holiday Booking Inquiry - Way2GoHolidays*\n` +
      `--------------------------------\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${fullPhoneNumber}\n` +
      `*Destination:* ${formData.destination}\n` +
      `*Travel Date:* ${formData.travelDate}\n` +
      `*No of Rooms:* ${formData.rooms}\n` +
      `*Adults:* ${formData.pax}\n` +
      `*Children:* ${formData.children}${childAgesInfo}\n` +
      `*Special Requests:* ${formData.specialRequest || 'None'}\n` +
      `--------------------------------\n`;

    const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  const selectDestination = (name: string) => {
    setFormData({ ...formData, destination: name });
    setSearchQuery(name);
    setIsDropdownOpen(false);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-700">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Request Shared!</h3>
          <button onClick={onClose} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold transition-all shadow-xl">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-700 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header - More Compact */}
        <div className="flex justify-between items-center px-6 sm:px-10 py-5 bg-gradient-to-r from-blue-50/30 to-white border-b border-blue-100 shrink-0 rounded-t-3xl">
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-[#0B1D4B] tracking-tight">Book Your Holiday</h3>
            <p className="text-blue-500 font-bold text-[9px] uppercase tracking-wider">Free & easy booking service</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required type="text" 
                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20  transition-all font-bold text-sm text-black placeholder:text-slate-300"
                placeholder="Ex: Subodh Mandal"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
              <div className="flex items-stretch border-2 border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/20 transition-all overflow-hidden bg-slate-50/50 shadow-sm">
                <select 
                  className="bg-slate-100/50 px-3 py-3 font-bold text-black cursor-pointer text-xs focus:outline-none"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = COUNTRY_CODES.find(c => c.code === e.target.value);
                    if (found) setSelectedCountry(found);
                  }}
                >
                  {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
                <input 
                  required type="tel" 
                  className="flex-grow px-5 py-3 bg-transparent font-bold text-sm text-black placeholder:text-slate-300 focus:outline-none"
                  placeholder="7303402841"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required type="email" 
                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/20  transition-all font-bold text-sm text-black placeholder:text-slate-300"
                placeholder="way2goholidays.bookings@gmail.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative space-y-1" ref={dropdownRef}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Destination</label>
              <input 
                required type="text" 
                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500  transition-all font-bold text-sm text-black placeholder:text-slate-300"
                placeholder="Where to?"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={e => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
              />
              {isDropdownOpen && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-40 overflow-y-auto ring-1 ring-black/5">
                  {filteredDestinations.map(d => (
                    <button key={d.id} type="button" className="w-full text-left px-5 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-0 font-bold text-black text-xs transition-colors" onClick={() => selectDestination(d.name)}>
                      {d.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1 relative" ref={datePickerRef}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Travel Date</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  readOnly
                  className="w-full px-5 py-3 pr-14 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-sm text-black cursor-pointer"
                  placeholder="DD/MM/YYYY"
                  value={formatDisplayDate(formData.travelDate)}
                  onFocus={() => {
                    setIsDatePickerOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  onClick={() => {
                    setIsDatePickerOpen(true);
                    setIsDropdownOpen(false);
                  }}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              {isDatePickerOpen && (
                <div className="absolute left-0 right-0 z-[110] mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        const prev = new Date(calendarDate);
                        prev.setMonth(calendarDate.getMonth() - 1);
                        setCalendarDate(prev);
                      }}
                      className="h-10 w-10 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                    >
                      ‹
                    </button>
                    <div className="text-sm font-black uppercase tracking-[0.22em] text-slate-700">Today</div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = new Date(calendarDate);
                        next.setMonth(calendarDate.getMonth() + 1);
                        setCalendarDate(next);
                      }}
                      className="h-10 w-10 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                    >
                      ›
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {(() => {
                      const nextMonth = new Date(calendarDate);
                      nextMonth.setMonth(calendarDate.getMonth() + 1);
                      const daysFirst = getMonthGrid(calendarDate.getFullYear(), calendarDate.getMonth());
                      const daysNext = getMonthGrid(nextMonth.getFullYear(), nextMonth.getMonth());
                      const selectedDate = formData.travelDate ? new Date(formData.travelDate) : null;

                      const renderMonth = (monthDate: Date, days: Array<{ day: number; inMonth: boolean; monthOffset: number }>) => (
                        <div className="space-y-3">
                          <div className="text-center text-sm font-bold text-slate-900">
                            {monthDate.toLocaleDateString('default', { month: 'short', year: 'numeric' })}
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-[10px] uppercase text-slate-400">
                            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
                              <div key={day} className="text-center font-semibold">{day}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {days.map((cell, index) => {
                              const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + cell.monthOffset, cell.day);
                              const isSelected = selectedDate && selectedDate.toDateString() === cellDate.toDateString();
                              return (
                                <button
                                  key={`${monthDate.getMonth()}-${index}`}
                                  type="button"
                                  onClick={() => {
                                    const selected = cellDate;
                                    setFormData({ ...formData, travelDate: formatDateString(selected) });
                                    setIsDatePickerOpen(false);
                                  }}
                                  className={`h-10 rounded-2xl text-xs font-bold transition ${cell.inMonth ? 'cursor-pointer' : 'cursor-default'} ${isSelected ? 'bg-blue-500 text-white' : cell.inMonth ? 'text-slate-700 hover:bg-blue-50' : 'text-slate-300'} ${cell.inMonth ? '' : 'bg-slate-50'}`}
                                >
                                  {cell.day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );

                      return (
                        <>
                          {renderMonth(calendarDate, daysFirst)}
                          {renderMonth(nextMonth, daysNext)}
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 grid grid-cols-4 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Number of Rooms</label>
                <input required type="number" min="1" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-sm text-black placeholder:text-slate-300" placeholder="Ex: 2" value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Adults</label>
                <input required type="number" min="1" className="w-full px-2 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-center font-bold text-black text-sm" value={formData.pax} onChange={e => setFormData({...formData, pax: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Children</label>
                <input type="number" min="0" className="w-full px-2 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-center font-bold text-black text-sm" value={formData.children} onChange={e => handleChildCountChange(e.target.value)} />
              </div>
            </div>

            {parseInt(formData.children) > 0 && (
              <div className="w-full bg-blue-50/10 p-3 rounded-2xl border border-blue-100 flex flex-wrap gap-3 animate-in fade-in duration-300 shadow-inner">
                {formData.childAges.map((age, i) => (
                  <div key={i} className="flex flex-col space-y-1">
                    <span className="text-[8px] font-bold text-blue-500 uppercase ml-1 tracking-wider">Child {i+1} Age</span>
                    <input 
                      required type="number" min="0" max="17" 
                      className="w-14 px-2 py-2 border border-slate-200 rounded-lg text-center font-bold text-xs text-black focus:border-blue-500 outline-none bg-white" 
                      value={age} 
                      onChange={e => handleChildAgeChange(i, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="md:col-span-2">
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferences</label>
                <textarea className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-0 font-medium text-sm text-slate-400 placeholder:text-slate-300 transition-all resize-y" 
                          placeholder="Special Request - Like Honeymoon Inclusions, Candle Light Dinner or bed Decoration, Hotel Category - 3 Star, 4 Star, 5 Star, etc." 
                          value={formData.specialRequest} 
                          onChange={e => setFormData({...formData, specialRequest: e.target.value})} 
                          style={{minHeight: '120px'}} />
              </div>
            </div>
          </div>

          <div className="pt-2 sticky bottom-0 bg-white pb-2">
            <button 
              type="submit" 
              className="w-full bg-[#24D366] text-white py-4 rounded-full font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-200/50 flex items-center justify-center space-x-3 uppercase tracking-widest"
            >
              <span>CONFIRM TRIP INQUIRY</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.12.552 4.189 1.598 6.04L0 24l6.135-1.61a11.802 11.802 0 005.912 1.569h.005c6.638 0 12.039-5.404 12.042-12.041a11.79 11.79 0 00-3.483-8.498z"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;