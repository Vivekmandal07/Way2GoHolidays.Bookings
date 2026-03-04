
import { Destination, Package } from './types';
import { PICS } from './assets/images';

// automatically load all images from assets/image directory
// Vite's `import.meta.glob` returns an object of paths to modules
// path is relative to this file; constants.tsx sits in project root
const travellerModules = import.meta.glob('./assets/image/travellers/*.{png,jpg,jpeg}', { eager: true, as: 'url' });

// convert the imported modules into an array of {url, tag}
export const GALLERY_IMAGES = Object.entries(travellerModules)
  .map(([path, url]) => {
    const filename = path.split('/').pop() || '';
    const tag = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    return { url: url as string, tag };
  });





export const INTERNATIONAL_DESTINATIONS: Destination[] = [
  { id: '1', name: 'Paris, France', type: 'International', image: PICS.paris, description: 'Experience the city of love and lights.' },
  { id: '2', name: 'Maldives', type: 'International', image: PICS.maldives, description: 'Luxury water villas and crystal clear oceans.' },
  { id: '3', name: 'Dubai, UAE', type: 'International', image: PICS.dubai, description: 'Modern architecture and desert adventures.' },
  { id: '4', name: 'Bali, Indonesia', type: 'International', image: PICS.bali, description: 'Tropical paradise with rich culture.' },
  { id: '5', name: 'Vietnam', type: 'International', image: PICS.vietnam, description: 'Vibrant culture and stunning landscapes.' },
  { id: '6', name: 'Thailand', type: 'International', image: PICS.thailand, description: 'Beaches, temples, and vibrant culture.' },
  { id: '7', name: 'Malaysia', type: 'International', image: PICS.malaysia, description: 'Diverse culture and beautiful landscapes.' },
  { id: '8', name: 'Australia', type: 'International', image: PICS.australia, description: 'Unique wildlife and stunning landscapes.' },
  { id: '9', name: 'Hong Kong', type: 'International', image: PICS.hongkong, description: 'Modern cityscape and vibrant culture.' },
  { id: '10', name: 'Cambodia', type: 'International', image: PICS.cambodia, description: 'Rich history and beautiful temples.' },
  { id: '11', name: 'Azerbaijan', type: 'International', image: PICS.azerbaijan, description: 'Cultural blend and historical sites.' },
  { id: '12', name: 'Singapore', type: 'International', image: PICS.singapore, description: 'Garden city with modern amenities.' }
];

