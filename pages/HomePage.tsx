import React from 'react';
import { NavLink } from 'react-router-dom';
import MeasurementCard from '../components/MeasurementCard';
import { CollectionItem } from '../types';

interface HomePageProps {
  onCustomizeGarment: (garmentId: string) => void;
  onOpenLookbook: (item: CollectionItem) => void;
  sampleCollection: CollectionItem[];
}

const HomePage: React.FC<HomePageProps> = ({ onCustomizeGarment, onOpenLookbook, sampleCollection }) => {
  return (
    <section id="page-home" className="page-content">
      <div className="hero-gradient relative min-h-[76vh] flex items-center justify-center">
        <div className="hero-overlay"></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 py-12">
          {/* Huge faint HM as background */}
          <div className="hidden sm:block flex-1">
            <div className="hero-hm select-none">HM</div>
          </div>

          <div className="flex-1 z-10 text-center md:text-left">
            <div className="mb-6">
              <div className="text-sm text-[var(--brand-rich)] font-semibold uppercase tracking-wider">Bespoke • Modest • Elegant</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 text-[var(--brand-dark)]">House of Miraal</h1>
            <div className="logo-script text-2xl mb-6">Exquisite custom wear, tailored to perfection</div>
            <p className="text-gray-700 mb-8">We combine traditional craftsmanship and modern tailoring techniques to deliver garments that fit beautifully and last a lifetime.</p>

            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              <NavLink to="/collection" className="btn-primary bg-[var(--brand-dark)] text-white px-6 py-3 rounded-md hover:opacity-95 transition">
                View Collection
              </NavLink>
              <NavLink to="/custom-order" className="btn-secondary border border-[var(--brand-accent)] text-[var(--brand-dark)] px-6 py-3 rounded-md hover:bg-[var(--brand-accent)] hover:text-white transition">
                Start Custom Order
              </NavLink>
              <button
                onClick={() => sampleCollection.length > 0 && onOpenLookbook(sampleCollection[0])}
                className="inline-block px-4 py-3 text-sm text-[var(--brand-rich)] underline hover:opacity-80 transition"
                aria-label="View Lookbook"
              >
                View Lookbook →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-[var(--brand-dark)] text-center mb-12">Why Choose House of Miraal</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <MeasurementCard
              icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>}
              title="Perfect Fit Guaranteed"
              description="Measurements are treated with precision — tailored to your unique shape for the most flattering fit."
              accentColorClass="bg-[var(--brand-dark)]"
            />
            <MeasurementCard
              icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4a1 1 0 001 1h3"/></svg>}
              title="Premium Fabrics"
              description="Luxurious fabric options chosen for comfort, drape and longevity."
              accentColorClass="bg-[var(--brand-accent)]"
            />
            <MeasurementCard
              icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>}
              title="Expert Craftsmanship"
              description="Time-honored skills combined with modern precision to create garments you'll cherish."
              accentColorClass="bg-[var(--brand-rich)]"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl text-center font-black mb-10 text-[var(--brand-dark)]">How it Works</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[var(--brand-dark)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h4 className="font-semibold mb-2 text-[var(--brand-dark)]">Choose Style</h4>
              <p className="text-sm text-gray-600">Select a garment from our curated collection or bring your own design idea.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[var(--brand-accent)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h4 className="font-semibold mb-2 text-[var(--brand-dark)]">Provide Measurements</h4>
              <p className="text-sm text-gray-600">Follow our guided measurement form for precise sizing, ensuring a perfect fit.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[var(--brand-rich)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h4 className="font-semibold mb-2 text-[var(--brand-dark)]">Customize Details</h4>
              <p className="text-sm text-gray-600">Choose fabric, color, intricate embroidery, and other finishing touches.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[var(--brand-dark)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h4 className="font-semibold mb-2 text-[var(--brand-dark)]">Receive Your Garment</h4>
              <p className="text-sm text-gray-600">Your custom-tailored garment is delivered to your door, or available for studio collection.</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default HomePage;