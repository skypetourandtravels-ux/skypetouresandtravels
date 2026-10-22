import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, BookingRecord, CustomItinerary, TourPackage } from '../types/travel';
import { CURRENCY_RATES, INITIAL_BOOKINGS, TOUR_PACKAGES } from '../data/travelData';

interface TravelContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountUSD: number) => string;
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, 'bookingId' | 'createdAt' | 'status'>) => BookingRecord;
  findBooking: (bookingId: string) => BookingRecord | undefined;
  activePackageModal: TourPackage | null;
  setActivePackageModal: (pkg: TourPackage | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatInitialPrompt: string | null;
  setChatInitialPrompt: (prompt: string | null) => void;
  isBookingLookupOpen: boolean;
  setIsBookingLookupOpen: (open: boolean) => void;
  selectedBookingForView: BookingRecord | null;
  setSelectedBookingForView: (booking: BookingRecord | null) => void;
  currentDraftItinerary: CustomItinerary | null;
  setCurrentDraftItinerary: React.Dispatch<React.SetStateAction<CustomItinerary | null>>;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('skype_travel_currency');
      if (saved && ['INR', 'USD', 'EUR', 'GBP', 'AED'].includes(saved)) {
        return saved as CurrencyCode;
      }
    } catch {
      // ignore
    }
    return 'INR';
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('skype_travel_currency', c);
    } catch {
      // ignore
    }
  };

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('skype_travel_bookings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to initial
    }
    return INITIAL_BOOKINGS;
  });

  const [activePackageModal, setActivePackageModal] = useState<TourPackage | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | null>(null);
  const [isBookingLookupOpen, setIsBookingLookupOpen] = useState(false);
  const [selectedBookingForView, setSelectedBookingForView] = useState<BookingRecord | null>(null);
  const [currentDraftItinerary, setCurrentDraftItinerary] = useState<CustomItinerary | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('skype_travel_bookings', JSON.stringify(bookings));
    } catch {
      // silent
    }
  }, [bookings]);

  const formatPrice = (amountUSD: number): string => {
    const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = Math.round(amountUSD * rateInfo.rate);
    const formattedNum = currency === 'INR'
      ? converted.toLocaleString('en-IN')
      : converted.toLocaleString();

    if (currency === 'AED') {
      return `${formattedNum} ${rateInfo.symbol}`;
    }
    return `${rateInfo.symbol}${formattedNum}`;
  };

  const addBooking = (newBookingData: Omit<BookingRecord, 'bookingId' | 'createdAt' | 'status'>): BookingRecord => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `ST-${randomNum}`;
    const newRecord: BookingRecord = {
      ...newBookingData,
      bookingId,
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const findBooking = (bookingId: string) => {
    const cleanId = bookingId.trim().toUpperCase();
    return bookings.find((b) => b.bookingId.toUpperCase() === cleanId);
  };

  return (
    <TravelContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        bookings,
        addBooking,
        findBooking,
        activePackageModal,
        setActivePackageModal,
        isChatOpen,
        setIsChatOpen,
        chatInitialPrompt,
        setChatInitialPrompt,
        isBookingLookupOpen,
        setIsBookingLookupOpen,
        selectedBookingForView,
        setSelectedBookingForView,
        currentDraftItinerary,
        setCurrentDraftItinerary,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
