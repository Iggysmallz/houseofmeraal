import React, { useEffect, useCallback } from 'react';

interface MeasurementsPageProps {
  onOpenModal: (title: string, content: React.ReactNode) => void;
  onCloseModal: () => void;
}

const MeasurementsPage: React.FC<MeasurementsPageProps> = ({ onOpenModal, onCloseModal }) => {
  useEffect(() => {
    localStorage.setItem('hofm_last_page', 'measurements');
  }, []);

  const openVisualGuide = useCallback(() => {
    onOpenModal(
      'Visual Measurement Guide',
      <div className="grid md:grid-cols-2 gap-4 text-[var(--brand-dark)]">
        <div>
          <h4 className="font-semibold mb-2">Top Measurements</h4>
          <ul className="text-gray-700 text-sm space-y-2">
            <li><strong>Height:</strong> From top of head to floor</li>
            <li><strong>Chest/Bust:</strong> Fullest part, tape parallel to floor</li>
            <li><strong>Waist:</strong> Natural waist, snug but not tight</li>
            <li><strong>Shoulder Width:</strong> From shoulder tip to tip</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Lower / Length</h4>
          <ul className="text-gray-700 text-sm space-y-2">
            <li><strong>Hip:</strong> Around fullest part of hips</li>
            <li><strong>Sleeve:</strong> From shoulder point to wrist</li>
            <li><strong>Garment Length:</strong> From neck base to desired hem</li>
          </ul>
        </div>
        <div className="md:col-span-2 mt-4 text-center">
          <button
            onClick={onCloseModal}
            className="px-4 py-2 border border-gray-300 rounded text-[var(--brand-dark)] hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }, [onOpenModal, onCloseModal]);

  return (
    <section id="page-measurements" className="page-content py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-6 text-[var(--brand-dark)]">How to Measure</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3 text-[var(--brand-dark)]">Top Tips</h3>
            <ul className="text-gray-700 space-y-2 list-disc pl-5">
              <li>Use a flexible tape measure and wear light, close-fitting clothing.</li>
              <li>For the most accurate results, ask someone to assist you with measurements.</li>
              <li>Keep the tape measure snug against your body but not so tight that it compresses your skin.</li>
              <li>Take measurements 2-3 times to ensure consistency and accuracy.</li>
            </ul>
            <div className="mt-6">
              <button
                onClick={openVisualGuide}
                className="px-6 py-3 bg-[var(--brand-accent)] text-white rounded-md shadow-sm hover:bg-opacity-90 transition"
              >
                Open Visual Guide
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3 text-[var(--brand-dark)]">Measurement Checklist</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Height: From the top of your head to the floor, without shoes.</li>
              <li>Chest / Bust: Around the fullest part of your chest/bust.</li>
              <li>Waist: Around your natural waistline, usually above the navel.</li>
              <li>Hip: Around the fullest part of your hips, standing with feet together.</li>
              <li>Shoulder width: From one shoulder tip to the other.</li>
              <li>Sleeve length: From the shoulder tip down to your wrist bone.</li>
              <li>Garment length: From the base of your neck down to your desired hemline.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeasurementsPage;