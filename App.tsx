import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import BlogPostCard from './components/BlogPostCard'; // Added import

import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import CustomOrderPage from './pages/CustomOrderPage';
import MeasurementsPage from './pages/MeasurementsPage';
import BlogPage from './pages/BlogPage'; // Added import
import BlogPostDetailPage from './pages/BlogPostDetailPage'; // Added import
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import { CollectionItem } from './types';
import { sampleCollection, sampleBlogPosts } from './constants'; // Added sampleBlogPosts import

// Define a separate component for the main content to use useNavigate/useLocation hooks
const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [selectedGarmentId, setSelectedGarmentId] = useState<string | undefined>(undefined);

  // Determine active page from URL hash
  useEffect(() => {
    const path = location.pathname.slice(1); // Remove leading slash
    setCurrentPage(path || 'home');
    localStorage.setItem('hofm_last_page', path || 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  }, [location.pathname]);

  const handleNavigate = useCallback((page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
  }, [navigate]);

  const openModal = useCallback((title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent(null);
  }, []);

  const handleOpenLightbox = useCallback((item: CollectionItem) => {
    openModal(
      item.title,
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[var(--bg)] rounded p-4 flex items-center justify-center">
          <img src={item.imgUrl} alt={item.title} className="max-h-64 object-contain" />
        </div>
        <div>
          <p className="text-gray-700 mb-4">{item.desc}</p>
          <p className="text-sm text-gray-500 mb-4">
            Choose fabric, color and request custom embroidery or detailing in the order form.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedGarmentId(item.id);
                closeModal();
                navigate('/custom-order');
              }}
              className="px-4 py-2 bg-[var(--brand-dark)] text-white rounded hover:opacity-95 transition"
            >
              Customize & Order
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded text-[var(--brand-dark)] hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }, [openModal, closeModal, navigate]);

  const handleCustomizeGarment = useCallback((garmentId: string) => {
    setSelectedGarmentId(garmentId);
    navigate('/custom-order');
  }, [navigate]);

  const handleOpenLookbook = useCallback((item: CollectionItem) => {
    handleOpenLightbox(item);
  }, [handleOpenLightbox]);

  return (
    <>
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main id="app" className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={
            <HomePage
              onCustomizeGarment={handleCustomizeGarment}
              onOpenLookbook={handleOpenLookbook}
              sampleCollection={sampleCollection}
            />
          } />
          <Route path="/collection" element={
            <CollectionPage
              onOpenLightbox={handleOpenLightbox}
              onCustomizeGarment={handleCustomizeGarment}
            />
          } />
          <Route path="/custom-order" element={
            <CustomOrderPage
              initialGarmentId={selectedGarmentId}
              onOpenModal={openModal}
              onCloseModal={closeModal}
            />
          } />
          <Route path="/measurements" element={
            <MeasurementsPage
              onOpenModal={openModal}
              onCloseModal={closeModal}
            />
          } />
          <Route path="/blog" element={<BlogPage blogPosts={sampleBlogPosts} />} /> {/* Blog listing page */}
          <Route path="/blog/:slug" element={<BlogPostDetailPage blogPosts={sampleBlogPosts} />} /> {/* Individual blog post page */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<h1 className="text-center text-4xl mt-20">404 - Page Not Found</h1>} />
        </Routes>
      </main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <MainContent />
    </HashRouter>
  );
};

export default App;