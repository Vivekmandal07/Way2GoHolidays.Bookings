import React, { useState, useEffect } from 'react';
import { PackageFormData } from '../types';
import { CONTACT_DETAILS, COUNTRY_CODES, INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS } from '../constants';

const TRIP_TYPES = ['Solo Trip', 'Honeymoon Trip', 'Family Trip', 'Customized Package', 'Adventure Trip', 'Group Tour', 'Weekend Getaway', 'Luxury Vacation', 'Budget Travel', 'Cultural Exploration', 'Beach Holiday', 'Nature Retreat', 'Road Trip', 'Cruise Vacation', 'Wellness Retreat'];
const HOTEL_CATEGORIES = ['2 Star', '3 Star', '4 Star', '5 Star'];
const NIGHT_OPTIONS = ['1N/2D', '2N/3D', '3N/4D', '4N/5D', '5N/6D', '6N/7D', '7N/8D', '8N/9D', '9N/10D', '10N/11D', '11N/12D', '12N/13D', '13N/14D', '14N/15D'];
const BUDGET_RANGES = ['₹15K - ₹25K', '₹25K - ₹35K', '₹35K - ₹45K', '₹45K - ₹50K', '₹50K - ₹60K', '₹60K - ₹75K', '₹75K - ₹1L', '₹1L - ₹1.5L', '₹1.5L - ₹2L', '₹2L - ₹3L', '₹3L - ₹5L', '₹5L - ₹7L', '₹7L - ₹10L', '₹10L+', 'Customazation Budget'];
const FLIGHT_OPTIONS = ['With Flight', 'Without Flight', 'We Have Booked the Flight'];

interface RaiseYourTripProps {
  onClose: () => void;
}

interface RaisedQuery {
  id: string;
  name: string;
  phone: string;
  leavingFrom: string;
  destination: string;
  pax: string;
  children: string;
  childAges: string[];
  travelDate: string;
  tripType: string;
  hotelCategory: string;
  noOfNights: string;
  budgetRange: string;
  flightOptions: string;
  submittedAt: string;
}

