import React from 'react';
import { CollectionItem } from '../types';

interface CollectionCardProps {
  item: CollectionItem;
  // Updated onPreview to accept CollectionItem directly
  onPreview: (item: CollectionItem) => void;
  onCustomize: (garmentId: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ item, onPreview, onCustomize }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow p-0">
      <div className="h-64 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--bg)] flex items-center justify-center">
        <img
          src={item.imgUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg text-[var(--brand-dark)] mb-2">{item.title}</h3>
        <p className="text-gray-600 mb-4">{item.desc}</p>
        <div className="flex gap-3">
          <button
            // Pass the entire item object to onPreview
            onClick={() => onPreview(item)}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-[var(--brand-dark)] hover:bg-gray-50 transition"
          >
            Preview
          </button>
          <button
            onClick={() => onCustomize(item.id)}
            className="px-4 py-2 bg-[var(--brand-dark)] text-white rounded text-sm hover:opacity-95 transition"
          >
            Customize & Order
          </button>
        </div>
      </div>
    </article>
  );
};

export default CollectionCard;