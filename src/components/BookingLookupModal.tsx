import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { BookingRecord } from '../types/travel';
import { X, Search, Ticket, CheckCircle2, Download, MessageSquareCode, Calendar, Users, QrCode, ShieldCheck } from 'lucide-react';

export const BookingLookupModal: React.FC = () => {
  const {
    isBookingLookupOpen,
    setIsBookingLookupOpen,
    selectedBookingForView,
    setSelectedBookingForView,
    findBooking,
    formatPrice,
    setIsChatOpen,
    setChatInitialPrompt,
  } = useTravel();

  const [searchCode, setSearchCode] = useState('ST-8921');
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(selectedBookingForView || findBooking('ST-8921') || null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isBookingLookupOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const found = findBooking(searchCode);
    if (found) {
      setActiveBooking(found);
    } else {
      setErrorMsg(`No booking record found for reference "${searchCode}". Try sample reference ST-8921.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleChatAboutBooking = () => {
    if (activeBooking) {
      setChatInitialPrompt(`I would like to ask about booking ${activeBooking.bookingId} for "${activeBooking.itemTitle}".`);
      setIsBookingLookupOpen(false);
      setIsChatOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest block">
              Skype Tours & Travels · Central Ledger
            </span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-white">
              VIP Booking & Digital Itinerary Voucher Lookup
            </h2>
          </div>
          <button
            onClick={() => {
              setIsBookingLookupOpen(false);
              setSelectedBookingForView(null);
            }}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Lookup Input Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Booking Reference (e.g. ST-8921)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 uppercase tracking-wider font-mono placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Active Booking Voucher */}
          {activeBooking ? (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
                      {activeBooking.serviceType}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                      {activeBooking.itemTitle}
                    </h3>
                    <p className="text-xs text-amber-300/90 mt-1">{activeBooking.destination}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Reference ID</span>
                    <span className="text-xl font-mono font-bold text-amber-400">
                      {activeBooking.bookingId}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 rounded">
                      {activeBooking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-zinc-500 block">Lead Guest</span>
                    <span className="text-zinc-200 font-medium block truncate">{activeBooking.clientName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Dates</span>
                    <span className="text-zinc-200 font-medium block truncate">{activeBooking.dates}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Guests</span>
                    <span className="text-zinc-200 font-medium">{activeBooking.guests} Travelers</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Total Settled</span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      {formatPrice(activeBooking.totalAmountUSD)}
                    </span>
                  </div>
                </div>

                {activeBooking.specialRequests && (
                  <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs mb-4">
                    <span className="text-zinc-400 font-medium block mb-0.5">Special Concierge Requests:</span>
                    <span className="text-zinc-300">{activeBooking.specialRequests}</span>
                  </div>
                )}

                <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white p-1 rounded-md shrink-0 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <span className="text-zinc-200 font-semibold block">Skype VIP Fast-Track Pass</span>
                      <span className="text-[11px] text-zinc-400">Scan at private aviation FBO or palace concierge desk</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified</span>
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
                  <span>Download Voucher PDF</span>
                </button>

                <button
                  onClick={handleChatAboutBooking}
                  className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquareCode className="w-4 h-4 text-zinc-950" />
                  <span>Request Concierge Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500">
              Enter your booking reference code to view your voucher.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
