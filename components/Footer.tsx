
import React from 'react';
import { CONTACT_DETAILS } from '../constants';
// Fix: Import types to ensure global JSX augmentation for ion-icon is applied
import '../types';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-slate-950 text-slate-300 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white tracking-tighter">Way2GoHolidays</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              We are a dedicated team of travel enthusiasts based in New Delhi, committed to providing the most luxurious and seamless holiday experiences globally.
            </p>
            {/* Social Icons Way2GoHolidays - Footer */}
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/61578600231733/" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
              <a href="https://www.instagram.com/way2goholidays?igsh=MTJ2cm9nMnBvcnl2Zw%3D%3D&utm_source=qr" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
              <a href={`tel:${CONTACT_DETAILS.phone}`} className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl hover:bg-green-600 hover:text-white transition-all transform hover:-translate-y-1">
                <ion-icon name="call-outline"></ion-icon>
              </a>
              <a href={CONTACT_DETAILS.whatsapp} className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1">
                <ion-icon name="logo-whatsapp"></ion-icon>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-white mb-8 uppercase tracking-[0.2em]">Explore</h4>
            <ul className="space-y-4 font-bold text-slate-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Home</a></li>
              <li><a href="#destinations" className="hover:text-blue-500 transition-colors">Destinations</a></li>
              <li><a href="#packages" className="hover:text-blue-500 transition-colors">Our Packages</a></li>
              <li><a href="#about" className="hover:text-blue-500 transition-colors">About Story</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white mb-8 uppercase tracking-[0.2em]">Support</h4>
            <ul className="space-y-4 font-bold text-slate-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Travel Insurance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white mb-8 uppercase tracking-[0.2em]">Our Office</h4>
            <ul className="space-y-6 font-medium text-slate-400">
              <li className="flex items-start">
                <div className="text-blue-500 text-xl mr-4 mt-0.5"><ion-icon name="location-outline"></ion-icon></div>
                <span>{CONTACT_DETAILS.location}, India</span>
              </li>
              <li className="flex items-start">
                <div className="text-blue-500 text-xl mr-4 mt-0.5"><ion-icon name="call-outline"></ion-icon></div>
                <span>{CONTACT_DETAILS.phone}</span>
              </li>
              <li className="flex items-start">
                <div className="text-blue-500 text-xl mr-4 mt-0.5"><ion-icon name="mail-outline"></ion-icon></div>
                <span className="break-all">{CONTACT_DETAILS.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-sm font-bold">
            &copy; {new Date().getFullYear()} Way2GoHolidays. All rights reserved. Designed for elite travelers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
