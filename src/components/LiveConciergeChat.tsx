import React, { useEffect, useRef, useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { ChatMessage } from '../types/travel';
import { CONTACT_PHONE, CONTACT_PHONE_TEL, ENQUIRY_EMAIL, sendEnquiry } from '../data/skypeData';
import { CheckCheck, Loader2, Send, X } from 'lucide-react';

const BOT_NAME = 'Skype Tours';

const welcome = (): ChatMessage => ({
  id: 'msg-welcome',
  sender: 'agent',
  agentName: BOT_NAME,
  text: 'Hello. I am the Skype Tours booking bot. Ask about flights, buses, trains, hotels, airport transport, holiday packages, visas, certificate attestation, police clearance or a GCC medical appointment. When you want the desk to take it further, leave your name and phone and I will email this chat to them.',
  timestamp: 'Just now',
  suggestedActions: ['Flight ticket', 'Bus ticket', 'Visa help', 'Leave my details'],
});

function botReply(text: string): { text: string; actions: string[] } {
  const q = text.toLowerCase();
  const next = ' Leave your name and phone number below. This chat is emailed to our desk, and they will contact you.';
  const actions = ['Leave my details'];

  if (/bus/.test(q)) {
    return { text: 'We book bus tickets. Share the boarding point, destination, travel date and how many people are travelling.' + next, actions };
  }
  if (/train/.test(q)) {
    return { text: 'We book train tickets. Share the from station, to station, class and travel date.' + next, actions };
  }
  if (/flight|air ticket|airline|plane/.test(q)) {
    return { text: 'We book domestic and international flight tickets. Share the from city, to city, travel date and number of travellers.' + next, actions };
  }
  if (/transport|cab|taxi|pickup|drop|airport/.test(q)) {
    return { text: 'We arrange airport pickup, drop-off and local transport. Share the place, date and flight time if you have one.' + next, actions };
  }
  if (/hotel|package|holiday|tour|kerala|dubai|goa|singapore/.test(q)) {
    return { text: 'We arrange hotels and domestic or international holiday packages. Tell me the destination, travel dates and how many people are going.' + next, actions };
  }
  if (/attest/.test(q)) {
    return { text: 'For certificate attestation, tell me which certificate needs to be attested, such as a degree, marriage certificate or birth certificate.' + next, actions };
  }
  if (/police|pcc|clearance/.test(q)) {
    return { text: 'We help with passport police clearance certificates. Share the passenger name and when you need it.' + next, actions };
  }
  if (/gcc|medical/.test(q)) {
    return { text: 'We book GCC medical appointments. Tell me the place where the medical appointment is needed.' + next, actions };
  }
  if (/visa|stamp|immigration/.test(q)) {
    return { text: 'We handle visa services, visa stamping, visiting visas and immigration clearance. Tell me the country and the type of visa.' + next, actions };
  }
  if (/courier|money|transfer/.test(q)) {
    return { text: 'We also handle courier and international money transfer requests. Describe what you need sent or transferred.' + next, actions };
  }
  return {
    text: 'I can help with flight, bus, train, hotel, transport, visa, attestation, police clearance and GCC medical bookings. Tell me which service you need, and the route or document if you already know it.' + next,
    actions,
  };
}

export const LiveConciergeChat: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatInitialPrompt, setChatInitialPrompt } = useTravel();
  const [messages, setMessages] = useState<ChatMessage[]>([welcome()]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', note: '' });
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | null>(null);

  useEffect(() => {
    if (isChatOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen, isTyping, showContact, sendState]);

  useEffect(() => {
    return () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current);
    };
  }, []);

  const pushBotReply = (text: string) => {
    setIsTyping(true);
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const answer = botReply(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: 'agent',
          agentName: BOT_NAME,
          text: answer.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: answer.actions,
        },
      ]);
      setIsTyping(false);
      setShowContact(true);
      setContact((c) => (c.note ? c : { ...c, note: text }));
    }, 600);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || sendState === 'sending') return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (!textToSend) setInputVal('');
    pushBotReply(text);
  };

  useEffect(() => {
    if (!chatInitialPrompt) return;
    handleSendMessage(chatInitialPrompt);
    setChatInitialPrompt(null);
    // The prompt is consumed once when another part of the site opens the chat.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInitialPrompt]);

  const handleAction = (action: string) => {
    if (action === 'Leave my details') {
      setShowContact(true);
      return;
    }
    handleSendMessage(action);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name.trim() || !contact.phone.trim()) return;
    setSendState('sending');
    const transcript = messages
      .filter((m) => m.id !== 'msg-welcome')
      .map((m) => `${m.sender === 'user' ? 'Customer' : 'Bot'}: ${m.text}`)
      .join('\n');
    try {
      await sendEnquiry(`Chat enquiry from ${contact.name.trim()}`, {
        Name: contact.name.trim(),
        Phone: contact.phone.trim(),
        ...(contact.email.trim() ? { email: contact.email.trim() } : {}),
        Request: contact.note.trim() || '-',
        Conversation: transcript || '-',
      });
      setSendState('sent');
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sent-${Date.now()}`,
          sender: 'agent',
          agentName: BOT_NAME,
          text: `Your name, phone and this chat have been emailed to ${ENQUIRY_EMAIL}. Our desk will contact you.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setSendState('error');
    }
  };

  const inputCls =
    'w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-400';

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-white border border-amber-300 rounded-full shadow-xl shadow-stone-900/10 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
          title="Open Skype Tours booking chat"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 font-serif font-bold text-sm shadow-md">
              ST
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="hidden sm:block text-left pr-2">
            <span className="text-[11px] font-semibold text-amber-700 block tracking-wider uppercase">Booking chat</span>
            <span className="text-xs font-serif text-stone-800">Skype Tours bot</span>
          </div>
        </button>
      )}

      {isChatOpen && (
        <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[600px] max-h-[88vh] bg-zinc-950 border border-zinc-800 shadow-2xl rounded-2xl flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-zinc-100">Skype Tours bot</h3>
              <p className="text-[11px] text-zinc-400">Answers here, then emails your details to the desk</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'agent' && (
                  <span className="text-[10px] text-amber-400/90 font-medium mb-1 pl-1">{msg.agentName}</span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-400 text-zinc-950 font-medium rounded-br-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="text-[10px] mt-1.5 text-right flex items-center justify-end gap-1 opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
                {msg.suggestedActions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.suggestedActions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => handleAction(action)}
                        className="px-2.5 py-1 rounded-full text-[11px] bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-800 cursor-pointer"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && <p className="text-[11px] text-zinc-500">Skype Tours is typing…</p>}
            <div ref={messagesEndRef} />
          </div>

          {showContact && sendState !== 'sent' && (
            <form onSubmit={handleContactSubmit} className="px-3 py-3 border-t border-zinc-800 bg-zinc-900 space-y-2">
              <p className="text-[11px] text-zinc-300">
                Name and phone are required. We email this chat to {ENQUIRY_EMAIL}, or call{' '}
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-amber-300 underline">{CONTACT_PHONE}</a>.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="Your name *"
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  className={inputCls}
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone number *"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <input
                type="email"
                placeholder="Email (optional)"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                className={inputCls}
              />
              <textarea
                rows={2}
                placeholder="What should we arrange?"
                value={contact.note}
                onChange={(e) => setContact((c) => ({ ...c, note: e.target.value }))}
                className={`${inputCls} resize-none`}
              />
              {sendState === 'error' && (
                <p className="text-[11px] text-rose-400">Could not send. Email {ENQUIRY_EMAIL} directly.</p>
              )}
              <button
                type="submit"
                disabled={sendState === 'sending'}
                className="w-full py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {sendState === 'sending' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Email my details to the desk
              </button>
            </form>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-zinc-900 border-t border-zinc-800 rounded-b-2xl flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about a flight, bus, visa or other booking"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              aria-label="Send message"
              className="p-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
