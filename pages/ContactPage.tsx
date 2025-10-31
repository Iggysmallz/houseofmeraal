import React, { useState, useCallback, useEffect } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('hofm_last_page', 'contact');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message — we will get back to you shortly.');
    setName('');
    setEmail('');
    setMessage('');
  }, []);

  return (
    <section id="page-contact" className="page-content py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-4 text-[var(--brand-dark)]">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold mb-1 text-[var(--brand-dark)]">Name</label>
              <input
                id="contact-name"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold mb-1 text-[var(--brand-dark)]">Email</label>
              <input
                id="contact-email"
                type="email"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold mb-1 text-[var(--brand-dark)]">Message</label>
              <textarea
                id="contact-message"
                required
                className="w-full p-3 border border-gray-300 rounded h-28 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div>
              <button type="submit" className="bg-[var(--brand-dark)] text-white px-6 py-3 rounded hover:opacity-95 transition">
                Send Message
              </button>
            </div>
          </form>

          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="font-bold mb-2 text-[var(--brand-dark)]">Visit / Call</h4>
            <p className="text-gray-700 mb-2">📞 0610468405</p>
            <p className="text-gray-700 mb-2">✉️ houseofmiraalfashion@gmail.com</p>
            <p className="text-gray-700">Mon-Sat: 9AM - 6PM</p>
            <div className="mt-4">
              <h4 className="font-bold mb-2 text-[var(--brand-dark)]">Our Studio</h4>
              <p className="text-gray-700">123 Bespoke Lane,</p>
              <p className="text-gray-700">Fashion City, FC 01234</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;