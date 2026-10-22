export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyRate {
  symbol: string;
  rate: number; // multiplier relative to USD
}

export type TravelStyle = 'Ultra-Luxury' | 'Romantic Escape' | 'Wilderness Expedition' | 'Cultural Heritage' | 'Wellness & Spa';

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  country: string;
  durationDays: number;
  durationNights: number;
  pricePerPersonUSD: number;
  featuredImage: string;
  galleryImages: string[];
  travelStyle: TravelStyle;
  rating: number;
  reviewCount: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  dailyProgram: {
    day: number;
    title: string;
    description: string;
    location: string;
    stay: string;
  }[];
  bestTimeToVisit: string;
  groupSizeLimit: number;
  availability: 'Available' | 'Few Seats Remaining' | 'Private on Demand';
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  origin: { code: string; city: string; airport: string };
  destination: { code: string; city: string; airport: string };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  cabinClass: 'First Suite' | 'Business Class' | 'Private Jet Charter';
  priceUSD: number;
  stops: number;
  perks: string[];
}

export interface HotelSuite {
  id: string;
  name: string;
  location: string;
  country: string;
  category: string;
  pricePerNightUSD: number;
  rating: number;
  reviews: number;
  image: string;
  roomType: string;
  amenities: string[];
  exclusivePerks: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  category: 'Sightseeing' | 'Culinary' | 'Adventure' | 'Wellness' | 'Culture' | 'VIP Access';
  durationHours: number;
  priceUSD: number;
  location: string;
  description: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
}

export interface ItineraryDayPlan {
  dayNumber: number;
  date?: string;
  title: string;
  location: string;
  hotelStay: string;
  activities: ActivityItem[];
  transportMode: 'Private Chauffeur' | 'Helicopter Transfer' | 'Scenic Train' | 'Private Yacht' | 'Domestic Flight';
  notes: string;
}

export interface CustomItinerary {
  id: string;
  tripTitle: string;
  destination: string;
  startDate: string;
  travelersCount: number;
  preferredStyle: TravelStyle;
  days: ItineraryDayPlan[];
  estimatedTotalUSD: number;
  clientNotes: string;
}

export interface BookingRecord {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: 'Tour Package' | 'First Class Flight' | 'Luxury Suite' | 'Custom Itinerary';
  itemTitle: string;
  destination: string;
  dates: string;
  guests: number;
  totalAmountUSD: number;
  currency: CurrencyCode;
  status: 'Confirmed' | 'Pending Concierge Review' | 'Voucher Issued';
  createdAt: string;
  specialRequests?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentName?: string;
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  travelCard?: {
    type: 'package' | 'hotel' | 'flight';
    id: string;
    title: string;
    price: string;
    image?: string;
  };
}
