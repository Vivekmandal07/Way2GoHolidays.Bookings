
import { Destination, Package } from './types';
import { PICS } from './assets/images';

export const INTERNATIONAL_DESTINATIONS: Destination[] = [
  { id: '1', name: 'Paris, France', type: 'International', image: PICS.paris, description: 'Experience the city of love and lights.' },
  { id: '2', name: 'Maldives', type: 'International', image: PICS.maldives, description: 'Luxury water villas and crystal clear oceans.' },
  { id: '3', name: 'Dubai, UAE', type: 'International', image: PICS.dubai, description: 'Modern architecture and desert adventures.' },
  { id: '4', name: 'Bali, Indonesia', type: 'International', image: PICS.bali, description: 'Tropical paradise with rich culture.' },
];

export const DOMESTIC_DESTINATIONS: Destination[] = [
  { id: '6', name: 'Kerala', type: 'Domestic', image: PICS.kerala, description: "God's own country." },
  { id: '7', name: 'Goa', type: 'Domestic', image: PICS.goa, description: 'Beaches, parties, and serenity.' },
  { id: '8', name: 'Himachal', type: 'Domestic', image: PICS.himachal, description: 'The snowy peaks and lush valleys.' },
  { id: '5', name: 'Ladakh', type: 'Domestic', image: PICS.ladakh, description: 'The land of high passes.' },
];

