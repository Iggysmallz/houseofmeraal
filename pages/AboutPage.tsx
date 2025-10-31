import React, { useEffect } from 'react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    localStorage.setItem('hofm_last_page', 'about');
  }, []);

  return (
    <section id="page-about" className="page-content py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-4 text-[var(--brand-dark)]">About House of Miraal</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          House of Miraal is dedicated to blending the rich heritage of traditional attire with the precision and elegance of modern design. Our mission is to empower individuals through meticulously crafted garments that not only fit beautifully but also reflect their unique style and values. We believe that modesty and elegance can coexist harmoniously, creating timeless pieces that our clients will cherish for a lifetime.
        </p>
        <p className="text-gray-700 mb-8 leading-relaxed">
          Founded on principles of quality, craftsmanship, and personalized service, House of Miraal ensures every garment tells a story of artistry and dedication. From the initial consultation to the final fitting, we are committed to providing an unparalleled tailoring experience.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-bold mb-2 text-[var(--brand-dark)]">Custom Made</h4>
            <p className="text-gray-700">Every piece is tailored precisely to your unique body measurements and style preferences, ensuring a flawless fit.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-bold mb-2 text-[var(--brand-dark)]">Premium Fabrics</h4>
            <p className="text-gray-700">We meticulously select luxurious fabrics from trusted mills, chosen for their comfort, exquisite drape, and lasting quality.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-bold mb-2 text-[var(--brand-dark)]">Expert Craftsmanship</h4>
            <p className="text-gray-700">Our master tailors bring decades of experience and time-honored skills to every stitch, combined with modern precision.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;