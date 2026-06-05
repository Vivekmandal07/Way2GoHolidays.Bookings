import { FormEvent, useState, useRef, useEffect } from 'react';

interface ServiceCard {
  title: string;
  img: string;
  buttonText: string;
  serviceKey: 'Flights' | 'Hotels' | 'Transfers';
  tagline: string;
  features: string[];
}

const cards: ServiceCard[] = [
  {
    title: 'Flights',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Book Flight',
    serviceKey: 'Flights',
    tagline: 'Fast, flexible flight search with price insights',
    features: ['Smart fare alerts', 'Multi-city route support', 'Instant e-ticket'],
  },
  {
    title: 'Hotels',
    img: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Find Hotels',
    serviceKey: 'Hotels',
    tagline: 'Curated stays with verified reviews and free cancellation',
    features: ['Top-rated properties', 'Flexible check-in options', 'Room-only or B&B'],
  },
  {
    title: 'Transfers',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Book Transfer',
    serviceKey: 'Transfers',
    tagline: 'Airport, city and private transfers in one click',
    features: ['Door-to-door', 'Professional drivers', '24/7 support'],
  },
];

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  logo: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  stops: string;
  baggage: {
  hand: string;
  checked: string;
  };
}

const flightOptions: FlightOption[] = [
  { id: '6E204', airline: 'IndiGo', flightNumber: '6E 204', logo: '🟦', departTime: '07:20', arriveTime: '10:10', duration: '2h 50m', price: 16500, stops: 'Non-stop', baggage: { hand: '7 kg', checked: '15 kg' } },
  { id: '2P101', airline: 'Akasa Air', flightNumber: 'QP 101', logo: '🟠', departTime: '08:00', arriveTime: '10:50', duration: '2h 50m', price: 16250, stops: 'Non-stop', baggage: { hand: '7 kg', checked: '20 kg' } },
  { id: 'FD180', airline: 'Thai AirAsia', flightNumber: 'FD 180', logo: '🇹🇭', departTime: '09:15', arriveTime: '12:10', duration: '2h 55m', price: 16800, stops: 'Non-stop', baggage: { hand: '7 kg', checked: '20 kg' } },
  { id: 'AI101', airline: 'Air India', flightNumber: 'AI 101', logo: '🇮🇳', departTime: '06:00', arriveTime: '08:45', duration: '2h 45m', price: 18000, stops: 'Non-stop', baggage: { hand: '7 kg', checked: '25 kg' } },
  { id: 'SG301', airline: 'SpiceJet', flightNumber: 'SG 301', logo: '🛫', departTime: '10:30', arriveTime: '13:25', duration: '2h 55m', price: 17200, stops: 'Non-stop', baggage: { hand: '7 kg', checked: '15 kg' } },
  { id: 'UK502', airline: 'Vistara', flightNumber: 'UK 502', logo: '✈️', departTime: '12:00', arriveTime: '14:50', duration: '2h 50m', price: 17700, stops: 'Non-stop', baggage: { hand: '7 kg', checked: '25 kg' } },
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<ServiceCard['serviceKey'] | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [multiCitySegment, setMultiCitySegment] = useState({ from: '', to: '', date: '' });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [childAges, setChildAges] = useState<string[]>([]);

  // Input buffers to allow free typing (prevent jumpy coercion while typing)
  const [adultsInput, setAdultsInput] = useState(String(adults));
  const [childrenInput, setChildrenInput] = useState(String(children));
  const [infantsInput, setInfantsInput] = useState(String(infants));

  const [hotelDestination, setHotelDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [rooms, setRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelChildAges, setHotelChildAges] = useState<string[]>([]);
  const [nationality, setNationality] = useState('India');

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [vehicleType, setVehicleType] = useState('Sedan');

  const [result, setResult] = useState('');
  const [showFlightResults, setShowFlightResults] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  const openService = (service: ServiceCard['serviceKey']) => {
    setSelectedService(service);
    setResult('');
    setShowHotelResult(false);
    setSelectedHotel(null);
    setShowFlightResults(false);
    setSelectedFlightId(null);
    setTripType('oneway');
    setReturnDate('');
    setMultiCitySegment({ from: '', to: '', date: '' });
  };

  // Airport data (small curated set for dropdown suggestions)
  const airports = [
    // India
    { code: 'DEL', name: 'Indira Gandhi Intl', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', country: 'India' },
    { code: 'BLR', name: 'Kempegowda Intl', country: 'India' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose Intl', country: 'India' },
    { code: 'MAA', name: 'Chennai Intl', country: 'India' },
    { code: 'HYD', name: 'Rajiv Gandhi Intl', country: 'India' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel Intl', country: 'India' },

    // Thailand
    { code: 'BKK', name: 'Suvarnabhumi', country: 'Thailand' },
    { code: 'DMK', name: 'Don Mueang Intl', country: 'Thailand' },
    { code: 'HKT', name: 'Phuket Intl', country: 'Thailand' },
    { code: 'USM', name: 'Samui', country: 'Thailand' },

    // Vietnam
    { code: 'SGN', name: 'Tan Son Nhat Intl', country: 'Vietnam' },
    { code: 'HAN', name: 'Noi Bai Intl', country: 'Vietnam' },
    { code: 'DAD', name: 'Da Nang Intl', country: 'Vietnam' },

    // Singapore
    { code: 'SIN', name: 'Changi', country: 'Singapore' },

    // Malaysia
    { code: 'KUL', name: 'Kuala Lumpur Intl', country: 'Malaysia' },
    { code: 'PEN', name: 'Penang Intl', country: 'Malaysia' },
    { code: 'LGK', name: 'Langkawi Intl', country: 'Malaysia' },
    { code: 'BKI', name: 'Kota Kinabalu Intl', country: 'Malaysia' },

    // UAE / Dubai
    { code: 'DXB', name: 'Dubai Intl', country: 'UAE' },
    { code: 'DWC', name: 'Al Maktoum Intl', country: 'UAE' },

    // Bali / Indonesia
    { code: 'DPS', name: 'Ngurah Rai (Bali)', country: 'Indonesia' },

    // Hong Kong
    { code: 'HKG', name: 'Hong Kong Intl', country: 'Hong Kong' },

    // Sri Lanka
    { code: 'CMB', name: 'Bandaranaike Intl', country: 'Sri Lanka' },
    { code: 'HRI', name: 'Mattala Rajapaksa Intl', country: 'Sri Lanka' },

    // Maldives
    { code: 'MLE', name: 'Velana Intl', country: 'Maldives' },
    { code: 'VRM', name: 'VR Mall International', country: 'Maldives' },

    // Australia
    { code: 'SYD', name: 'Kingsford Smith', country: 'Australia' },
    { code: 'MEL', name: 'Melbourne Intl', country: 'Australia' },
    { code: 'BNE', name: 'Brisbane Intl', country: 'Australia' },
    { code: 'PER', name: 'Perth Intl', country: 'Australia' },

    // Cambodia
    { code: 'PNH', name: 'Phnom Penh Intl', country: 'Cambodia' },
    { code: 'KOS', name: 'Sihanouk Intl', country: 'Cambodia' },

    // Azerbaijan / Baku
    { code: 'GYD', name: 'Heydar Aliyev Intl', country: 'Azerbaijan' },

    // Kazakhstan / Almaty
    { code: 'ALA', name: 'Almaty Intl', country: 'Kazakhstan' },
    { code: 'NQZ', name: 'Nursultan Nazarbayev Intl', country: 'Kazakhstan' },

    // Europe example
    { code: 'LHR', name: 'Heathrow', country: 'United Kingdom' },
    { code: 'LGW', name: 'Gatwick', country: 'United Kingdom' },
    { code: 'CDG', name: 'Charles de Gaulle', country: 'France' },
    { code: 'ORY', name: 'Orly', country: 'France' },
    { code: 'FRA', name: 'Frankfurt', country: 'Germany' },
    { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', country: 'Spain' },
  ];

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [filteredAirports, setFilteredAirports] = useState<typeof airports>([] as typeof airports);

  const hotels = [
    // India
    { city: 'Delhi', name: 'The Oberoi, New Delhi', category: '5*', rating: 5, price: '₹18,000', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
    { city: 'Delhi', name: 'Lemon Tree Premier', category: '4*', rating: 4, price: '₹7,500', image: 'https://images.unsplash.com/photo-1519821172141-b0f9f8d6fe39?auto=format&fit=crop&w=800&q=80' },
    { city: 'Kolkata', name: 'The Oberoi Grand', category: '5*', rating: 5, price: '₹14,000', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' },
    { city: 'Kolkata', name: 'Taj Bengal', category: '5*', rating: 5, price: '₹15,000', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { city: 'Rajasthan', name: 'Taj Rambagh Palace', category: '5*', rating: 5, price: '₹22,000', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Bangalore', name: 'The Leela Palace', category: '5*', rating: 5, price: '₹13,500', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { city: 'Bangalore', name: 'JW Marriott', category: '5*', rating: 5, price: '₹12,000', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { city: 'Uttarakhand', name: 'Ananda in the Himalayas', category: '5*', rating: 5, price: '₹25,000', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Rishikesh', name: 'Aloha on the Ganges', category: '4*', rating: 4, price: '₹6,000', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
    { city: 'Kochi', name: 'Taj Malabar', category: '5*', rating: 5, price: '₹11,000', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { city: 'Munnar', name: 'Tea County', category: '4*', rating: 4, price: '₹7,500', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Thekkady', name: 'Spice Village', category: '4*', rating: 4, price: '₹8,500', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { city: 'Alleppey', name: 'Punnamada Resort', category: '5*', rating: 5, price: '₹10,000', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Kovalam', name: 'Uday Samudra', category: '4*', rating: 4, price: '₹6,800', image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=800&q=80' },
    { city: 'Kanyakumari', name: 'The Gopinivas Grand', category: '3*', rating: 3, price: '₹4,200', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Wayanad', name: 'Vythiri Village', category: '5*', rating: 5, price: '₹9,500', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' },

    // Thailand
    { city: 'Pattaya', name: 'Amari Pattaya', category: '4*', rating: 4, price: '฿5,500', image: 'https://images.unsplash.com/photo-1519821172141-b0f9f8d6fe39?auto=format&fit=crop&w=800&q=80' },
    { city: 'Bangkok', name: 'Novotel Bangkok', category: '4*', rating: 4, price: '฿6,200', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
    { city: 'Phuket', name: 'Hyatt Regency Phuket', category: '5*', rating: 5, price: '฿12,000', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Krabi', name: 'Railay Bay Resort', category: '4*', rating: 4, price: '฿7,800', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { city: 'Phi Phi Island', name: 'Phi Phi Island Village', category: '4*', rating: 4, price: '฿9,200', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' },
    { city: 'Ko Samui', name: 'Anantara Bophut', category: '5*', rating: 5, price: '฿14,000', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },

    // Singapore
    { city: 'Singapore', name: 'Marina Bay Sands', category: '5*', rating: 5, price: 'S$450', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },

    // Malaysia
    { city: 'Kuala Lumpur', name: 'Traders Hotel', category: '5*', rating: 5, price: 'RM 980', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Penang', name: 'Eastern & Oriental Hotel', category: '5*', rating: 5, price: 'RM 760', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' },

    // Vietnam
    { city: 'Hanoi', name: 'Sofitel Legend Metropole', category: '5*', rating: 5, price: '$210', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
    { city: 'Da Nang', name: 'Furama Resort', category: '5*', rating: 5, price: '$190', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { city: 'Ho Chi Minh', name: 'Sheraton Saigon', category: '5*', rating: 5, price: '$185', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
    { city: 'Phu Quoc', name: 'Vinpearl Resort', category: '5*', rating: 5, price: '$220', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80' },
    { city: 'Sapa', name: 'Victoria Sapa Resort', category: '4*', rating: 4, price: '$110', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80' },
  ];

  const hotelCityCountryMap: Record<string, string> = {
    Delhi: 'India',
    Kolkata: 'India',
    Rajasthan: 'India',
    Bangalore: 'India',
    Uttarakhand: 'India',
    Rishikesh: 'India',
    Kochi: 'India',
    Munnar: 'India',
    Thekkady: 'India',
    Alleppey: 'India',
    Kovalam: 'India',
    Kanyakumari: 'India',
    Wayanad: 'India',
    Vagamon: 'India',
    Pattaya: 'Thailand',
    Bangkok: 'Thailand',
    Phuket: 'Thailand',
    Krabi: 'Thailand',
    'Phi Phi Island': 'Thailand',
    'Ko Samui': 'Thailand',
    Singapore: 'Singapore',
    'Kuala Lumpur': 'Malaysia',
    Penang: 'Malaysia',
    Hanoi: 'Vietnam',
    'Da Nang': 'Vietnam',
    'Ho Chi Minh': 'Vietnam',
    'Phu Quoc': 'Vietnam',
    Sapa: 'Vietnam',
  };

  const hotelNationalityOptionsByCountry: Record<string, string[]> = {
    India: ['Delhi', 'Goa', 'Rajasthan', 'Kochi', 'Munnar', 'Thekkady', 'Alleppey', 'Varkala', 'Kanyakumari', 'Kovalam', 'Wayanad', 'Vagamon'],
    Thailand: ['Pattaya', 'Bangkok', 'Phuket', 'Krabi', 'Phi Phi Island', 'Ko Samui'],
    Singapore: ['Singapore'],
    Malaysia: ['Malaysia'],
    Vietnam: ['Hanoi', 'Sapa', 'Da Nang', 'Ho Chi Minh', 'Phu Quoc'],
  };

  const getHotelCountry = (city: string) => hotelCityCountryMap[city] || '';

  const [hotelShowSuggestions, setHotelShowSuggestions] = useState(false);
  const [hotelFilteredHotels, setHotelFilteredHotels] = useState<typeof hotels>([] as typeof hotels);

  const [selectedHotel, setSelectedHotel] = useState<typeof hotels[number] | null>(null);
  const hotelNationalityOptions = selectedHotel
    ? hotelNationalityOptionsByCountry[getHotelCountry(selectedHotel.city)] || ['India', 'Thailand', 'Bali', 'Vietnam', 'Singapore', 'Malaysia', 'Sri Lanka']
    : ['India', 'Thailand', 'Bali', 'Vietnam', 'Singapore', 'Malaysia', 'Sri Lanka'];
  const [showHotelResult, setShowHotelResult] = useState(false);
  type PassengerInfo = {
    title: '' | 'Mr' | 'Mrs' | 'Ms' | 'Miss' | 'Mister';
    givenName: string;
    lastName: string;
    dob: string;
    mealRequest: string;
    panNumber: string;
    passportNumber: string;
    passportIssuePlace: string;
    passportIssueDate: string;
    passportExpiry: string;
  };

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { title: '', givenName: '', lastName: '', dob: '', mealRequest: 'No preference', panNumber: '', passportNumber: '', passportIssuePlace: '', passportIssueDate: '', passportExpiry: '' },
  ]);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [mealOption, setMealOption] = useState<'breakfast' | 'bd' | 'all'>('breakfast');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('12:00');

  const filterHotels = (q: string) => {
    const val = q.trim().toLowerCase();
    if (!val) return hotels;
    return hotels.filter((hotel) =>
      hotel.city.toLowerCase().includes(val) ||
      hotel.name.toLowerCase().includes(val) ||
      hotel.category.toLowerCase().includes(val) ||
      hotel.price.toLowerCase().includes(val)
    );
  };

  const openHotelSuggestions = (q = '') => {
    setHotelFilteredHotels(filterHotels(q));
    setHotelShowSuggestions(true);
  };

  const selectHotel = (hotel: typeof hotels[number]) => {
    setHotelDestination(`${hotel.city} - ${hotel.name} (${hotel.category})`);
    setSelectedHotel(hotel);
    const country = getHotelCountry(hotel.city);
    const options = hotelNationalityOptionsByCountry[country];
    if (options && options.length) {
      setNationality(options[0]);
    }
    setHotelShowSuggestions(false);
  };

  const filterAirports = (q: string) => {
    const val = q.trim().toLowerCase();
    if (!val) return airports; // show full curated list on focus
    return airports.filter((a) => a.code.toLowerCase().includes(val) || a.name.toLowerCase().includes(val) || a.country.toLowerCase().includes(val));
  };

  const openSuggestions = (field: 'from' | 'to', q = '') => {
    setActiveField(field);
    setFilteredAirports(filterAirports(q));
    setShowSuggestions(true);
  };

  const selectAirport = (a: { code: string; name: string; country: string }) => {
    const label = `${a.code} — ${a.name}, ${a.country}`;
    if (activeField === 'from') setFrom(label);
    if (activeField === 'to') setTo(label);
    setShowSuggestions(false);
    setActiveField(null);
  };

  const updateChildren = (value: number) => {
    const safe = Math.max(0, Math.min(9, value));
    setChildren(safe);
    setChildAges((prev) => {
      const newAges = [...prev];
      if (newAges.length < safe) {
        return [...newAges, ...Array(safe - newAges.length).fill('')];
      }
      return newAges.slice(0, safe);
    });
  };

  const updateHotelChildren = (value: number) => {
    const safe = Math.max(0, Math.min(9, value));
    setHotelChildren(safe);
    setHotelChildAges((prev) => {
      const newAges = [...prev];
      if (newAges.length < safe) {
        return [...newAges, ...Array(safe - newAges.length).fill('')];
      }
      return newAges.slice(0, safe);
    });
  };

  // Input buffers for hotel numeric fields
  const [roomsInput, setRoomsInput] = useState(String(rooms));
  const [hotelAdultsInput, setHotelAdultsInput] = useState(String(hotelAdults));
  const [hotelChildrenInput, setHotelChildrenInput] = useState(String(hotelChildren));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedService === 'Flights') {
      if (!from || !to || !departDate) {
        setResult('Please fill From, To, and Depart date.');
        return;
      }
      if (tripType === 'roundtrip' && !returnDate) {
        setResult('Please select a return date for round-trip travel.');
        return;
      }
      if (tripType === 'multicity' && (!multiCitySegment.from || !multiCitySegment.to || !multiCitySegment.date)) {
        setResult('Please complete the second leg for multi-city travel.');
        return;
      }
      if (children > 0 && childAges.some((age) => age.trim() === '')) {
        setResult('Please enter all child ages.');
        return;
      }
      const baseMessage = `Flight search: ${from} → ${to} on ${formatDisplayDate(departDate)}`;
      const tripDetails = tripType === 'roundtrip'
        ? `, return on ${formatDisplayDate(returnDate)}`
        : tripType === 'multicity'
          ? `, second leg: ${multiCitySegment.from} → ${multiCitySegment.to} on ${formatDisplayDate(multiCitySegment.date)}`
          : '';
      setResult(`${baseMessage}${tripDetails} · ${adults} adult(s), ${children} child(ren), ${infants} infant(s)`);
      setShowFlightResults(true);
      setSelectedFlightId(flightOptions[0]?.id ?? null);
    } else if (selectedService === 'Hotels') {
      if (!hotelDestination || !checkInDate || !checkOutDate) {
        setResult('Please fill Hotel destination and travel dates.');
        return;
      }
      if (hotelChildren > 0 && hotelChildAges.some((age) => age.trim() === '')) {
        setResult('Please enter all hotel child ages.');
        return;
      }
      let hotelToBook = selectedHotel;
      if (!hotelToBook) {
        const normalizedDestination = hotelDestination.trim().toLowerCase();
        hotelToBook = hotels.find((hotel) =>
          normalizedDestination.includes(hotel.name.toLowerCase()) ||
          normalizedDestination.includes(hotel.city.toLowerCase()) ||
          normalizedDestination.includes(hotel.category.toLowerCase())
        ) || null;
      }
      if (!hotelToBook) {
        setResult('Please choose a hotel from suggestions.');
        return;
      }
      if (!selectedHotel) {
        setSelectedHotel(hotelToBook);
      }
      setResult('');
      setShowHotelResult(true);
    } else {
      if (!pickup || !dropoff || !transferDate) {
        setResult('Please fill pickup, dropoff, and transfer date.');
        return;
      }
      setResult(`Transfer request: ${pickup} → ${dropoff} on ${formatDisplayDate(transferDate)} · ${vehicleType}`);
    }
  };

  const defaultPassenger = (): PassengerInfo => ({
    title: '',
    givenName: '',
    lastName: '',
    dob: '',
    mealRequest: 'No preference',
    panNumber: '',
    passportNumber: '',
    passportIssuePlace: '',
    passportIssueDate: '',
    passportExpiry: '',
  });

  const buildPassengers = (count: number, current: PassengerInfo[] = passengers) => {
    const next = current.slice(0, count);
    while (next.length < count) {
      next.push(defaultPassenger());
    }
    return next;
  };

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showBookingModal && modalContentRef.current) {
      // ensure modal header is visible when opened
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showBookingModal]);

  const getBookingBody = () => {
    if (!selectedHotel) return '';
    const bookingInfo = [
      `Hotel: ${selectedHotel.name}`,
      `City: ${selectedHotel.city}`,
      `Category: ${selectedHotel.category}`,
      `Check-in: ${checkInDate ? formatDisplayDate(checkInDate) : 'N/A'} ${checkInTime}`,
      `Check-out: ${checkOutDate ? formatDisplayDate(checkOutDate) : 'N/A'} ${checkOutTime}`,
      `Rooms: ${rooms}`,
      `Adults: ${hotelAdults}`,
      `Children: ${hotelChildren}`,
      `Meal plan: ${mealOption === 'breakfast' ? 'Breakfast' : mealOption === 'bd' ? 'Breakfast + Dinner' : 'All meals'}`,
      `Contact phone: ${contactPhone || 'N/A'}`,
      `Contact email: ${contactEmail || 'N/A'}`,
      `Passenger details:`,
      ...passengers.map((passenger, index) => {
        const passengerType = index < hotelAdults ? `Adult ${index + 1}` : `Child ${index - hotelAdults + 1}`;
        return `${passengerType}: ${passenger.title} ${passenger.givenName} ${passenger.lastName} | DOB: ${passenger.dob ? formatDisplayDate(passenger.dob) : 'N/A'} | Meal: ${passenger.mealRequest} | PAN: ${passenger.panNumber || 'N/A'} | Passport No: ${passenger.passportNumber || 'N/A'} | Issue Place: ${passenger.passportIssuePlace || 'N/A'} | Issue Date: ${passenger.passportIssueDate ? formatDisplayDate(passenger.passportIssueDate) : 'N/A'} | Expiry: ${passenger.passportExpiry ? formatDisplayDate(passenger.passportExpiry) : 'N/A'}`;
      }),
    ];
    return bookingInfo.join('\n');
  };

  const handleBookingSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passengers.length === 0) {
      setBookingMessage('Please enter passenger details.');
      return;
    }
    const invalidPassenger = passengers.find(
      (passenger) => !passenger.title || !passenger.givenName.trim() || !passenger.lastName.trim() || !passenger.dob
    );
    if (invalidPassenger) {
      setBookingMessage('Please select title and enter given name, last name, and date of birth for each passenger.');
      return;
    }
    if (hotelAdults === 1 && passengers[0] && !passengers[0].panNumber.trim()) {
      setBookingMessage('Please enter PAN number for the adult passenger.');
      return;
    }
    if (!contactPhone.trim() || !contactEmail.trim()) {
      setBookingMessage('Please enter phone number and email before making payment.');
      return;
    }
    const body = encodeURIComponent(getBookingBody());
    const subject = encodeURIComponent('Hotel Booking Request');
    const emailUrl = `mailto:hello@yourcompany.com?subject=${subject}&body=${body}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('Hotel Booking Request:\n' + getBookingBody())}`;
    window.open(emailUrl, '_blank');
    window.open(whatsappUrl, '_blank');
    setBookingMessage('Booking information prepared for email and WhatsApp.');
    setBookingSubmitted(true);
  };

  // Helpers for hotel pricing
  const extractPrice = (hotel: typeof hotels[number]) => {
    // Try to extract numeric amount and currency from hotel.price if present
    const raw: any = (hotel as any).price;
    if (raw) {
      const s = String(raw);
      const match = s.replace(/[,]/g, '').match(/([£€₹$RM฿S\s]*)([0-9]+(\.[0-9]+)?)/);
      if (match) {
        const amount = Number(match[2]);
        const currency = (match[1] || '').trim() || (hotel as any).currency || '';
        return { amount, currency: currency || (hotel as any).currency || '' };
      }
    }
    // fallback: if basePrice exists
    if ((hotel as any).basePrice) {
      return { amount: Number((hotel as any).basePrice), currency: (hotel as any).currency || '' };
    }
    return { amount: 0, currency: '' };
  };

  const computeTotalPrice = () => {
    if (!selectedHotel) return { total: 0, currency: '' };
    const { amount, currency } = extractPrice(selectedHotel);
    // nights
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diff = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    const nights = diff > 0 ? diff : 1;
    // allow hotel-specific meal multipliers if provided, otherwise fallback to defaults
    const defaults = { breakfast: 1, bd: 1.3, all: 1.6 };
    const hotelMultipliers = (selectedHotel as any).mealMultipliers || {};
    const multiplier = hotelMultipliers[mealOption] ?? defaults[mealOption];
    const roomsCount = Math.max(1, Number(rooms) || 1);
    const total = Math.round(amount * nights * roomsCount * multiplier);
    return { total, currency };
  };

  const getHotelNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diff = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getChildAgesSummary = () => {
    const ages = hotelChildAges.map((age) => age.trim()).filter(Boolean);
    return ages.length ? ` (${ages.join(', ')})` : '';
  };

  const formatPrice = (value: number, currencyToken: string) => {
    // add thousand separators and display currency in Indian rupees
    const formatted = value.toLocaleString('en-IN');
    return `₹ ${formatted}`;
  };

  // Blur handlers: parse input buffers, coerce to safe values and update numeric state
  const commitAdults = () => {
    let n = parseInt(adultsInput, 10);
    if (Number.isNaN(n) || n < 1) n = 1;
    setAdults(n);
    setAdultsInput(String(n));
  };

  const commitChildren = () => {
    let n = parseInt(childrenInput, 10);
    if (Number.isNaN(n) || n < 0) n = 0;
    updateChildren(n);
    setChildrenInput(String(n));
  };

  const commitInfants = () => {
    let n = parseInt(infantsInput, 10);
    if (Number.isNaN(n) || n < 0) n = 0;
    setInfants(n);
    setInfantsInput(String(n));
  };

  const commitRooms = () => {
    let n = parseInt(roomsInput, 10);
    if (Number.isNaN(n) || n < 1) n = 1;
    setRooms(n);
    setRoomsInput(String(n));
  };

  const commitHotelAdults = () => {
    let n = parseInt(hotelAdultsInput, 10);
    if (Number.isNaN(n) || n < 1) n = 1;
    setHotelAdults(n);
    setHotelAdultsInput(String(n));
  };

  const commitHotelChildren = () => {
    let n = parseInt(hotelChildrenInput, 10);
    if (Number.isNaN(n) || n < 0) n = 0;
    updateHotelChildren(n);
    setHotelChildrenInput(String(n));
  };

  const getNextDateString = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = Number(month) - 1;
    const monthLabel = monthNames[monthIndex] || month;
    return `${String(day).padStart(2, '0')} ${monthLabel} ${year}`;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Search Flights & Travel Services</h2>
          <p className="mt-2 text-slate-500 max-w-2xl mx-auto">Quickly search flights and choose passenger counts with child age inputs.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`rounded-3xl p-4 border transition-all shadow-sm ${selectedService === card.serviceKey ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-white ring-1 ring-blue-200' : 'border-slate-200 bg-white hover:border-blue-300 hover:-translate-y-0.5 transform'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{card.title}</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{card.buttonText}</h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-xs">{card.tagline}</p>
                </div>
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-200">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {card.features.map((feature) => (
                  <span key={feature} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{feature}</span>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => openService(card.serviceKey)}
                  className="w-full rounded-xl bg-blue-600 text-white font-bold px-4 py-2 hover:bg-blue-700 transition"
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm">
          {selectedService === null ? (
            <div className="text-center p-8 text-slate-500">
              <p className="text-lg font-semibold text-slate-700">Select a service to start booking</p>
              <p className="text-sm mt-1">Click Book Flight, Find Hotels, or Arrange Transfer to open the form.</p>
            </div>
          ) : (
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">{selectedService === 'Flights' ? 'Flight Search' : selectedService === 'Hotels' ? 'Hotel Search' : 'Transfer Booking'}</p>
                <p className="text-xs text-slate-500">Close to hide search inputs.</p>
              </div>
              <button type="button" onClick={() => setSelectedService(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition">
                ✕
              </button>
            </div>
          )}
          {selectedService === 'Flights' ? (
            <div>
              <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-5 items-end">
                <div className="lg:col-span-5">
                  <label className="block text-xs font-bold text-slate-500 mb-2">Trip type</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      { value: 'oneway', label: 'One Way' },
                      { value: 'roundtrip', label: 'Round Trip' },
                      { value: 'multicity', label: 'Multi City' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTripType(option.value as 'oneway' | 'roundtrip' | 'multicity')}
                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${tripType === option.value ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">From</label>
                <div className="relative">
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      if (activeField !== 'from') openSuggestions('from', e.target.value);
                      else setFilteredAirports(filterAirports(e.target.value));
                    }}
                    onFocus={() => openSuggestions('from', from)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="City, airport or IATA code"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                  />
                  {showSuggestions && activeField === 'from' && (
                    <ul className="absolute z-20 left-0 right-0 mt-1 max-h-52 overflow-auto rounded-xl bg-white border border-slate-200 shadow-sm">
                      {filteredAirports.map((a) => (
                        <li key={a.code} onMouseDown={() => selectAirport(a)} className="px-3 py-2 hover:bg-slate-100 cursor-pointer">{`${a.code} — ${a.name}, ${a.country}`}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">To</label>
                <div className="relative">
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      if (activeField !== 'to') openSuggestions('to', e.target.value);
                      else setFilteredAirports(filterAirports(e.target.value));
                    }}
                    onFocus={() => openSuggestions('to', to)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="City, airport or IATA code"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                  />
                  {showSuggestions && activeField === 'to' && (
                    <ul className="absolute z-20 left-0 right-0 mt-1 max-h-52 overflow-auto rounded-xl bg-white border border-slate-200 shadow-sm">
                      {filteredAirports.map((a) => (
                        <li key={a.code} onMouseDown={() => selectAirport(a)} className="px-3 py-2 hover:bg-slate-100 cursor-pointer">{`${a.code} — ${a.name}, ${a.country}`}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Depart on</label>
                <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              {tripType === 'roundtrip' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Return on</label>
                  <input
                    type="date"
                    min={departDate || undefined}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                  />
                </div>
              )}
              {tripType === 'multicity' && (
                <div className="lg:col-span-5 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Second leg from</label>
                    <input
                      type="text"
                      value={multiCitySegment.from}
                      onChange={(e) => setMultiCitySegment((prev) => ({ ...prev, from: e.target.value }))}
                      placeholder="City, airport or IATA code"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Second leg to</label>
                    <input
                      type="text"
                      value={multiCitySegment.to}
                      onChange={(e) => setMultiCitySegment((prev) => ({ ...prev, to: e.target.value }))}
                      placeholder="City, airport or IATA code"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Second leg date</label>
                    <input
                      type="date"
                      value={multiCitySegment.date}
                      onChange={(e) => setMultiCitySegment((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}
              <div className="lg:col-span-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Adults (12+)</label>
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={adultsInput}
                    onChange={(e) => setAdultsInput(e.target.value)}
                    onBlur={commitAdults}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Children (2-11)</label>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={childrenInput}
                    onChange={(e) => setChildrenInput(e.target.value)}
                    onBlur={commitChildren}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Infants (&lt;2)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={infantsInput}
                    onChange={(e) => setInfantsInput(e.target.value)}
                    onBlur={commitInfants}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="lg:col-span-1 flex justify-end">
                <button type="submit" className="rounded-xl bg-blue-600 text-white font-bold px-5 py-2.5 hover:bg-blue-700 transition">Search Flights</button>
              </div>

              {children > 0 && (
                <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {childAges.map((age, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase text-slate-500">Child {idx + 1} age</label>
                      <input type="number" min={0} max={17} value={age} onChange={(e) => setChildAges((prev) => {
                        const next = [...prev];
                        next[idx] = e.target.value;
                        return next;
                      })} className="w-full rounded-xl border border-slate-300 px-2 py-2 outline-none" />
                    </div>
                  ))}
                </div>
              )}
            </form>
            {showFlightResults && (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Available flights</p>
                    <p className="text-base font-semibold text-slate-700">Choose a flight from all airlines</p>
                  </div>
                  <div className="text-sm text-slate-500">{result}</div>
                </div>
                <div className="space-y-4">
                  {flightOptions.map((flight) => (
                    <label key={flight.id} className={`flex flex-col gap-4 rounded-3xl border p-4 transition ${selectedFlightId === flight.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="flightSelection"
                            checked={selectedFlightId === flight.id}
                            onChange={() => setSelectedFlightId(flight.id)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{flight.logo}</div>
                            <div>
                              <p className="font-semibold text-slate-900">{flight.airline}</p>
                              <p className="text-sm text-slate-500">{flight.flightNumber}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">₹ {flight.price.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500">{flight.stops}</p>
                          <p className="mt-2 text-xs text-slate-500">Hand baggage: <span className="font-semibold text-slate-900">{flight.baggage.hand}</span></p>
                          <p className="text-xs text-slate-500">Checked baggage: <span className="font-semibold text-slate-900">{flight.baggage.checked}</span></p>
                        </div>
                      </div>
                      <div className="grid gap-4 text-sm md:grid-cols-[1fr_auto_1fr] items-center">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-xs uppercase text-slate-500">Depart</p>
                          <p className="mt-3 text-base font-semibold text-slate-900">{from.split(' — ')[0] || 'From'}</p>
                          <p className="mt-1 text-xs text-slate-500">{from.split(' — ')[1] || from}</p>
                          <p className="mt-4 text-3xl font-bold text-slate-900">{flight.departTime}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Duration</p>
                          <div className="h-px w-24 bg-slate-300" />
                          <p className="text-sm font-semibold text-slate-900">{flight.duration}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-xs uppercase text-slate-500">Arrive</p>
                          <p className="mt-3 text-base font-semibold text-slate-900">{to.split(' — ')[0] || 'To'}</p>
                          <p className="mt-1 text-xs text-slate-500">{to.split(' — ')[1] || to}</p>
                          <p className="mt-4 text-3xl font-bold text-slate-900">{flight.arriveTime}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            </div>
          ) : selectedService === 'Hotels' ? (
            <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-5 items-end">
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-500 mb-1">Going to</label>
                <div className="relative">
                  <input
                    type="text"
                    value={hotelDestination}
                    onChange={(e) => {
                      setHotelDestination(e.target.value);
                      setSelectedHotel(null);
                      openHotelSuggestions(e.target.value);
                    }}
                    onFocus={() => openHotelSuggestions(hotelDestination)}
                    onBlur={() => setTimeout(() => setHotelShowSuggestions(false), 150)}
                    placeholder="City, hotel or category"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                  />
                  {hotelShowSuggestions && (
                    <ul className="absolute z-20 left-0 right-0 mt-1 max-h-72 overflow-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
                      {hotelFilteredHotels.map((hotel, index) => (
                        <li key={`${hotel.city}-${hotel.name}-${index}`} onMouseDown={() => selectHotel(hotel)} className="flex gap-3 px-3 py-3 hover:bg-slate-50 cursor-pointer">
                          <img src={hotel.image} alt={hotel.name} className="h-16 w-24 rounded-2xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800 truncate">{hotel.name}</p>
                            <p className="text-xs text-slate-500 truncate">{hotel.city} · {hotel.category}</p>
                            <p className="text-xs text-amber-500">{'★'.repeat(hotel.rating)}{'☆'.repeat(5 - hotel.rating)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCheckInDate(v);
                    // keep check-out empty so the user can choose it explicitly
                    if (v && checkOutDate && new Date(checkOutDate) <= new Date(v)) {
                      setCheckOutDate('');
                    }
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate ? getNextDateString(checkInDate) : undefined}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (checkInDate && new Date(v) <= new Date(checkInDate)) {
                      // clamp to next day after check-in
                      setCheckOutDate(getNextDateString(checkInDate));
                    } else {
                      setCheckOutDate(v);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="lg:col-span-5 grid grid-cols-12 gap-3 items-end">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Rooms</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={roomsInput}
                    onChange={(e) => setRoomsInput(e.target.value)}
                    onBlur={commitRooms}
                    className="h-16 w-full rounded-[28px] border border-slate-300 px-4 text-center text-xl font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Adults</label>
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={hotelAdultsInput}
                    onChange={(e) => setHotelAdultsInput(e.target.value)}
                    onBlur={commitHotelAdults}
                    className="h-16 w-full rounded-[28px] border border-slate-300 px-4 text-center text-xl font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Children</label>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={hotelChildrenInput}
                    onChange={(e) => setHotelChildrenInput(e.target.value)}
                    onBlur={commitHotelChildren}
                    className="h-16 w-full rounded-[28px] border border-slate-300 px-4 text-center text-xl font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="col-span-5 sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nationality</label>
                  <select value={nationality} onChange={(e) => setNationality(e.target.value)} className="h-16 w-full rounded-[28px] border border-slate-300 px-4 text-lg text-slate-900 outline-none bg-white focus:border-blue-500">
                    {hotelNationalityOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2 flex items-end justify-end">
                  <button type="submit" className="inline-flex h-16 min-w-[170px] items-center justify-center rounded-[32px] bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
                    Search Hotels
                  </button>
                </div>
              </div>
              {hotelChildren > 0 && (
                <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {hotelChildAges.map((age, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase text-slate-500">Child {idx + 1} age</label>
                      <input type="number" min={2} max={11} value={age} onChange={(e) => setHotelChildAges((prev) => {
                        const next = [...prev];
                        next[idx] = e.target.value;
                        return next;
                      })} className="h-16 w-full rounded-[24px] border border-slate-300 px-3 text-center text-lg outline-none focus:border-blue-500" />
                    </div>
                  ))}
                </div>
              )}
            </form>
            
          ) : selectedService === 'Transfers' ? (
            <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-5 items-end">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Pickup</label>
                <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Airport or hotel" className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Dropoff</label>
                <input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Destination" className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Transfer</label>
                <input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Vehicle</label>
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none bg-white" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Van</option>
                </select>
              </div>
              <div className="lg:col-span-1 flex justify-end">
                <button type="submit" className="rounded-xl bg-blue-600 text-white font-bold px-5 py-2.5 hover:bg-blue-700 transition">Arrange Transfer</button>
              </div>
            </form>
          ) : null}
          {showHotelResult && selectedHotel && (
            <>
              <div className="mt-6 p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="w-full md:w-48">
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-36 object-cover rounded-xl" />
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="font-semibold text-slate-800">Room specification</div>
                    <div className="mt-2 text-slate-500">Comfortable room with premium bedding, free WiFi, private bathroom, and daily housekeeping.</div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">{selectedHotel.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{selectedHotel.city} · {selectedHotel.category}</p>
                      <p className="text-sm text-amber-500 mt-2">{'★'.repeat(selectedHotel.rating)}{'☆'.repeat(5 - selectedHotel.rating)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Total price</div>
                      <div className="text-3xl font-bold text-slate-800">
                        {(() => {
                          const { total, currency } = computeTotalPrice();
                          return formatPrice(total, currency);
                        })()}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Price per night: {formatPrice(extractPrice(selectedHotel).amount, '₹')}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {rooms} room(s) · {getHotelNights()} night(s)
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Guests</div>
                      <div className="text-sm text-slate-700">{hotelAdults} adult(s){hotelChildren > 0 ? ` · ${hotelChildren} child(ren)${getChildAgesSummary()}` : ''}</div>
                      <div className="text-xs text-slate-500">{hotelAdults + hotelChildren} pax total</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Room & nights</div>
                      <div className="text-sm text-slate-700">{rooms} room(s) · {getHotelNights()} night(s)</div>
                      <div className="text-xs text-slate-500">Meal plan: {mealOption === 'breakfast' ? 'Breakfast' : mealOption === 'bd' ? 'Breakfast + Dinner' : 'All meals'}</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 items-center gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-slate-500">Check-in</label>
                      <div className="mt-2">
                        <div className="text-sm text-slate-700">{checkInDate ? formatDisplayDate(checkInDate) : '—'}</div>
                        <div className="mt-2">
                          <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-slate-300 text-3xl select-none">|</div>

                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-slate-500">Check-out</label>
                      <div className="mt-2">
                        <div className="text-sm text-slate-700">{checkOutDate ? formatDisplayDate(checkOutDate) : '—'}</div>
                        <div className="mt-2">
                          <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grow">
                      <label className="block text-xs font-semibold text-slate-500">Meal options</label>
                      <select value={mealOption} onChange={(e) => setMealOption(e.target.value as any)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
                        <option value="breakfast">Breakfast</option>
                        <option value="bd">Breakfast + Dinner</option>
                        <option value="all">All meals</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const totalPassengers = Math.max(1, hotelAdults + hotelChildren);
                        setPassengers((prev) => buildPassengers(totalPassengers, prev));
                        setShowBookingModal(true);
                        setBookingMessage('');
                        setBookingSubmitted(false);
                      }}
                      className="min-w-[150px] rounded-2xl bg-blue-600 text-white font-semibold px-6 py-3 hover:bg-blue-700 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </>
          )}
          {showBookingModal && selectedHotel && (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/70 pt-16 pb-6 px-4 overflow-y-auto">
              <div ref={modalContentRef} className="w-full max-w-3xl overflow-auto rounded-3xl bg-white shadow-2xl max-h-[80vh] mt-6">
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Confirm booking details</p>
                    <p className="text-xs text-slate-500">Complete guest details and send booking info.</p>
                  </div>
                  <button type="button" onClick={() => setShowBookingModal(false)} className="text-slate-500 hover:text-slate-800">Close</button>
                </div>
                <form onSubmit={handleBookingSubmit} className="space-y-4 px-6 py-5">
                  {bookingMessage && (
                    <div className={`rounded-2xl px-4 py-3 text-sm ${bookingSubmitted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {bookingMessage}
                    </div>
                  )}
                  <div className="space-y-4">
                    {passengers.map((passenger, index) => {
                      const showPanRequired = hotelAdults === 1 && index === 0;
                      return (
                        <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {index < hotelAdults ? `Adult ${index + 1}` : `Child ${index - hotelAdults + 1}`}
                              </p>
                              <p className="text-xs text-slate-500">Please fill details for every passenger.</p>
                            </div>
                            <p className="text-xs text-red-500 self-start">* Required</p>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-5 mt-4">
                            <div className="sm:col-span-1 max-w-[150px]">
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Title <span className="text-red-500">*</span></label>
                              <select value={passenger.title} onChange={(e) => updatePassenger(index, 'title', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                                <option value="" disabled hidden>Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Miss">Miss</option>
                                <option value="Mister">Mister</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Given name <span className="text-red-500">*</span></label>
                              <input type="text" value={passenger.givenName} onChange={(e) => updatePassenger(index, 'givenName', e.target.value)} placeholder="Given name" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Last name <span className="text-red-500">*</span></label>
                              <input type="text" value={passenger.lastName} onChange={(e) => updatePassenger(index, 'lastName', e.target.value)} placeholder="Last name" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-3 mt-4">
                            <div>
                              <label className={showPanRequired ? 'block text-xs font-semibold text-red-500 mb-1' : 'block text-xs font-semibold text-slate-500 mb-1'}>
                                PAN No {showPanRequired && <span className="text-red-500">*</span>}
                              </label>
                              <input type="text" value={passenger.panNumber} onChange={(e) => updatePassenger(index, 'panNumber', e.target.value)} placeholder="PAN number" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Meal request <span className="text-red-500">*</span></label>
                              <select value={passenger.mealRequest} onChange={(e) => updatePassenger(index, 'mealRequest', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                                <option>No preference</option>
                                <option>Vegetarian</option>
                                <option>Non-vegetarian</option>
                                <option>Vegan</option>
                                <option>Gluten-free</option>
                                <option>Halal</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Date of birth <span className="text-red-500">*</span></label>
                              <input type="date" value={passenger.dob} onChange={(e) => updatePassenger(index, 'dob', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-4 mt-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Passport No</label>
                              <input type="text" value={passenger.passportNumber} onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)} placeholder="Passport number" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Issue place</label>
                              <input type="text" value={passenger.passportIssuePlace} onChange={(e) => updatePassenger(index, 'passportIssuePlace', e.target.value)} placeholder="Passport issue place" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Issue date</label>
                              <input type="date" value={passenger.passportIssueDate} onChange={(e) => updatePassenger(index, 'passportIssueDate', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Passport expiry</label>
                              <input type="date" value={passenger.passportExpiry} onChange={(e) => updatePassenger(index, 'passportExpiry', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900 mb-3">Contact details</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Phone <span className="text-red-500">*</span></label>
                        <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Booking summary</p>
                    <p className="mt-2 text-sm text-slate-700">{selectedHotel.name}, {selectedHotel.city}</p>
                    <p className="text-sm text-slate-700">Guests: {hotelAdults} adult(s){hotelChildren > 0 ? ` · ${hotelChildren} child(ren)` : ''}</p>
                    <p className="text-sm text-slate-700">Stay: {rooms} room(s) · {getHotelNights()} night(s)</p>
                    <p className="text-sm text-slate-700">Check-in: {checkInDate ? formatDisplayDate(checkInDate) : '—'} {checkInTime}</p>
                    <p className="text-sm text-slate-700">Check-out: {checkOutDate ? formatDisplayDate(checkOutDate) : '—'} {checkOutTime}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={() => setShowBookingModal(false)} className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100 transition">Cancel</button>
                    <button type="submit" className="rounded-2xl bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700 transition">Make payment</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {result && !showFlightResults && <p className="mt-3 text-sm text-green-700 font-semibold">{result}</p>}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
