import React, { useState } from 'react';
import { CheckCircle, Loader2, Send, X } from 'lucide-react';
import { ENQUIRY_EMAIL, enquiryFailureMessage, sendEnquiry } from '../data/skypeData';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

const inputCls =
  'w-full bg-white border border-stone-300 focus:border-amber-600 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors';

export const ServiceEnquiryModal: React.FC<{ service: string; onClose: () => void }> = ({ service, onClose }) => {
  const isAttestation = service === 'Certificate Attestation';
  const isPoliceClearance = service === 'Passport Police Clearance Certificate';
  const isGccMedical = service === 'GCC Medical Appointment';
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    from: '',
    to: '',
    certificate: '',
    place: '',
    travelDate: '',
    travellers: '',
    message: '',
  });
  const [state, setState] = useState<SendState>('idle');
  const [errorText, setErrorText] = useState('');

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await sendEnquiry(`Booking request: ${service}`, {
        Service: service,
        Name: form.name,
        Phone: form.phone,
        Email: form.email,
        ...(form.email ? { email: form.email } : {}),
        ...(isAttestation
          ? { 'Certificate to attest': form.certificate }
          : isGccMedical
            ? { 'Place for medical appointment': form.place }
            : isPoliceClearance
              ? {}
              : { 'From city': form.from, 'To city': form.to }),
        'Travel date': form.travelDate,
        Travellers: form.travellers,
        'Other details': form.message,
      });
      setState('sent');
    } catch (err) {
      setErrorText(enquiryFailureMessage(err));
      setState('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50" onClick={onClose}>
      <div
        role="dialog"
        aria-labelledby="service-enquiry-title"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-stone-200 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">Book with Skype Tours</p>
            <h2 id="service-enquiry-title" className="text-xl font-serif font-bold text-stone-900 mt-1">
              {service}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Enter your details. We email them to our desk at {ENQUIRY_EMAIL}.
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="text-stone-400 hover:text-stone-900 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {state === 'sent' ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <p className="text-stone-900 font-semibold">Your request has been emailed.</p>
            <p className="text-sm text-stone-500 mt-1">Our team will contact you shortly about {service}.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 px-4 py-2 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Your name *" value={form.name} onChange={update('name')} className={inputCls} />
            <input required type="tel" placeholder="Phone number *" value={form.phone} onChange={update('phone')} className={inputCls} />
            <input type="email" placeholder="Email (optional)" value={form.email} onChange={update('email')} className={`${inputCls} sm:col-span-2`} />
            {isAttestation ? (
              <input
                required
                placeholder="Which certificate needs to be attested *"
                value={form.certificate}
                onChange={update('certificate')}
                className={`${inputCls} sm:col-span-2`}
              />
            ) : isGccMedical ? (
              <input
                required
                placeholder="Place for medical appointment *"
                value={form.place}
                onChange={update('place')}
                className={`${inputCls} sm:col-span-2`}
              />
            ) : isPoliceClearance ? null : (
              <>
                <input placeholder="From (city)" value={form.from} onChange={update('from')} className={inputCls} />
                <input placeholder="To (city)" value={form.to} onChange={update('to')} className={inputCls} />
              </>
            )}
            <input type="date" value={form.travelDate} onChange={update('travelDate')} className={inputCls} aria-label="Travel date" />
            <input type="number" min={1} placeholder="Travellers" value={form.travellers} onChange={update('travellers')} className={inputCls} />
            <textarea
              rows={3}
              placeholder={
                isAttestation
                  ? 'Any other details about the attestation'
                  : isPoliceClearance
                    ? 'Any other details about the police clearance'
                    : isGccMedical
                      ? 'Any other details about the medical appointment'
                      : 'Route, dates, hotel, visa or other requirements'
              }
              value={form.message}
              onChange={update('message')}
              className={`${inputCls} sm:col-span-2 resize-none`}
            />
            {state === 'error' && <p className="sm:col-span-2 text-xs text-rose-600">{errorText}</p>}
            <button
              type="submit"
              disabled={state === 'sending'}
              className="sm:col-span-2 py-2.5 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              {state === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {state === 'sending' ? 'Sending…' : 'Email my booking request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
