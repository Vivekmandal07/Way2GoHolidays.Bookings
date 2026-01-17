import React, { DetailedHTMLProps, HTMLAttributes, CSSProperties } from 'react';

export interface Destination {
  id: string;
  name: string;
  type: 'International' | 'Domestic';
  image: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string;
  hotel: string;
  rating?: number;
}

export interface Package {
  id: string;
  title: string;
  price: string;
  image: string;
  duration: string;
  destination: string;
  itinerary: ItineraryDay[];
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelDate: string;
  pax: number;
  children: number;
  childAges: string[];
  specialRequest: string;
}

export interface PackageFormData {
  name: string;
  leavingFrom: string;
  destination: string;
  pax: number;
  children: number;
  childAges: string[];
  travelDate: string;
}

// Fix: Augmenting the React.JSX namespace directly within the global scope.
// We import and use DetailedHTMLProps, HTMLAttributes, and CSSProperties directly 
// to avoid the name collision that occurs when using the 'React.' prefix inside 
// the augmented 'React' namespace declaration.
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'ion-icon': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
          name?: string;
          class?: string;
          style?: CSSProperties;
        };
      }
    }
  }
}