export const PACKAGES: Package[] = [
  // International
  { 
    id: 'int-1', 
    title: 'Parisian Dreams & Swiss Alps', 
    price: '₹1,45,000', 
    image: PICS.paris, 
    duration: '6N/7D', 
    destination: 'Paris, France',
    itinerary: [
      { day: 1, title: 'Arrival in Paris', activities: 'Welcome to Paris! Transfer to hotel and evening cruise.', hotel: 'Pullman Paris Tour Eiffel' },
      { day: 2, title: 'Louvre & Eiffel Summit', activities: 'Priority access to Louvre and Eiffel Tower visit.', hotel: 'Pullman Paris Tour Eiffel' },
      { day: 3, title: 'Day Trip to Versailles', activities: 'Explore the grand Palace of Versailles.', hotel: 'Pullman Paris Tour Eiffel' },
      { day: 4, title: 'TGV to Zurich', activities: 'High-speed train to Zurich. Evening Lake walk.', hotel: 'Renaissance Zurich Tower' },
      { day: 5, title: 'Mount Titlis Adventure', activities: 'Excursion to Mt. Titlis with Ice Flyer.', hotel: 'Renaissance Zurich Tower' },
      { day: 6, title: 'Lucerne Exploration', activities: 'City tour of Lucerne and Chapel Bridge.', hotel: 'Renaissance Zurich Tower' },
      { day: 7, title: 'Departure', activities: 'Breakfast and private transfer to airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-2', 
    title: 'Amazing Thailand Getaway', 
    price: '₹48,000', 
    image: PICS.thailand, 
    duration: '4N/5D', 
    destination: 'Thailand',
    itinerary: [
      { day: 1, title: 'Bangkok Arrival', activities: 'Transfer to hotel. Evening Chao Phraya Dinner Cruise.', hotel: 'Anantara Riverside Bangkok' },
      { day: 2, title: 'Grand Palace & Temples', activities: 'Visit the Grand Palace and Wat Phra Kaew.', hotel: 'Anantara Riverside Bangkok' },
      { day: 3, title: 'Bangkok to Pattaya', activities: 'Drive to Pattaya. Coral Island tour by speedboat.', hotel: 'Hilton Pattaya' },
      { day: 4, title: 'Alcazar Show & Leisure', activities: 'Morning at leisure. Evening Alcazar Cabaret Show.', hotel: 'Hilton Pattaya' },
      { day: 5, title: 'Departure', activities: 'Shopping and airport transfer.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-3', 
    title: 'Dubai Desert & City Lights', 
    price: '₹62,000', 
    image: PICS.dubai, 
    duration: '4N/5D', 
    destination: 'Dubai, UAE',
    itinerary: [
      { day: 1, title: 'Arrival & Dhow Cruise', activities: 'Arrival and Marina Dhow Cruise with dinner.', hotel: 'JW Marriott Marquis' },
      { day: 2, title: 'Dubai City Tour & Burj Khalifa', activities: 'City tour and Burj Khalifa 124th floor visit.', hotel: 'JW Marriott Marquis' },
      { day: 3, title: 'Desert Safari', activities: 'Dune bashing, camel rides, and BBQ dinner.', hotel: 'JW Marriott Marquis' },
      { day: 4, title: 'Aquaventure Waterpark', activities: 'Full day access to Atlantis Waterpark.', hotel: 'JW Marriott Marquis' },
      { day: 5, title: 'Departure', activities: 'Shopping and airport drop.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-4', 
    title: 'Vibrant Vietnam Explorer', 
    price: '₹74,000', 
    image: PICS.vietnam, 
    duration: '5N/6D', 
    destination: 'Vietnam',
    itinerary: [
      { day: 1, title: 'Hanoi Arrival', activities: 'Transfer and Old Quarter cyclo tour.', hotel: 'Sofitel Legend Metropole' },
      { day: 2, title: 'Ha Long Bay Cruise', activities: 'Board luxury cruise and visit hidden caves.', hotel: 'Paradise Peak Cruise' },
      { day: 3, title: 'Ha Long to Da Nang', activities: 'Fly to Da Nang. Check-in at beach resort.', hotel: 'InterContinental Danang' },
      { day: 4, title: 'Bana Hills & Golden Bridge', activities: 'Cable car ride and walk on Golden Bridge.', hotel: 'InterContinental Danang' },
      { day: 5, title: 'Hoi An Ancient Town', activities: 'Walking tour of Hoi An heritage site.', hotel: 'InterContinental Danang' },
      { day: 6, title: 'Departure', activities: 'Transfer to Da Nang airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-5', 
    title: 'Tropical Bali Paradise', 
    price: '₹55,000', 
    image: PICS.bali, 
    duration: '5N/6D', 
    destination: 'Bali, Indonesia',
    itinerary: [
      { day: 1, title: 'Arrival in Bali', activities: 'Warm welcome and transfer to Ubud villa.', hotel: 'Wapa di Ume Ubud' },
      { day: 2, title: 'Ubud Culture & Swings', activities: 'Tegalalang Rice Terrace and Bali Swing.', hotel: 'Wapa di Ume Ubud' },
      { day: 3, title: 'Kintamani Volcano', activities: 'Batur volcano view and Holy Water Temple.', hotel: 'Wapa di Ume Ubud' },
      { day: 4, title: 'Transfer to Seminyak', activities: 'Beach club evening and sunset at Tanah Lot.', hotel: 'W Bali - Seminyak' },
      { day: 5, title: 'Uluwatu Temple', activities: 'Kecak Fire Dance and Jimbaran Bay Dinner.', hotel: 'W Bali - Seminyak' },
      { day: 6, title: 'Departure', activities: 'Leisure and airport drop.', hotel: 'N/A' }
    ]
  },

  // Domestic Packages
  { 
    id: 'dom-1', 
    title: 'Kerala Backwaters Bliss', 
    price: '₹35,000', 
    image: PICS.kerala, 
    duration: '5N/6D', 
    destination: 'Kerala',
    itinerary: [
      { day: 1, title: 'Cochin Arrival', activities: 'Pick up and evening Kathakali performance.', hotel: 'Grand Hyatt Bolgatty' },
      { day: 2, title: 'Munnar Hills', activities: 'Drive to Munnar and visit waterfalls.', hotel: 'The Panoramic Getaway' },
      { day: 3, title: 'Tea Gardens Tour', activities: 'Eravikulam National Park and Tea Museum.', hotel: 'The Panoramic Getaway' },
      { day: 4, title: 'Thekkady Jungle', activities: 'Periyar Lake boating and spice plantation.', hotel: 'Spice Village' },
      { day: 5, title: 'Houseboat Stay', activities: 'Luxury houseboat cruise in Alleppey.', hotel: 'Premium Houseboat' },
      { day: 6, title: 'Departure', activities: 'Return to Cochin airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-2', 
    title: 'Goa Sun & Sands', 
    price: '₹22,000', 
    image: PICS.goa, 
    duration: '3N/4D', 
    destination: 'Goa',
    itinerary: [
      { day: 1, title: 'Arrival & North Goa', activities: 'Check-in and evening at Baga Beach.', hotel: 'W Goa' },
      { day: 2, title: 'North Goa Beaches', activities: 'Fort Aguada and Anjuna Flea Market.', hotel: 'W Goa' },
      { day: 3, title: 'South Goa Heritage', activities: 'Old Goa Churches and Miramar Beach.', hotel: 'W Goa' },
      { day: 4, title: 'Departure', activities: 'Drop at airport/station.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-3', 
    title: 'Royal Rajasthan Heritage', 
    price: '₹58,000', 
    image: PICS.rajasthan, 
    duration: '6N/7D', 
    destination: 'Rajasthan',
    itinerary: [
      { day: 1, title: 'Jaipur Arrival', activities: 'Evening at Chokhi Dhani.', hotel: 'The Oberoi Rajvilas' },
      { day: 2, title: 'Pink City Tour', activities: 'Amer Fort and Hawa Mahal visit.', hotel: 'The Oberoi Rajvilas' },
      { day: 3, title: 'Blue City Jodhpur', activities: 'Visit Mehrangarh Fort.', hotel: 'Umaid Bhawan Palace' },
      { day: 4, title: 'Udaipur Lakes', activities: 'Boat ride at Lake Pichola.', hotel: 'The Leela Palace Udaipur' },
      { day: 5, title: 'City Palace Tour', activities: 'Visit City Palace Museum.', hotel: 'The Leela Palace Udaipur' },
      { day: 6, title: 'Departure', activities: 'Drop at Udaipur airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-4', 
    title: 'Manali Snow Magic', 
    price: '₹28,000', 
    image: PICS.himachal, 
    duration: '4N/5D', 
    destination: 'Himachal',
    itinerary: [
      { day: 1, title: 'Arrival & Mall Road', activities: 'Hadimba Temple and evening walk.', hotel: 'Span Resort & Spa' },
      { day: 2, title: 'Solang Adventure', activities: 'Paragliding and Snow activities.', hotel: 'Span Resort & Spa' },
      { day: 3, title: 'Kasol Trip', activities: 'Visit Kasol and Manikaran.', hotel: 'Span Resort & Spa' },
      { day: 4, title: 'Vashisht Springs', activities: 'Morning bath and leisure.', hotel: 'Span Resort & Spa' },
      { day: 5, title: 'Departure', activities: 'Drop at Bhuntar airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-5', 
    title: 'Heavenly Kashmir Valley', 
    price: '₹45,000', 
    image: PICS.kashmir, 
    duration: '5N/6D', 
    destination: 'Kashmir',
    itinerary: [
      { day: 1, title: 'Srinagar Arrival', activities: 'Evening Shikara ride on Dal Lake.', hotel: 'Luxury Houseboat' },
      { day: 2, title: 'Gulmarg Snow', activities: 'Gondola ride and snow fun.', hotel: 'Khyber Resort' },
      { day: 3, title: 'Pahalgam Valley', activities: 'Visit Aru and Betaab Valley.', hotel: 'Welcomhotel Pahalgam' },
      { day: 4, title: 'Srinagar Gardens', activities: 'Mughal Gardens visit.', hotel: 'The Lalit Grand Palace' },
      { day: 5, title: 'Local Shopping', activities: 'Leisure day in Srinagar.', hotel: 'The Lalit Grand Palace' },
      { day: 6, title: 'Departure', activities: 'Drop at Srinagar airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-6', 
    title: 'Leh Ladakh - High Passes', 
    price: '₹32,000', 
    image: PICS.ladakh, 
    duration: '5N/6D', 
    destination: 'Ladakh',
    itinerary: [
      { day: 1, title: 'Leh Arrival', activities: 'Rest and acclimatize to the high altitude.', hotel: 'The Grand Dragon Leh' },
      { day: 2, title: 'Sham Valley Tour', activities: 'Magnetic Hill, Gurudwara Pathar Sahib, and Hall of Fame.', hotel: 'The Grand Dragon Leh' },
      { day: 3, title: 'Nubra Valley via Khardung La', activities: 'Drive to Nubra Valley over world\'s highest motorable pass.', hotel: 'Stone Hedge Ladakh' },
      { day: 4, title: 'Pangong Lake via Shyok', activities: 'Visit the world-famous high-altitude lake.', hotel: 'Pangong Lake Camp' },
      { day: 5, title: 'Return to Leh', activities: 'Crossing Chang La pass and local market shopping.', hotel: 'The Grand Dragon Leh' },
      { day: 6, title: 'Departure', activities: 'Transfer to Leh airport.', hotel: 'N/A' }
    ]
  },
];

export const GALLERY_IMAGES = [
  { url: PICS.traveler_1, tag: 'Beach Vibes' },
  { url: PICS.traveler_2, tag: 'Ocean Fun' },
  { url: PICS.traveler_3, tag: 'Night Streets' },
  { url: PICS.traveler_4, tag: 'Thai Temples' },
  { url: PICS.traveler_5, tag: 'Coastal Landmarks' },
  { url: PICS.traveler_6, tag: 'Boat Delights' },
  { url: PICS.traveler_7, tag: 'Mountain Tours' },
  { url: PICS.traveler_8, tag: 'Friendship' },
  { url: PICS.traveler_9, tag: 'Premium Stays' },
  { url: PICS.traveler_10, tag: 'Adventure' },
  { url: PICS.traveler_11, tag: 'Peak Views' },
  { url: PICS.traveler_12, tag: 'Waterfall' },
  { url: PICS.traveler_13, tag: 'Nature Hugs' },
  { url: PICS.traveler_14, tag: 'Misty Valleys' },
  { url: PICS.traveler_15, tag: 'Europe Trip' },
  { url: PICS.traveler_16, tag: 'Serene Lakes' },
  { url: PICS.traveler_17, tag: 'Park Moments' },
  { url: PICS.traveler_18, tag: 'Summer Love' },
];

export const CONTACT_DETAILS = {
  name: 'Way2GoHolidays',
  phone: '+917303402841',
  email: 'way2goholidays.bookings@gmail.com',
  location: 'New Delhi',
  whatsapp: 'https://wa.me/917303402841'
};

export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
];