const RaiseYourTrip: React.FC<RaiseYourTripProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [viewMode, setViewMode] = useState<'form' | 'queries'>('form');
  const [raisedQueries, setRaisedQueries] = useState<RaisedQuery[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const allDestinations = [...INTERNATIONAL_DESTINATIONS, ...DOMESTIC_DESTINATIONS];
  const [searchQueryDest, setSearchQueryDest] = useState('');
  const [isDropdownOpenDest, setIsDropdownOpenDest] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const dropdownRefDest = React.useRef<HTMLDivElement>(null);
  const datePickerRef = React.useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Omit<PackageFormData, 'pax' | 'children'> & { pax: string, children: string }>({
    name: '',
    leavingFrom: '',
    destination: '',
    pax: '1',
    children: '0',
    childAges: [],
    travelDate: '',
    tripType: '',
    hotelCategory: '',
    noOfNights: '',
    budgetRange: '',
    flightOptions: ''
  });
  const [clientPhone, setClientPhone] = useState('');

  // Load queries from localStorage
  useEffect(() => {
    const savedQueries = localStorage.getItem('raisedQueries');
    if (savedQueries) {
      try {
        setRaisedQueries(JSON.parse(savedQueries));
      } catch (error) {
        console.error('Error loading queries:', error);
      }
    }
  }, []);

  const saveQueriesToStorage = (queries: RaisedQuery[]) => {
    localStorage.setItem('raisedQueries', JSON.stringify(queries));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!clientPhone.trim()) errors.phone = 'Phone number is required';
    if (!formData.leavingFrom.trim()) errors.leavingFrom = 'Departure city is required';
    if (!formData.destination.trim()) errors.destination = 'Destination is required';
    if (!formData.travelDate) errors.travelDate = 'Travel date is required';
    if (!formData.pax || parseInt(formData.pax) < 1) errors.pax = 'At least 1 adult is required';
    if (!formData.tripType) errors.tripType = 'Trip type is required';
    if (!formData.hotelCategory) errors.hotelCategory = 'Hotel category is required';
    if (!formData.noOfNights) errors.noOfNights = 'Number of nights is required';
    if (!formData.budgetRange) errors.budgetRange = 'Budget range is required';
    if (!formData.flightOptions) errors.flightOptions = 'Flight options is required';

    // Validate child ages if children count > 0
    if (parseInt(formData.children) > 0) {
      const childrenCount = parseInt(formData.children);
      for (let i = 0; i < childrenCount; i++) {
        if (!formData.childAges[i] || formData.childAges[i].trim() === '') {
          errors[`childAge${i}`] = `Child ${i + 1} age is required`;
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== '' &&
      clientPhone.trim() !== '' &&
      formData.leavingFrom.trim() !== '' &&
      formData.destination.trim() !== '' &&
      formData.travelDate !== '' &&
      parseInt(formData.pax) >= 1 &&
      formData.tripType !== '' &&
      formData.hotelCategory !== '' &&
      formData.noOfNights !== '' &&
      formData.budgetRange !== '' &&
      formData.flightOptions !== '' &&
      (parseInt(formData.children) === 0 || formData.childAges.every(age => age.trim() !== ''))
    );
  };

  const deleteQuery = (id: string) => {
    const updatedQueries = raisedQueries.filter(q => q.id !== id);
    setRaisedQueries(updatedQueries);
    saveQueriesToStorage(updatedQueries);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
  };

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

  // destination search helpers
  const filteredDestinations = allDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQueryDest.toLowerCase())
  );

  const selectDestination = (name: string) => {
    setFormData({ ...formData, destination: name });
    setSearchQueryDest(name);
    setIsDropdownOpenDest(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRefDest.current && !dropdownRefDest.current.contains(event.target as Node)) {
        setIsDropdownOpenDest(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      return;
    }

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
      `*Children:* ${formData.children}${childAgesInfo}\n` +
      `*Trip Type:* ${formData.tripType}\n` +
      `*Hotel Category:* ${formData.hotelCategory}\n` +
      `*Nights:* ${formData.noOfNights}\n` +
      `*Budget:* ${formData.budgetRange}\n` +
      `*Flight Options:* ${formData.flightOptions}\n\n`;

    // Save query to localStorage
    const newQuery: RaisedQuery = {
      id: Date.now().toString(),
      name: formData.name,
      phone: fullPhoneNumber,
      leavingFrom: formData.leavingFrom,
      destination: formData.destination,
      pax: formData.pax,
      children: formData.children,
      childAges: formData.childAges,
      travelDate: formData.travelDate,
      tripType: formData.tripType,
      hotelCategory: formData.hotelCategory,
      noOfNights: formData.noOfNights,
      budgetRange: formData.budgetRange,
      flightOptions: formData.flightOptions,
      submittedAt: new Date().toLocaleString('en-GB'),
    };

    const updatedQueries = [newQuery, ...raisedQueries];
    setRaisedQueries(updatedQueries);
    saveQueriesToStorage(updatedQueries);

    const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}?text=${encodeURIComponent(rawMsg)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 text-center animate-in zoom-in duration-700">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Itinerary Saved! -  Our Expert Will Connect You Soon</h3>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-xl font-bold transition-all">Close</button>
            <button onClick={() => { setSubmitted(false); setViewMode('queries'); }} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold transition-all shadow-xl">View All Queries</button>
          </div>
        </div>
      </div>
    );
  }

  // Queries View
  if (viewMode === 'queries') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-visible animate-in zoom-in duration-700 my-auto max-h-[92vh] flex flex-col">
          
          {/* Header Section */}
          <div className="flex justify-between items-center px-6 sm:px-10 py-5 bg-gradient-to-r from-orange-50/30 to-white border-b border-orange-100 shrink-0 rounded-t-3xl">
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Raised Queries</h3>
              <p className="text-orange-500 font-bold text-[9px] uppercase tracking-wider">View all your submitted trip requests</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 sm:px-10 py-6 overflow-y-auto flex-1">
            {raisedQueries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-slate-500 font-bold">No queries yet. Raise your first trip request!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  // Group queries by phone number
                  const groupedByPhone = raisedQueries.reduce((acc, query) => {
                    const phone = query.phone;
                    if (!acc[phone]) {
                      acc[phone] = [];
                    }
                    acc[phone].push(query);
                    return acc;
                  }, {} as Record<string, RaisedQuery[]>);

                  return Object.entries(groupedByPhone).map(([phone, queries], groupIndex) => (
                    <div key={phone} className="bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-200 rounded-3xl overflow-hidden">
                      {/* Phone Number Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {groupIndex + 1}
                            </div>
                            <div>
                              <p className="text-white font-black text-lg">Customer #{groupIndex + 1}</p>
                              <p className="text-blue-100 font-bold text-sm">{phone}</p>
                            </div>
                          </div>
                          <div className="bg-white/20 text-white px-4 py-2 rounded-full font-bold">
                            {queries.length} {queries.length === 1 ? 'Query' : 'Queries'}
                          </div>
                        </div>
                      </div>

                      {/* Queries for this phone */}
                      <div className="p-6 space-y-4">
                        {queries.map((query, queryIndex) => (
                          <div key={query.id} className="bg-white border border-blue-100 rounded-2xl p-5 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                  {queryIndex + 1}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900">{query.name}</p>
                                  <p className="text-slate-500 text-xs font-bold">{query.submittedAt}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => deleteQuery(query.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mb-1">From</p>
                                <p className="font-bold text-slate-900 text-xs">{query.leavingFrom}</p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mb-1">To</p>
                                <p className="font-bold text-slate-900 text-xs">{query.destination}</p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mb-1">Date</p>
                                <p className="font-bold text-slate-900 text-xs">{formatDisplayDate(query.travelDate)}</p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mb-1">Trip Type</p>
                                <p className="font-bold text-slate-900 text-xs">{query.tripType}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className="text-xs">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adults</p>
                                <p className="font-bold text-slate-900">{query.pax}</p>
                              </div>
                              <div className="text-xs">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Children</p>
                                <p className="font-bold text-slate-900">{query.children}</p>
                              </div>
                              <div className="text-xs">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nights</p>
                                <p className="font-bold text-slate-900">{query.noOfNights}</p>
                              </div>
                              <div className="text-xs">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                                <p className="font-bold text-slate-900">{query.budgetRange}</p>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                              <div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hotel</p>
                                <p className="font-bold text-slate-900">{query.hotelCategory}</p>
                              </div>
                              <div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Flight</p>
                                <p className="font-bold text-slate-900">{query.flightOptions}</p>
                              </div>
                              {query.childAges.length > 0 && (
                                <div>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Children Ages</p>
                                  <p className="font-bold text-slate-900">{query.childAges.join(', ')} yrs</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>

          <div className="px-6 sm:px-10 py-4 bg-gradient-to-r from-orange-50/30 to-white border-t border-orange-100 shrink-0 flex gap-3 rounded-b-3xl">
            <button 
              onClick={() => { setViewMode('form'); setSubmitted(false); }}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-orange-100/50"
            >
              Raise New Query
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-visible animate-in zoom-in duration-700 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Section */}
        <div className="flex justify-between items-center px-6 sm:px-10 py-5 bg-gradient-to-r from-orange-50/30 to-white border-b border-orange-100 shrink-0 rounded-t-3xl">
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Your Trip, Your Way - Plan it Your Way!</h3>
            <p className="text-orange-500 font-bold text-[9px] uppercase tracking-wider">Write the Details & Plan Every Detail of Your Journey</p>
          </div>
          <div className="flex gap-2">
            {raisedQueries.length > 0 && (
              <button 
                onClick={() => setViewMode('queries')}
                className="p-2 text-orange-500 hover:bg-orange-50 transition-colors bg-orange-50/50 rounded-full relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{raisedQueries.length}</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
              <input 
                required type="text" 
                className={`w-full px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none transition-all font-bold text-sm text-black placeholder:text-slate-400 ${validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                placeholder="Ex: John Doe" 
                value={formData.name} 
                onChange={e => {
                  setFormData({...formData, name: e.target.value});
                  if (validationErrors.name) setValidationErrors({...validationErrors, name: ''});
                }} 
              />
              {validationErrors.name && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
              <div className={`flex items-stretch w-full border-2 rounded-xl focus-within:ring-4 focus-within:ring-orange-50/20 transition-all overflow-hidden bg-slate-50/50 shadow-sm ${validationErrors.phone ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 focus-within:border-orange-500'}`}>
                <select 
                  className="bg-slate-100/50 border-r border-slate-200 px-2 py-3 font-bold text-black outline-none cursor-pointer text-xs" 
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
                  className="flex-grow px-5 py-3 bg-transparent outline-none font-bold text-sm text-black placeholder:text-slate-300 min-w-0" 
                  placeholder="7303402841" 
                  value={clientPhone} 
                  onChange={e => {
                    setClientPhone(e.target.value.replace(/\D/g, ''));
                    if (validationErrors.phone) setValidationErrors({...validationErrors, phone: ''});
                  }}
                />
              </div>
              {validationErrors.phone && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.phone}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Departure City</label>
              <input 
                required type="text" 
                className={`w-full px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none transition-all font-bold text-sm text-black placeholder:text-slate-300 ${validationErrors.leavingFrom ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                placeholder="Leaving from..." 
                value={formData.leavingFrom} 
                onChange={e => {
                  setFormData({...formData, leavingFrom: e.target.value});
                  if (validationErrors.leavingFrom) setValidationErrors({...validationErrors, leavingFrom: ''});
                }} 
              />
              {validationErrors.leavingFrom && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.leavingFrom}</p>}
            </div>

            <div className="relative space-y-1" ref={dropdownRefDest}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Destination</label>
              <input
                required
                type="text"
                className={`w-full px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none transition-all font-bold text-sm text-black placeholder:text-slate-300 ${validationErrors.destination ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                placeholder="Going to..."
                value={searchQueryDest}
                onFocus={() => setIsDropdownOpenDest(true)}
                onChange={e => { 
                  setSearchQueryDest(e.target.value); 
                  setIsDropdownOpenDest(true);
                  if (validationErrors.destination) setValidationErrors({...validationErrors, destination: ''});
                }}
              />

              {isDropdownOpenDest && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-40 overflow-y-auto ring-1 ring-black/5">
                  {filteredDestinations.map(d => (
                    <button key={d.id} type="button" className="w-full text-left px-5 py-3 hover:bg-orange-50 border-b border-slate-50 last:border-0 font-bold text-black text-xs transition-colors" onClick={() => selectDestination(d.name)}>
                      {d.name}
                    </button>
                  ))}
                </div>
              )}
              {validationErrors.destination && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.destination}</p>}
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              <div className="space-y-1 relative" ref={datePickerRef}>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Travel Date</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    readOnly
                    className={`w-full px-2 py-3 pr-12 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none font-bold text-black text-xs transition-all cursor-pointer ${validationErrors.travelDate ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                    placeholder="DD/MM/YYYY"
                    value={formatDisplayDate(formData.travelDate)}
                    onFocus={() => setIsDatePickerOpen(true)}
                    onClick={() => setIsDatePickerOpen(true)}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
                {validationErrors.travelDate && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.travelDate}</p>}
                {isDatePickerOpen && (
                  <div className="  mt-3 w-[min(46rem,calc(100vw-1.5rem))] -translate-x-1/6 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5">
                    <div className="flex items-center justify-between mb-5">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = new Date(calendarDate);
                          prev.setMonth(calendarDate.getMonth());
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {(() => {
                        const nextMonth = new Date(calendarDate);
                        nextMonth.setMonth(calendarDate.getMonth() + 1);
                        const daysFirst = getMonthGrid(calendarDate.getFullYear(), calendarDate.getMonth());
                        const daysNext = getMonthGrid(nextMonth.getFullYear(), nextMonth.getMonth());
                        const selectedDate = formData.travelDate ? new Date(formData.travelDate) : null;

                        const renderMonth = (monthDate: Date, days: Array<{ day: number; inMonth: boolean; monthOffset: number }>) => (
                          <div className="space-y-4 rounded-3xl border border-slate-100 p-4">
                            <div className="text-center text-base font-extrabold text-slate-900">
                              {monthDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-[11px] uppercase text-slate-500">
                              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
                                <div key={day} className="text-center font-semibold">{day}</div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                              {days.map((cell, index) => {
                                const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + cell.monthOffset, cell.day);
                                const isSelected = selectedDate && selectedDate.toDateString() === cellDate.toDateString();
                                return (
                                  <button
                                    key={`${monthDate.getMonth()}-${index}`}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, travelDate: formatDateString(cellDate) });
                                      setIsDatePickerOpen(false);
                                      if (validationErrors.travelDate) setValidationErrors({...validationErrors, travelDate: ''});
                                    }}
                                    className={`h-12 rounded-3xl text-sm font-semibold transition ${cell.inMonth ? 'cursor-pointer' : 'cursor-default'} ${isSelected ? 'bg-orange-500 text-white' : cell.inMonth ? 'text-slate-700 hover:bg-orange-50' : 'text-slate-300'} ${cell.inMonth ? 'bg-white' : 'bg-slate-50'}`}
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
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Adults</label>
                <input 
                  required type="number" min="1" 
                  className={`w-full px-2 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 focus:outline-none text-center font-bold text-black text-sm transition-all ${validationErrors.pax ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                  value={formData.pax} 
                  onChange={e => {
                    setFormData({...formData, pax: e.target.value});
                    if (validationErrors.pax) setValidationErrors({...validationErrors, pax: ''});
                  }} 
                />
                {validationErrors.pax && <p className="text-xs text-red-500 font-bold text-center">{validationErrors.pax}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Children</label>
                <input 
                  type="number" min="0" 
                  className="w-full px-2 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50/20 focus:outline-none text-center font-bold text-black text-sm transition-all" 
                  value={formData.children} 
                  onChange={e => handleChildCountChange(e.target.value)} 
                />
              </div>
            </div>

            {parseInt(formData.children) > 0 && (
              <div className="md:col-span-2 bg-orange-50/10 p-3 rounded-2xl border border-orange-100 flex flex-wrap gap-3 animate-in fade-in duration-300 shadow-inner">
                {formData.childAges.map((age, i) => (
                  <div key={i} className="flex flex-col space-y-1">
                    <span className={`text-[8px] font-bold uppercase ml-1 tracking-wider ${validationErrors[`childAge${i}`] ? 'text-red-500' : 'text-orange-500'}`}>Child {i+1}</span>
                    <input 
                      required type="number" min="0" max="17" 
                      className={`w-14 px-2 py-2 border rounded-lg text-center font-bold text-xs text-black outline-none bg-white shadow-sm ${validationErrors[`childAge${i}`] ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                      value={age} 
                      onChange={e => {
                        handleChildAgeChange(i, e.target.value);
                        if (validationErrors[`childAge${i}`]) setValidationErrors({...validationErrors, [`childAge${i}`]: ''});
                      }}
                    />
                    {validationErrors[`childAge${i}`] && <p className="text-[9px] text-red-500 font-bold text-center">{validationErrors[`childAge${i}`]}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div ref={dropdownRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Trip Type</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'tripType' ? null : 'tripType')}
                className={`w-full text-left px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none font-bold text-sm transition-all flex items-center justify-between ${validationErrors.tripType ? 'border-red-500 focus:border-red-500 text-red-700' : `border-slate-200 focus:border-orange-500 ${formData.tripType ? 'text-black' : 'text-slate-300'}`}`}
              >
                <span>{formData.tripType || 'Select Trip Type'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'tripType' && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-40 overflow-y-auto ring-1 ring-black/5">
                  {TRIP_TYPES.map(option => (
                    <button
                      key={option}
                      type="button"
                      className="w-full text-left px-5 py-3 hover:bg-orange-50 border-b border-slate-50 last:border-0 font-bold text-black text-xs transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, tripType: option });
                        setOpenDropdown(null);
                        if (validationErrors.tripType) setValidationErrors({...validationErrors, tripType: ''});
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {validationErrors.tripType && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.tripType}</p>}
            </div>

            <div className="space-y-1 relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Hotel Category</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'hotelCategory' ? null : 'hotelCategory')}
                className={`w-full text-left px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none font-bold text-sm transition-all flex items-center justify-between ${validationErrors.hotelCategory ? 'border-red-500 focus:border-red-500 text-red-700' : `border-slate-200 focus:border-orange-500 ${formData.hotelCategory ? 'text-black' : 'text-slate-300'}`}`}
              >
                <span>{formData.hotelCategory || 'Select Hotel Category'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'hotelCategory' && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-40 overflow-y-auto ring-1 ring-black/5">
                  {HOTEL_CATEGORIES.map(option => (
                    <button
                      key={option}
                      type="button"
                      className="w-full text-left px-5 py-3 hover:bg-orange-50 border-b border-slate-50 last:border-0 font-bold text-black text-xs transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, hotelCategory: option });
                        setOpenDropdown(null);
                        if (validationErrors.hotelCategory) setValidationErrors({...validationErrors, hotelCategory: ''});
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {validationErrors.hotelCategory && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.hotelCategory}</p>}
            </div>

            <div className="space-y-1 relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">No of Night</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'noOfNights' ? null : 'noOfNights')}
                className={`w-full text-left px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none font-bold text-sm transition-all flex items-center justify-between ${validationErrors.noOfNights ? 'border-red-500 focus:border-red-500 text-red-700' : `border-slate-200 focus:border-orange-500 ${formData.noOfNights ? 'text-black' : 'text-slate-300'}`}`}
              >
                <span>{formData.noOfNights || 'Select Number of Nights'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'noOfNights' && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-40 overflow-y-auto ring-1 ring-black/5">
                  {NIGHT_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      className="w-full text-left px-5 py-3 hover:bg-orange-50 border-b border-slate-50 last:border-0 font-bold text-black text-xs transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, noOfNights: option });
                        setOpenDropdown(null);
                        if (validationErrors.noOfNights) setValidationErrors({...validationErrors, noOfNights: ''});
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {validationErrors.noOfNights && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.noOfNights}</p>}
            </div>

            <div className="space-y-1 relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Budget Range</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'budgetRange' ? null : 'budgetRange')}
                className={`w-full text-left px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none font-bold text-sm transition-all flex items-center justify-between ${validationErrors.budgetRange ? 'border-red-500 focus:border-red-500 text-red-700' : `border-slate-200 focus:border-orange-500 ${formData.budgetRange ? 'text-black' : 'text-slate-300'}`}`}
              >
                <span>{formData.budgetRange || 'Select Budget Range'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'budgetRange' && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-40 overflow-y-auto ring-1 ring-black/5">
                  {BUDGET_RANGES.map(option => (
                    <button
                      key={option}
                      type="button"
                      className="w-full text-left px-5 py-3 hover:bg-orange-50 border-b border-slate-50 last:border-0 font-bold text-black text-xs transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, budgetRange: option });
                        setOpenDropdown(null);
                        if (validationErrors.budgetRange) setValidationErrors({...validationErrors, budgetRange: ''});
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {validationErrors.budgetRange && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.budgetRange}</p>}
            </div>

            <div className="md:col-span-2 space-y-1 relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Flight Options</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'flightOptions' ? null : 'flightOptions')}
                className={`w-full text-left px-5 py-3 bg-slate-50/50 border-2 rounded-xl focus:ring-4 focus:ring-orange-50/20 outline-none font-bold text-sm transition-all flex items-center justify-between ${validationErrors.flightOptions ? 'border-red-500 focus:border-red-500 text-red-700' : `border-slate-200 focus:border-orange-500 ${formData.flightOptions ? 'text-black' : 'text-slate-300'}`}`}
              >
                <span>{formData.flightOptions || 'Select Flight Options'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'flightOptions' && (
                <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-40 overflow-y-auto ring-1 ring-black/5">
                  {FLIGHT_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      className="w-full text-left px-5 py-3 hover:bg-orange-50 border-b border-slate-50 last:border-0 font-bold text-black text-xs transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, flightOptions: option });
                        setOpenDropdown(null);
                        if (validationErrors.flightOptions) setValidationErrors({...validationErrors, flightOptions: ''});
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {validationErrors.flightOptions && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.flightOptions}</p>}
            </div>
          </div>


          <div className="pt-2 sticky bottom-0 bg-white pb-2">
            <button 
              type="submit"
              className="w-full bg-[#F97316] text-white py-4 rounded-full font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-100/50 flex items-center justify-center space-x-3 tracking-widest"
            >
              <span>Get Customize Package on WhatsApp</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.12.552 4.189 1.598 6.04L0 24l6.135-1.61a11.802 11.802 0 005.912 1.569h.005c6.638 0 12.039-5.404 12.042-12.041a11.79 11.79 0 00-3.483-8.498z"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseYourTrip;