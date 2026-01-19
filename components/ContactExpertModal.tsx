import React, { useState } from 'react';
import { CONTACT_DETAILS, COUNTRY_CODES } from '../constants';

interface ContactExpertModalProps {
  onClose: () => void;
}

const ContactExpertModal: React.FC<ContactExpertModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    const fullPhoneNumber = `${selectedCountry.code}${phone}`;

    const rawMsg = `*Urgent Global Callback Request - Way2GoHolidays*\n\n` +
      `*A potential traveler is waiting for a designer!*\n` +
      `*Client Phone:* ${fullPhoneNumber}\n` +
      `*Request Type:* Talk to Expert Callback`;

    const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}?text=${encodeURIComponent(rawMsg)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in duration-700">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Request Confirmed!</h3>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Hang tight! One of our travel experts will call you back shortly.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Okay, Thanks!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-700 my-auto max-h-[92vh] flex flex-col">
        <div className="p-6 text-center flex-grow overflow-y-auto no-scrollbar">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-1 tracking-tight text-slate-900">Talk to an Expert</h3>
          <p className="text-gray-500 mb-6 text-xs font-medium">Instant support from our travel designers.</p>
          
          <div className="space-y-4">
            <a 
              href={`tel:${CONTACT_DETAILS.phone}`}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 group"
            >
              <ion-icon name="call" class="text-xl"></ion-icon>
              <span className="uppercase tracking-widest">Call Now</span>
            </a>

            <div className="flex items-center gap-3 text-slate-200">
              <div className="h-px flex-grow bg-slate-100"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">or</span>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Receive a Callback</label>
                <div className="flex space-x-2 mt-1">
                  <select 
                    className="w-20 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-black text-[10px] appearance-none cursor-pointer"
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRY_CODES.find(c => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={`${c.country}-${c.code}`} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input 
                    required
                    type="tel" 
                    className="flex-grow p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-sm text-slate-900 placeholder:text-slate-300" 
                    placeholder="88888 88888"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 group"
              >
                <ion-icon name="headset" class="text-xl"></ion-icon>
                <span className="uppercase tracking-widest">Call Me Back</span>
              </button>
            </form>

            <div className="flex items-center gap-3 text-slate-200">
              <div className="h-px flex-grow bg-slate-100"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">or</span>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>

            <a 
              href={CONTACT_DETAILS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 group"
            >
              <ion-icon name="logo-whatsapp" class="text-xl"></ion-icon>
              <span className="uppercase tracking-widest">Chat with Us</span>
            </a>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContactExpertModal;