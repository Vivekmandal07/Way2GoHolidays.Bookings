
import React, { useState } from 'react';
import { COUNTRY_CODES } from '../constants';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    alert(`${isRegister ? 'Account Created' : 'Login Successful'} for ${method === 'email' ? formData.email : selectedCountry.code + formData.phone}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-12 text-center text-white relative">
          <div className="absolute top-6 right-6">
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">Way2GoHolidays</h2>
          <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">100% Free Access</p>
          </div>
          <p className="mt-4 text-blue-100 text-xs font-medium">Join our elite community for premium travel deals.</p>
        </div>

        {/* Method Toggle */}
        <div className="flex p-2 bg-slate-50 border-b border-slate-100">
          <button 
            onClick={() => setMethod('email')}
            className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${method === 'email' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-400'}`}
          >
            Email
          </button>
          <button 
            onClick={() => setMethod('phone')}
            className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${method === 'phone' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-400'}`}
          >
            Mobile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            {isRegister && (
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                 <input 
                   required
                   type="text"
                   className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                   placeholder="Your Name"
                   value={formData.fullName}
                   onChange={e => setFormData({...formData, fullName: e.target.value})}
                 />
               </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                {method === 'email' ? 'Email ID' : 'Mobile Number'}
              </label>
              {method === 'email' ? (
                <input 
                  required
                  type="email"
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-sm"
                  placeholder="way2goholidays.bookings.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <div className="flex space-x-2">
                  <div className="relative w-28">
                    <select 
                      className="w-full px-3 py-5 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-black text-[11px] appearance-none cursor-pointer text-center"
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const found = COUNTRY_CODES.find(c => c.code === e.target.value);
                        if (found) setSelectedCountry(found);
                      }}
                    >
                      {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <input 
                    required
                    type="tel"
                    className="flex-grow px-6 py-5 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-sm"
                    placeholder="7303402841"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L5.146 5.147m14.038 14.038l-4.242-4.242m-2.434-2.434l-.822-.822m0 0L19.543 12a10.07 10.07 0 01-1.071 2.586m-5.858-5.858L15.147 5.146" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {!isRegister && (
            <div className="flex justify-end">
              <button type="button" className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot Access Key?</button>
            </div>
          )}

          <div className="space-y-4">
            <button 
              type="submit"
              className="w-full bg-[#1148CB] text-white py-5 rounded-full font-black text-xl uppercase tracking-[0.2em] shadow-2xl transition-all hover:brightness-110 active:scale-[0.98] animate-wave-out"
            >
              {isRegister ? 'SIGN UP' : 'SIGN IN'}
            </button>
          </div>

          <div className="pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs font-bold">
              {isRegister ? 'Welcome back?' : "New to Way2Go?"}
              <button 
                type="button" 
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-blue-700 font-black uppercase tracking-widest border-b-2 border-blue-100 hover:border-blue-700 transition-all pb-0.5"
              >
                {isRegister ? 'Log In' : 'Register Free'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
