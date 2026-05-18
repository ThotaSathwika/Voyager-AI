export interface UserPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'moderate' | 'luxury';
  travelers: number;
  interests: string[];
}

export interface Flight {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  isSmartChoice?: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  recommendationReason?: string;
  location: string;
}

export interface TripPlan {
  destination: string;
  summary: string;
  flights: Flight[];
  hotels: Hotel[];
  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];
}
