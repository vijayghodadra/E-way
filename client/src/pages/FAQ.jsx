import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'Are Élixir Botanicals products suitable for sensitive skin?',
      a: 'Yes. All our products are dermatologically certified, non-comedogenic, and completely free from synthetic fragrances, artificial colorants, and harsh parabens.'
    },
    {
      q: 'What is the estimated delivery time?',
      a: 'We ship via BlueDart Express. Orders placed before 2 PM are dispatched the same day and delivered within 2-4 business days across India.'
    },
    {
      q: 'How do I apply for a refund or product replacement?',
      a: 'We offer a 14-day Botanical Guarantee. If you are unsatisfied, contact our concierge with your order ID for an instant replacement or refund.'
    }
  ];

  return (
    <>
      <SEO title="Frequently Asked Questions" />

      <div className="bg-secondary py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl font-bold text-text">Frequently Asked Questions</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              className="w-full text-left font-playfair font-semibold text-base text-text flex justify-between items-center"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openIdx === idx ? 'rotate-180 text-primary' : ''}`} />
            </button>
            {openIdx === idx && (
              <p className="text-xs text-stone-600 font-light mt-3 leading-relaxed border-t border-stone-100 pt-3">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
