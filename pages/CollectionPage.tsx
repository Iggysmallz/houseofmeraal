import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectionCard from '../components/CollectionCard';
import { CollectionItem } from '../types';
import { sampleCollection } from '../constants';

interface CollectionPageProps {
  onOpenLightbox: (item: CollectionItem) => void;
  onCustomizeGarment: (garmentId: string) => void;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ onOpenLightbox, onCustomizeGarment }) => {
  const [filter, setFilter] = useState<'all' | 'men' | 'women' | 'accessories'>('all');
  const navigate = useNavigate();

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'all' | 'men' | 'women' | 'accessories');
  }, []);

  const handleCustomize = useCallback((garmentId: string) => {
    onCustomizeGarment(garmentId);
    navigate('/custom-order');
  }, [onCustomizeGarment, navigate]);

  const filteredCollection = sampleCollection.filter(item =>
    filter === 'all' ? true : item.type === filter
  );

  return (
    <section id="page-collection" className="page-content py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-[var(--brand-dark)]">Our Collection</h1>

          <div className="flex gap-3 items-center">
            <label htmlFor="filter-category" className="text-sm text-gray-600">Filter:</label>
            <select
              id="filter-category"
              className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div id="collection-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollection.length > 0 ? (
            filteredCollection.map((item) => (
              <CollectionCard
                key={item.id}
                item={item}
                onPreview={onOpenLightbox}
                onCustomize={handleCustomize}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No items found for this filter.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionPage;