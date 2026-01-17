
import React, { useState } from 'react';
import { PackageFormData } from '../types';
import { CONTACT_DETAILS, COUNTRY_CODES } from '../constants';

interface CreatePackageModalProps {
  onClose: () => void;
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [formData, setFormData] = useState<Omit<PackageFormData, 'pax' | 'children'> & { pax: string, children: string }>({
    name: '',
    leavingFrom: '',
    destination: '',
    pax: '1',
    children: '0',
    childAges: [],
    travelDate: ''
  });
  const [clientPhone, setClientPhone] = useState('');

  const handleChildCountChange = (val: string) => {
    const count = Math.max(0, parseInt(val) || 0);
    const newAges = Array.from({ length: count }, (_, i) => formData.childAges[i] || '');
    setFormData({ ...formData, children: val, childAges: newAges });
  };

  const handleChildAgeChange = (index: number, age: string) => {
    const newAges = [...formData.childAges];
    newAges[index] = age;
    setFormData({ ...formData, children: formData.children, childAges: newAges });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhoneNumber = `${selectedCountry.code}${clientPhone}`;
    const childAgesInfo = formData.childAges.length > 0 
      ? `\n*Child Ages:* ${formData.childAges.join(', ')}` 
      : '';

    const rawMsg = `*Custom Itinerary Request - Way2GoHolidays*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*WhatsApp:* ${fullPhoneNumber}\n` +
      `*From:* ${formData.leavingFrom}\n` +
      `*To:* ${formData.destination}\n` +
      `*Date:* ${formData.travelDate}\n` +
      `*Adults:* ${formData.pax}\n` +
      `*Children:* ${formData.children}${childAgesInfo}\n`;

    const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}?text=${encodeURIComponent(rawMsg)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-700">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Itinerary Saved!</h3>
          <button onClick={onClose} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-3xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-700 my-4">
        
        {/* Header Section */}
        <div className="flex justify-between items-start px-5 sm:px-12 pt-8 sm:pt-10 pb-4 sm:pb-6 bg-gradient-to-r from-orange-50/30 to-white border-b border-orange-100">
          <div>
            <h3 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">Design Your Route</h3>
            <p className="text-orange-500 font-bold text-[8px] sm:text-[11px] mt-1 sm:mt-2 uppercase tracking-wider">Plan Every Detail of Your Journey</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors bg-white/80 rounded-full hover:shadow-md">
            <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-5 sm:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-6">
            
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
              <input 
                required type="text" 
                className="w-full px-5 sm:px-6 py-3.5 sm:py-4.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50/30 outline-none transition-all font-bold text-black placeholder:text-slate-300 shadow-sm" 
                placeholder="Ex: John Doe" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
              <div className="flex items-stretch w-full border border-slate-200 rounded-xl sm:rounded-2xl focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-50/30 transition-all overflow-hidden bg-slate-50/50 shadow-sm">
                <select 
                  className="bg-slate-100/50 border-r border-slate-200 px-3 sm:px-5 py-3 font-bold text-black outline-none cursor-pointer text-xs sm:text-sm" 
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
                  className="flex-grow px-5 sm:px-6 py-3.5 sm:py-4.5 bg-transparent outline-none font-bold text-black placeholder:text-slate-300 min-w-0" 
                  placeholder="7303402841" 
                  value={clientPhone} 
                  onChange={e => setClientPhone(e.target.value.replace(/\D/g, ''))} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Departure City</label>
              <input 
                required type="text" 
                className="w-full px-5 sm:px-6 py-3.5 sm:py-4.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-black placeholder:text-slate-300 shadow-sm" 
                placeholder="Leaving from..." 
                value={formData.leavingFrom} 
                onChange={e => setFormData({...formData, leavingFrom: e.target.value})} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Destination</label>
              <input 
                required type="text" 
                className="w-full px-5 sm:px-6 py-3.5 sm:py-4.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-black placeholder:text-slate-300 shadow-sm" 
                placeholder="Going to..." 
                value={formData.destination} 
                onChange={e => setFormData({...formData, destination: e.target.value})} 
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-3 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">Travel Date</label>
                <input 
                  required type="date" 
                  className="w-full px-3 sm:px-6 py-3 sm:py-4.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl focus:border-orange-500 outline-none font-bold text-black shadow-sm text-[10px] sm:text-sm" 
                  value={formData.travelDate} 
                  onChange={e => setFormData({...formData, travelDate: e.target.value})} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">Adults</label>
                <input 
                  required type="number" min="1" 
                  className="w-full px-2 sm:px-4 py-3 sm:py-4.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl text-center font-bold text-black shadow-sm" 
                  value={formData.pax} 
                  onChange={e => setFormData({...formData, pax: e.target.value})} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">Children</label>
                <input 
                  type="number" min="0" 
                  className="w-full px-2 sm:px-4 py-3 sm:py-4.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl text-center font-bold text-black shadow-sm" 
                  value={formData.children} 
                  onChange={e => handleChildCountChange(e.target.value)} 
                />
              </div>
            </div>

            {parseInt(formData.children) > 0 && (
              <div className="md:col-span-2 bg-orange-50/10 p-4 sm:p-6 rounded-[2rem] border border-orange-100 flex flex-wrap gap-3 sm:gap-5 animate-in fade-in duration-300 shadow-inner">
                {formData.childAges.map((age, i) => (
                  <div key={i} className="flex flex-col space-y-1.5">
                    <span className="text-[8px] sm:text-[9px] font-bold text-orange-500 uppercase ml-1 tracking-wider">Child {i+1}</span>
                    <input 
                      required type="number" min="0" max="17" 
                      className="w-16 sm:w-20 px-3 py-2 sm:py-3 border border-slate-200 rounded-xl text-center font-bold text-black focus:border-orange-500 outline-none bg-white shadow-sm" 
                      value={age} 
                      onChange={e => handleChildAgeChange(i, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 sm:pt-6">
            <button 
              type="submit"
              className="w-full bg-[#F97316] text-white py-4 sm:py-6 rounded-full font-black text-lg sm:text-2xl hover:scale-[1.03] hover:brightness-105 transition-all shadow-2xl shadow-orange-200/50 flex items-center justify-center space-x-3 sm:space-x-4 active:scale-95 group uppercase tracking-widest"
            >
              <span className="tracking-tight transition-transform duration-300 group-hover:scale-110">Design via WhatsApp</span>
              <div className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.12.552 4.189 1.598 6.04L0 24l6.135-1.61a11.802 11.802 0 005.912 1.569h.005c6.638 0 12.039-5.404 12.042-12.041a11.79 11.79 0 00-3.483-8.498z"/></svg>
              </div>
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .py-4\\.5 {
          padding-top: 1.125rem;
          padding-bottom: 1.125rem;
        }
      `}</style>
    </div>
  );
};

export default CreatePackageModal;