export const DOMESTIC_DESTINATIONS: Destination[] = [
  { id: '6', name: 'Kerala', type: 'Domestic', image: PICS.kerala, description: "God's own country." },
  { id: '7', name: 'Goa', type: 'Domestic', image: PICS.goa, description: 'Beaches, parties, and serenity.' },
  { id: '8', name: 'Himachal', type: 'Domestic', image: PICS.himachal, description: 'The snowy peaks and lush valleys.' },
  { id: '5', name: 'Ladakh', type: 'Domestic', image: PICS.ladakh, description: 'The land of high passes.' },
  { id: '9', name: 'Rajasthan', type: 'Domestic', image: PICS.rajasthan, description: 'Royal palaces and desert mystique.' },
  { id: '10', name: 'Kashmir', type: 'Domestic', image: PICS.kashmir, description: 'Paradise on Earth with stunning landscapes.' },
  { id: '11', name: 'Srilanka', type: 'Domestic', image: PICS.srilanka, description: 'Island nation with rich culture and nature.' },
  { id: '12', name: 'Andaman & Nicobar', type: 'Domestic', image: PICS.andaman, description: 'Tropical paradise with pristine beaches.' },
  { id: '13', name: 'Sikkim', type: 'Domestic', image: PICS.sikkim, description: 'The land of dreams with breathtaking views.' },
  { id: '14', name: 'Wayanad', type: 'Domestic', image: PICS.wayanad, description: 'The greenest corner of Kerala with lush forests and waterfalls.' }
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
    id: 'int-6', 
    title: 'Ultimate Maldives Overwater Luxury', 
    price: '₹1,15,000', 
    image: PICS.maldives, 
    duration: '4N/5D', 
    destination: 'Maldives',
    itinerary: [
      { day: 1, title: 'Arrival in Malé', activities: 'Speedboat transfer to your private island resort.', hotel: 'Soneva Jani' },
      { day: 2, title: 'Snorkeling & Sandbank', activities: 'Guided snorkeling tour and private sandbank lunch.', hotel: 'Soneva Jani' },
      { day: 3, title: 'Spa & Sunset Cruise', activities: 'Traditional Balinese massage and dolphin sunset cruise.', hotel: 'Soneva Jani' },
      { day: 4, title: 'Leisure Day', activities: 'Full day at leisure to enjoy resort amenities.', hotel: 'Soneva Jani' },
      { day: 5, title: 'Departure', activities: 'Breakfast and return transfer to Malé airport.', hotel: 'N/A' }
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
    id: 'dom-6', 
    title: 'The High Pass Adventure: Ladakh', 
    price: '₹42,000', 
    image: PICS.ladakh, 
    duration: '5N/6D', 
    destination: 'Ladakh',
    itinerary: [
      { day: 1, title: 'Leh Arrival & Acclimatization', activities: 'Arrival at Leh airport. Full day rest to acclimatize.', hotel: 'The Grand Dragon Leh' },
      { day: 2, title: 'Leh City & Monasteries', activities: 'Visit Shanti Stupa, Leh Palace and Hall of Fame.', hotel: 'The Grand Dragon Leh' },
      { day: 3, title: 'Nubra Valley via Khardung La', activities: 'Drive to Nubra via world’s highest motorable pass.', hotel: 'Stone Hedge Ladakh' },
      { day: 4, title: 'Pangong Lake Excursion', activities: 'Visit the stunning Pangong Lake via Shyok river.', hotel: 'Pangong Sarai' },
      { day: 5, title: 'Return to Leh', activities: 'Drive back to Leh via Chang La Pass.', hotel: 'The Grand Dragon Leh' },
      { day: 6, title: 'Departure', activities: 'Transfer to Leh airport.', hotel: 'N/A' }
    ]
  },
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
  // Additional International Packages
  { 
    id: 'int-7', 
    title: 'Malaysian Wonders Tour', 
    price: '₹51,000', 
    image: PICS.malaysia, 
    duration: '5N/6D', 
    destination: 'Malaysia',
    itinerary: [
      { day: 1, title: 'Kuala Lumpur Arrival', activities: 'Welcome and Petronas Towers visit.', hotel: 'Hilton Kuala Lumpur' },
      { day: 2, title: 'City Exploration', activities: 'Batu Caves and National Mosque tour.', hotel: 'Hilton Kuala Lumpur' },
      { day: 3, title: 'Penang Island', activities: 'Drive to Penang. Georgetown heritage tour.', hotel: 'Eastern & Oriental Hotel' },
      { day: 4, title: 'Penang Beach & Culture', activities: 'Penang Hill and Kek Lok Si Temple visit.', hotel: 'Eastern & Oriental Hotel' },
      { day: 5, title: 'Return to Kuala Lumpur', activities: 'Shopping and leisure time.', hotel: 'Hilton Kuala Lumpur' },
      { day: 6, title: 'Departure', activities: 'Transfer to airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-8', 
    title: 'Australian Adventure', 
    price: '₹85,000', 
    image: PICS.australia, 
    duration: '6N/7D', 
    destination: 'Australia',
    itinerary: [
      { day: 1, title: 'Sydney Arrival', activities: 'Welcome and Opera House tour.', hotel: 'Park Hyatt Sydney' },
      { day: 2, title: 'Sydney Highlights', activities: 'Harbour Bridge climb and Bondi Beach.', hotel: 'Park Hyatt Sydney' },
      { day: 3, title: 'Blue Mountains Tour', activities: 'Three Sisters rock and scenic railway.', hotel: 'Echoes Boutique Hotel' },
      { day: 4, title: 'Wildlife Experience', activities: 'Taronga Zoo and animal encounters.', hotel: 'Park Hyatt Sydney' },
      { day: 5, title: 'Great Barrier Reef', activities: 'Fly to Cairns and reef snorkeling.', hotel: 'Reef House Luxury Resort' },
      { day: 6, title: 'Rainforest Adventure', activities: 'Daintree Rainforest exploration.', hotel: 'Reef House Luxury Resort' },
      { day: 7, title: 'Departure', activities: 'Return to Sydney and flight.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-9', 
    title: 'Hong Kong City Escape', 
    price: '₹56,000', 
    image: PICS.hongkong, 
    duration: '4N/5D', 
    destination: 'Hong Kong',
    itinerary: [
      { day: 1, title: 'Hong Kong Arrival', activities: 'Star Ferry ride and iconic skyline views.', hotel: 'Langham Hong Kong' },
      { day: 2, title: 'Peak Tram & Market', activities: 'Victoria Peak and Temple Street Night Market.', hotel: 'Langham Hong Kong' },
      { day: 3, title: 'Island Hopping', activities: 'Lantau Island and Big Buddha visit.', hotel: 'Langham Hong Kong' },
      { day: 4, title: 'Shopping & Culture', activities: 'IFC Mall and local markets exploration.', hotel: 'Langham Hong Kong' },
      { day: 5, title: 'Departure', activities: 'Transfer to airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-10', 
    title: 'Cambodian Heritage Explorer', 
    price: '₹52,000', 
    image: PICS.cambodia, 
    duration: '5N/6D', 
    destination: 'Cambodia',
    itinerary: [
      { day: 1, title: 'Siem Reap Arrival', activities: 'Welcome and local market visit.', hotel: 'Sofitel Angkor Phokeethra' },
      { day: 2, title: 'Angkor Wat Sunrise', activities: 'Sunrise at Angkor Wat temple complex.', hotel: 'Sofitel Angkor Phokeethra' },
      { day: 3, title: 'Angkor Exploration', activities: 'Bayon and Baphuon temple tours.', hotel: 'Sofitel Angkor Phokeethra' },
      { day: 4, title: 'Floating Villages', activities: 'Tonlé Sap Lake and floating markets.', hotel: 'Sofitel Angkor Phokeethra' },
      { day: 5, title: 'Artisan Workshops', activities: 'Traditional craftworks and silk weaving.', hotel: 'Sofitel Angkor Phokeethra' },
      { day: 6, title: 'Departure', activities: 'Transfer to airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-11', 
    title: 'Baku Modern Marvels', 
    price: '₹60,000', 
    image: PICS.baku, 
    duration: '4N/5D', 
    destination: 'Azerbaijan',
    itinerary: [
      { day: 1, title: 'Baku Arrival', activities: 'Old City tour and Flame Towers visit.', hotel: 'Fairmont Baku' },
      { day: 2, title: 'Baku City Tour', activities: 'Heydar Aliyev Center and Boulevard walk.', hotel: 'Fairmont Baku' },
      { day: 3, title: 'Mud Volcanoes & Fire', activities: 'Natural phenomena tour and Atashgah Fire Temple.', hotel: 'Fairmont Baku' },
      { day: 4, title: 'Extended Leisure', activities: 'Spa and traditional hammam experience.', hotel: 'Fairmont Baku' },
      { day: 5, title: 'Departure', activities: 'Transfer to airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'int-12', 
    title: 'Singapore City Marvel', 
    price: '₹67,000', 
    image: PICS.singapore, 
    duration: '4N/5D', 
    destination: 'Singapore',
    itinerary: [
      { day: 1, title: 'Singapore Arrival', activities: 'Marina Bay Sands hotel visit and Gardens by the Bay.', hotel: 'Marina Bay Sands' },
      { day: 2, title: 'City Exploration', activities: 'Universal Studios and Sentosa Island.', hotel: 'Marina Bay Sands' },
      { day: 3, title: 'Cultural Districts', activities: 'Chinatown, Arabian Quarter, and Indian Heritage centres.', hotel: 'Marina Bay Sands' },
      { day: 4, title: 'Nature & Adventure', activities: 'Singapore Zoo and Night Safari.', hotel: 'Marina Bay Sands' },
      { day: 5, title: 'Departure', activities: 'Transfer to airport.', hotel: 'N/A' }
    ]
  },
  // Additional Domestic Packages
  { 
    id: 'dom-7', 
    title: 'Sri Lankan Coastal Beauty', 
    price: '₹38,000', 
    image: PICS.srilanka, 
    duration: '5N/6D', 
    destination: 'Srilanka',
    itinerary: [
      { day: 1, title: 'Colombo Arrival', activities: 'City tour and beach relaxation.', hotel: 'Galle Face Hotel' },
      { day: 2, title: 'Kandy Journey', activities: 'Train ride and Temple of the Tooth visit.', hotel: 'The Kandy House' },
      { day: 3, title: 'Tea Plantations', activities: 'Nuwara Eliya tea garden tour.', hotel: 'St. Andrew\'s Hotel' },
      { day: 4, title: 'Mirissa Beach', activities: 'Whale watching and beach time.', hotel: 'Mirissa New Resort' },
      { day: 5, title: 'Galle Fort', activities: 'Historic fort exploration and seafood dinner.', hotel: 'The Galle Fort Hotel' },
      { day: 6, title: 'Departure', activities: 'Return to Colombo and flight.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-8', 
    title: 'Andaman Island Paradise', 
    price: '₹41,000', 
    image: PICS.andaman, 
    duration: '5N/6D', 
    destination: 'Andaman & Nicobar',
    itinerary: [
      { day: 1, title: 'Port Blair Arrival', activities: 'City tour and Cellular Jail visit.', hotel: 'Taj Exotica Andaman' },
      { day: 2, title: 'North Bay Island', activities: 'Snorkeling and glass bottom boat tour.', hotel: 'Taj Exotica Andaman' },
      { day: 3, title: 'Havelock Island', activities: 'Radhanagar Beach and water sports.', hotel: 'The Barefoot at Havelock' },
      { day: 4, title: 'Neil Island Exploration', activities: 'Laxmanpur Beach and coral reefs.', hotel: 'The Barefoot at Neil' },
      { day: 5, title: 'Underwater World', activities: 'Scuba diving and marine sanctuary visit.', hotel: 'Taj Exotica Andaman' },
      { day: 6, title: 'Departure', activities: 'Return to Port Blair and flight.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-9', 
    title: 'Sikkim Mountain Magic', 
    price: '₹36,000', 
    image: PICS.sikkim, 
    duration: '4N/5D', 
    destination: 'Sikkim',
    itinerary: [
      { day: 1, title: 'Gangtok Arrival', activities: 'City tour and Rumtek Monastery visit.', hotel: 'The Elgin Sikkim' },
      { day: 2, title: 'Tsomgo Lake Trek', activities: 'High altitude lake and Baba Mandir pilgrimage.', hotel: 'The Elgin Sikkim' },
      { day: 3, title: 'Kanyam Exploration', activities: 'Scenic beauty and organic farming experience.', hotel: 'Soar Sikkim' },
      { day: 4, title: 'Pelling Caves', activities: 'Ravangla and Maenam Hill visit.', hotel: 'The Elgin Sikkim' },
      { day: 5, title: 'Departure', activities: 'Transfer to airport.', hotel: 'N/A' }
    ]
  },
  { 
    id: 'dom-10', 
    title: 'Wayanad Wilderness Escape', 
    price: '₹32,000', 
    image: PICS.wayanad, 
    duration: '4N/5D', 
    destination: 'Wayanad',
    itinerary: [
      { day: 1, title: 'Wayanad Arrival', activities: 'Scenic drive and plantation tour.', hotel: 'Tranquil Wayanad Resort' },
      { day: 2, title: 'Waterfall Adventure', activities: 'Soochipara Falls and jungle trekking.', hotel: 'Tranquil Wayanad Resort' },
      { day: 3, title: 'Wildlife Sanctuary', activities: 'Muthanga Wildlife Sanctuary visit.', hotel: 'Tranquil Wayanad Resort' },
      { day: 4, title: 'Adventure Activities', activities: 'Rock climbing and cave exploration.', hotel: 'Tranquil Wayanad Resort' },
      { day: 5, title: 'Departure', activities: 'Return journey.', hotel: 'N/A' }
    ]
  },
];

/* GALLERY_IMAGES is generated above by globbing all files in assets/image. */

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
  { code: '+66', country: 'Thailand', flag: 'TH' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+62', country: 'Bali', flag: 'BA' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+84', country: 'Vietnam', flag: 'VN' },
  { code: '+855', country: 'Cambodia', flag: 'KH' },
  { code: '+852', country: 'HongKong', flag: 'HK' },
  { code: '+994', country: 'Baku', flag: 'AZ' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  
];
