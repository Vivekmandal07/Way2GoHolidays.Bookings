
import React, { useState, useRef, useEffect } from 'react';
import { INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS, CONTACT_DETAILS, COUNTRY_CODES } from '../constants';
import { BookingFormData } from '../types';

interface BookingModalProps {
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const allDestinations = [...INTERNATIONAL_DESTINATIONS, ...DOMESTIC_DESTINATIONS];
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Omit<BookingFormData, 'pax' | 'children'> & { pax: string, children: string }>({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    pax: '1',
    children: '0',
    childAges: [],
    specialRequest: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      `*Adults:* ${formData.pax}\n` +
      `*Children:* ${formData.children}${childAgesInfo}\n` +
      `*Special:* ${formData.specialRequest || 'None'}\n` +
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
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Request Shared!</h3>
          <p className="text-slate-600 mb-8">Redirecting to WhatsApp to finalize your trip.</p>
          <button onClick={onClose} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold transition-all shadow-xl">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-700">
        
        {/* Friendly Header */}
        <div className="flex justify-between items-start px-6 md:px-12 pt-8 md:pt-10 pb-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">Book Your Holiday</h3>
            <p className="text-blue-500 font-bold text-xs mt-1 uppercase tracking-wider">Free & easy booking service</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-white/50 rounded-full">
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 md:px-12 py-8 md:py-12 space-y-6 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
            
            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required type="text" 
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-900"
                placeholder="Ex: Rahul Sharma"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required type="email" 
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-900"
                placeholder="rahul@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
              <div className="flex items-stretch border border-slate-300 rounded-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all overflow-hidden">
                <select 
                  className="bg-slate-50 border-r border-slate-300 px-3 md:px-4 py-3 md:py-4 font-bold text-slate-900 outline-none cursor-pointer text-sm"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = COUNTRY_CODES.find(c => c.code === e.target.value);
                    if (found) setSelectedCountry(found);
                  }}
                >
                  {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
                <input 
                  required type="tel" 
                  className="flex-grow px-4 md:px-6 py-3 md:py-4 outline-none font-bold text-slate-900 placeholder:text-slate-400"
                  placeholder="88888 88888"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>

            <div className="relative space-y-1 md:space-y-2" ref={dropdownRef}>
              <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">Destination</label>
              <input 
                required type="text" 
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                placeholder="Where to?"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={e => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
              />
              {isDropdownOpen && (
                <div className="absolute z-[110] w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  {filteredDestinations.map(d => (
                    <button key={d.id} type="button" className="w-full text-left px-6 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-0 font-bold text-slate-800" onClick={() => selectDestination(d.name)}>
                      {d.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">Travel Date</label>
              <input required type="date" className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-300 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-900" value={formData.travelDate} onChange={e => setFormData({...formData, travelDate: e.target.value})} />
            </div>

            {/* Responsive grid for Pax */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="space-y-1 md:space-y-2">
                <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest text-center block">Adults</label>
                <input required type="number" min="1" className="w-full px-3 md:px-4 py-3 md:py-4 bg-white border border-slate-300 rounded-xl text-center font-black text-slate-900" value={formData.pax} onChange={e => setFormData({...formData, pax: e.target.value})} />
              </div>
              <div className="space-y-1 md:space-y-2">
                <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest text-center block">Children</label>
                <input type="number" min="0" className="w-full px-3 md:px-4 py-3 md:py-4 bg-white border border-slate-300 rounded-xl text-center font-black text-slate-900" value={formData.children} onChange={e => handleChildCountChange(e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1 md:space-y-2">
                <label className="text-[10px] md:text-[12px] font-bold text-slate-500 uppercase tracking-widest">Special Preferences</label>
                <input type="text" className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-300 rounded-xl focus:border-blue-500 font-bold text-slate-900 placeholder:text-slate-400" placeholder="Honey Moon, Veg, etc." value={formData.specialRequest} onChange={e => setFormData({...formData, specialRequest: e.target.value})} />
              </div>
            </div>

            {/* Dynamic Child Ages */}
            {parseInt(formData.children) > 0 && (
              <div className="md:col-span-2 bg-blue-50/40 p-4 md:p-8 rounded-2xl border border-blue-100 flex flex-wrap gap-4 md:gap-6 animate-in fade-in duration-300">
                {formData.childAges.map((age, i) => (
                  <div key={i} className="flex flex-col space-y-1 md:space-y-2">
                    <span className="text-[9px] md:text-[11px] font-bold text-blue-500 uppercase ml-1 tracking-wider">Child {i+1} Age</span>
                    <input 
                      required type="number" min="0" max="17" 
                      className="w-20 md:w-28 px-3 md:px-4 py-2.5 md:py-3.5 border border-slate-300 rounded-xl text-center font-bold text-slate-900 focus:border-blue-500 outline-none bg-white shadow-sm" 
                      value={age} 
                      onChange={e => handleChildAgeChange(i, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#25D366] text-white py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black text-lg md:text-2xl hover:brightness-110 transition-all shadow-xl flex items-center justify-center space-x-2 md:space-x-4 active:scale-[0.98]"
          >
            <span>Confirm Trip Inquiry</span>
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.12.552 4.189 1.598 6.04L0 24l6.135-1.61a11.802 11.802 0 005.912 1.569h.005c6.638 0 12.039-5.404 12.042-12.041a11.79 11.79 0 00-3.483-8.498z"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
