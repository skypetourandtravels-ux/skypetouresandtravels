import React from 'react';
import { useTravel } from '../context/TravelContext';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_TEL, ENQUIRY_EMAIL } from '../data/skypeData';

export const Footer: React.FC = () => {
  const { setIsBookingLookupOpen, setIsChatOpen } = useTravel();

  return (
    <footer className="w-full bg-white border-t border-stone-200 text-stone-600 text-xs py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-200">
          {/* Col 1: Wordmark & Heritage */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/images/skype-logo-mark.jpg" alt="" className="h-16 w-auto" />
              <img src="/images/skype-logo-wordmark.jpg" alt="Skype Tours Travels" className="h-8 w-auto max-w-[11rem]" />
            </div>
            <p className="text-stone-600 text-xs leading-relaxed font-light">
              Flight, bus, train, hotel and holiday bookings, with airport and local travel in ordinary cars.
            </p>
            <div className="flex items-center gap-2 text-stone-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Virtuoso Partner & IATA Accredited #96-2 0184</span>
            </div>
          </div>

          {/* Col 2: Sanctuaries */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-widest">
              Signature Sanctuaries
            </h4>
            <ul className="space-y-2 text-stone-600 text-xs">
              <li>
                <a href="#destinations" className="hover:text-amber-700 transition-colors">
                  The Swiss Alps & St. Moritz
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-amber-700 transition-colors">
                  Maldives Overwater Atolls
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-amber-700 transition-colors">
                  Amalfi Coastline & Capri
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-amber-700 transition-colors">
                  Maasai Mara Sky Safari
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-amber-700 transition-colors">
                  French Riviera Yachting
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: VIP Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-widest">
              Bespoke Portals
            </h4>
            <ul className="space-y-2 text-stone-600 text-xs">
              <li>
                <a href="#domestic-packages" className="hover:text-amber-700 transition-colors">
                  Domestic Packages
                </a>
              </li>
              <li>
                <a href="#international-packages" className="hover:text-amber-700 transition-colors">
                  International Packages
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-700 transition-colors">
                  Flight, Bus, Train & Transport Booking
                </a>
              </li>
              <li>
                <a href="#itinerary-builder" className="hover:text-amber-700 transition-colors">
                  Plan My Trip
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsBookingLookupOpen(true)}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-left"
                >
                  Inspect Digital Itinerary Voucher
                </button>
              </li>
              <li>
                <a href="#faqs" className="hover:text-amber-700 transition-colors">
                  Frequently Asked Questions (FAQ)
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-left"
                >
                  Direct Concierge Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Private Desks & Offices */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-widest">
              Contact
            </h4>
            <div className="space-y-2 text-xs text-stone-600">
              <p className="leading-relaxed">
                Call or email the desk for flight, bus, train, hotel, transport and visa bookings.
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="hover:text-amber-700 font-medium text-stone-900">
                  {CONTACT_PHONE}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <a href={`mailto:${ENQUIRY_EMAIL}`} className="hover:text-amber-700">
                  {ENQUIRY_EMAIL}
                </a>
              </p>
            </div>

          </div>
        </div>

        {/* Quiet copyright & legal notices */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Skype Tours and Travels Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-800 transition-colors cursor-pointer">Bespoke Terms</span>
            <span>·</span>
            <span className="hover:text-stone-800 transition-colors cursor-pointer">Privacy Charter</span>
            <span>·</span>
            <span className="hover:text-stone-800 transition-colors cursor-pointer">Aviation Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
