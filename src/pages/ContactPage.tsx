import React, { useState } from 'react';
import { CheckCircle2, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menu';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError('Please complete your name, phone or email, and message.');
      return;
    }
    setError('');
    setSubmitted(true);
    setName('');
    setContact('');
    setMessage('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
      <div className="pb-6 border-b border-[#E5DDD0]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
          Get in Touch
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#2B1810]">
          Contact {RESTAURANT_CONFIG.name}
        </h1>
        <p className="mt-2 text-sm text-[#5C4B41]">
          Note: Address, phone, WhatsApp, and map location below use clear placeholders until your live restaurant details are added.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Details & Map Placeholder */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-[#2B1810]">
              Restaurant Information
            </h2>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#6B1826] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#2B1810]">Restaurant Address</p>
                <p className="mt-0.5 text-sm text-[#5C4B41]">
                  {RESTAURANT_CONFIG.addressPlaceholder}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#6B1826] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#2B1810]">Phone Number</p>
                <p className="mt-0.5 text-sm text-[#5C4B41]">
                  {RESTAURANT_CONFIG.phoneDisplayPlaceholder}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-[#1E6B3A] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#2B1810]">WhatsApp Order Desk</p>
                <p className="mt-0.5 text-sm text-[#5C4B41]">
                  {RESTAURANT_CONFIG.whatsappDisplayPlaceholder}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#6B1826] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#2B1810]">Opening Hours</p>
                <ul className="mt-1 space-y-1 text-sm text-[#5C4B41]">
                  {RESTAURANT_CONFIG.openingHours.map((slot) => (
                    <li key={slot.label}>
                      <span className="font-medium text-[#2B1810]">{slot.label}:</span>{' '}
                      <span className="tabular-nums">{slot.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Google Maps Location Placeholder */}
          <div className="bg-[#F2EAE0] border border-[#D8CCBC] rounded-2xl p-8 text-center">
            <MapPin className="w-8 h-8 text-[#6B1826] mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold text-[#2B1810]">
              Google Maps Location Placeholder
            </h3>
            <p className="mt-1.5 text-xs text-[#5C4B41] max-w-md mx-auto leading-relaxed">
              Embed your verified Google Maps location iframe or coordinates here once your physical restaurant address is finalized.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-6 bg-white border border-[#E5DDD0] rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-[#2B1810] mb-1">
            Send Us a Message
          </h2>
          <p className="text-xs text-[#5C4B41] mb-6">
            Have an inquiry about catering, family meals, or feedback? Write to us below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-[#2B1810] mb-1">
                Full Name <span className="text-[#8C1D2D]">*</span>
              </label>
              <input
                id="contactName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="Enter your name"
                className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
              />
            </div>

            <div>
              <label htmlFor="contactPhoneEmail" className="block text-sm font-medium text-[#2B1810] mb-1">
                Phone Number or Email <span className="text-[#8C1D2D]">*</span>
              </label>
              <input
                id="contactPhoneEmail"
                type="text"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="e.g., 9876543210 or name@example.com"
                className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
              />
            </div>

            <div>
              <label htmlFor="contactMessage" className="block text-sm font-medium text-[#2B1810] mb-1">
                Message <span className="text-[#8C1D2D]">*</span>
              </label>
              <textarea
                id="contactMessage"
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="Write your question or inquiry here..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
              />
            </div>

            {error && <p className="text-xs text-[#8C1D2D]">{error}</p>}

            {submitted && (
              <div className="p-3.5 rounded-lg bg-[#E8F5EE] text-[#1E6B3A] text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Thank you! Your inquiry has been recorded in this demo form. For urgent orders, please use our WhatsApp order desk.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
