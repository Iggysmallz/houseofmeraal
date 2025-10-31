import React, { useCallback } from 'react';
import Modal from './Modal'; // Assuming Modal is in the same directory or adjust path

interface MeasurementInputProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder: string;
  unit: string;
  required?: boolean;
  description: string;
  onOpenModal: (title: string, content: React.ReactNode) => void;
  onCloseModal: () => void;
}

const MeasurementInput: React.FC<MeasurementInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  unit,
  required = false,
  description,
  onOpenModal,
  onCloseModal,
}) => {
  const handleInfoClick = useCallback(() => {
    onOpenModal(
      `How to Measure Your ${label}`,
      <div className="text-[var(--brand-dark)]">
        <p className="text-gray-700 text-sm mb-4">{description}</p>
        <p className="text-sm text-gray-500">For a comprehensive guide, visit our <a href="#/measurements" className="underline text-[var(--brand-accent)] hover:text-[var(--brand-rich)]" onClick={onCloseModal}>How to Measure page</a>.</p>
        <div className="mt-6 text-center">
          <button
            onClick={onCloseModal}
            className="px-4 py-2 border border-gray-300 rounded text-[var(--brand-dark)] hover:bg-gray-50 transition"
          >
            Got It!
          </button>
        </div>
      </div>
    );
  }, [label, description, onOpenModal, onCloseModal]);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-2 text-[var(--brand-dark)] flex items-center">
        {label} ({unit})
        <button
          type="button"
          onClick={handleInfoClick}
          className="ml-2 text-gray-500 hover:text-[var(--brand-rich)] transition"
          aria-label={`Learn how to measure ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </label>
      <input
        id={id}
        type="number"
        step="0.1"
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        required={required}
      />
    </div>
  );
};

export default MeasurementInput;