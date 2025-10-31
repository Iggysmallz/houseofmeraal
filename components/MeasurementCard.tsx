import React, { useEffect, useRef } from 'react';

interface MeasurementCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColorClass: string;
}

const MeasurementCard: React.FC<MeasurementCardProps> = ({ icon, title, description, accentColorClass }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', '-translate-y-2');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className={`measurement-card bg-[var(--bg)] p-8 rounded-lg opacity-0 -translate-y-2 transition-all duration-500 ease-out`}
    >
      <div className={`w-16 h-16 ${accentColorClass} rounded-full flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--brand-dark)] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </article>
  );
};

export default MeasurementCard;