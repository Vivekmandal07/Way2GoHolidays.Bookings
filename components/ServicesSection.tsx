import { FormEvent, useState } from 'react';

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
    buttonText: 'Arrange Transfer',
    serviceKey: 'Transfers',
    tagline: 'Airport, city and private transfers in one click',
    features: ['Door-to-door', 'Professional drivers', '24/7 support'],
  },
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<ServiceCard['serviceKey'] | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [childAges, setChildAges] = useState<string[]>([]);

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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedService === 'Flights') {
      if (!from || !to || !departDate) {
        setResult('Please fill From, To, and Depart date.');
        return;
      }
      if (children > 0 && childAges.some((age) => age.trim() === '')) {
        setResult('Please enter all child ages.');
        return;
      }
      setResult(`Flight search: ${from} → ${to} on ${departDate} · ${adults} adult(s), ${children} child(ren), ${infants} infant(s)`);
    } else if (selectedService === 'Hotels') {
      if (!hotelDestination || !checkInDate || !checkOutDate) {
        setResult('Please fill Hotel destination and travel dates.');
        return;
      }
      if (hotelChildren > 0 && hotelChildAges.some((age) => age.trim() === '')) {
        setResult('Please enter all hotel child ages.');
        return;
      }
      setResult(`Hotel search: ${hotelDestination} from ${checkInDate} to ${checkOutDate} · ${rooms} room(s), ${hotelAdults} adults, ${hotelChildren} children, ${nationality}`);
    } else {
      if (!pickup || !dropoff || !transferDate) {
        setResult('Please fill pickup, dropoff, and transfer date.');
        return;
      }
      setResult(`Transfer request: ${pickup} → ${dropoff} on ${transferDate} · ${vehicleType}`);
    }
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
                  onClick={() => setSelectedService(card.serviceKey)}
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
          ) : selectedService === 'Flights' ? (
            <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-5 items-end">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">From</label>
                <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="City or airport" className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">To</label>
                <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="City or airport" className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Depart on</label>
                <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>

              <div className="lg:col-span-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Adults (12+)</label>
                  <input type="number" min={1} max={9} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Children (2-11)</label>
                  <input type="number" min={0} max={9} value={children} onChange={(e) => updateChildren(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Infants (&lt;2)</label>
                  <input type="number" min={0} max={5} value={infants} onChange={(e) => setInfants(Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
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
          ) : selectedService === 'Hotels' ? (
            <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-5 items-end">
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-500 mb-1">Going to</label>
                <input type="text" value={hotelDestination} onChange={(e) => setHotelDestination(e.target.value)} placeholder="City or hotel name" className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Check-in</label>
                <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Check-out</label>
                <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div className="lg:col-span-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Rooms</label>
                  <input type="number" min={1} max={10} value={rooms} onChange={(e) => setRooms(Math.max(1, Number(e.target.value) || 1))} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Adults</label>
                  <input type="number" min={1} max={9} value={hotelAdults} onChange={(e) => setHotelAdults(Math.max(1, Number(e.target.value) || 1))} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Children</label>
                  <input type="number" min={0} max={9} value={hotelChildren} onChange={(e) => updateHotelChildren(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
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
                      })} className="w-full rounded-xl border border-slate-300 px-2 py-2 outline-none" />
                    </div>
                  ))}
                </div>
              )}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Nationality</label>
                <select value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none bg-white">
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>UAE</option>
                </select>
              </div>
              <div className="lg:col-span-1 flex justify-end">
                <button type="submit" className="rounded-xl bg-blue-600 text-white font-bold px-5 py-2.5 hover:bg-blue-700 transition">Search Hotels</button>
              </div>
            </form>
          ) : (
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
          )}
          {result && <p className="mt-3 text-sm text-green-700 font-semibold">{result}</p>}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
