import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { enquiryFailureMessage, sendEnquiry } from '../../data/skypeData';
import { BookingRecord } from '../../types/travel';
import { X, CheckCircle, ShieldCheck, Ticket, Download, MessageSquareCode, QrCode, Calendar, Users, Phone, Mail, User } from 'lucide-react';

interface BookingCheckoutModalProps {
  itemType: 'Tour Package' | 'First Class Flight' | 'Luxury Suite' | 'Custom Itinerary';
  title: string;
  destination: string;
  basePriceUSD: number;
  initialGuests?: number;
  onClose: () => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  itemType,
  title,
  destination,
  basePriceUSD,
  initialGuests = 2,
  onClose,
}) => {
  const { formatPrice, setIsChatOpen, setChatInitialPrompt } = useTravel();

  const [leadName, setLeadName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('2026-11-15');
  const [guests, setGuests] = useState(initialGuests);
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [emailed, setEmailed] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For flights or packages: per-person rate. For hotel suites: per-night rate (assume 4 nights standard)
  const isHotel = itemType === 'Luxury Suite';
  const totalAmountUSD = isHotel ? basePriceUSD * 4 : basePriceUSD * guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !phone) return;

    setIsSubmitting(true);
    setSendError('');
    try {
      await sendEnquiry(`Booking request: ${itemType} – ${title}`, {
        Service: itemType,
        Title: title,
        Destination: destination,
        Name: leadName,
        Phone: phone,
        ...(email ? { email } : {}),
        'Travel Date': travelDate,
        Guests: String(guests),
        'Quoted Amount': formatPrice(totalAmountUSD),
        Message: specialRequests || '-',
      });
      setEmailed(true);
    } catch (err) {
      setSendError(enquiryFailureMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleChatWithAdvisor = () => {
    if (confirmedBooking) {
      setChatInitialPrompt(`Hello, I just confirmed reservation #${confirmedBooking.bookingId} for ${confirmedBooking.itemTitle}. Could you assist me with specialized concierge requests?`);
      onClose();
      setIsChatOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-5 md:p-6 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block">
              Skype Tours & Travels · VIP Reservations
            </span>
            <h2 className="text-lg md:text-xl font-serif font-bold text-white">
              {emailed ? 'Request emailed to our travel desk' : confirmedBooking ? 'Reservation Confirmed & Voucher Issued' : `Reserve ${itemType}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          {emailed ? (
            <div className="py-10 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">Your details have been emailed.</p>
              <p className="text-sm text-zinc-400 mt-2">
                Skype Tours and Travels will contact you about {title}.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-4 py-2 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : confirmedBooking ? (
            /* Digital Voucher & Boarding Pass View */
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Ticket className="w-32 h-32 text-amber-300" />
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>OFFICIAL BOOKING CONFIRMATION & VOUCHER</span>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-800/80 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      {confirmedBooking.itemTitle}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{confirmedBooking.destination}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Booking Reference</span>
                    <span className="text-lg font-mono font-bold text-amber-400 tracking-wider">
                      {confirmedBooking.bookingId}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-zinc-500 block">Lead Guest</span>
                    <span className="text-zinc-200 font-medium truncate block">{confirmedBooking.clientName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Dates</span>
                    <span className="text-zinc-200 font-medium">{confirmedBooking.dates.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Travelers</span>
                    <span className="text-zinc-200 font-medium">{confirmedBooking.guests} Guests</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Total Settled</span>
                    <span className="text-amber-300 font-bold tabular-nums">
                      {formatPrice(confirmedBooking.totalAmountUSD)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800/60 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white p-1 rounded-md shrink-0 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold block">VIP Priority Concierge Assigned</span>
                      <span className="text-[11px] text-zinc-400">Your private director is notified and reviewing bespoke touches.</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 rounded">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Official Itinerary Voucher</span>
                </button>

                <button
                  onClick={handleChatWithAdvisor}
                  className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <MessageSquareCode className="w-4 h-4 text-zinc-950" />
                  <span>Chat with Assigned Travel Director</span>
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-zinc-400 block">{itemType}</span>
                  <span className="text-sm font-semibold text-zinc-100">{title}</span>
                  <span className="text-xs text-zinc-400 block mt-0.5">{destination}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 block">Total Est.</span>
                  <span className="text-lg font-bold text-amber-400 tabular-nums">
                    {formatPrice(totalAmountUSD)}
                  </span>
                </div>
              </div>

              {/* Guest Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lead Voyager Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Lord Julian Sterling"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/70"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Direct Email Address (optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@familyoffice.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/70"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contact Phone / WhatsApp *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 20 7946 0912"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/70"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Preferred Departure Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400/70"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Number of Travelers</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400/70 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num} className="bg-zinc-900">
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-300 mb-1.5 block">
                    Special Concierge Instructions & Dining Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. VIP tarmac luggage escort, vintage Dom Pérignon on ice, dietary restrictions, anniversary floral display..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/70 resize-none"
                  />
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex items-center gap-3 p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/40 text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero cancellation fees up to 14 days prior. Bespoke white-glove itinerary coordination with 100% financial guarantee.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                {sendError && <p className="text-xs text-rose-400 mb-3">{sendError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Emailing your booking request...</span>
                  ) : (
                    <span>Email booking request ({formatPrice(totalAmountUSD)})</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
