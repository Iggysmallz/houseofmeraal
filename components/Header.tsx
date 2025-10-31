import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/collection' },
    { name: 'Custom Order', path: '/custom-order' },
    { name: 'How to Measure', path: '/measurements' },
    { name: 'Blog', path: '/blog' }, // Added Blog link
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/" onClick={() => onNavigate('home')} className="flex items-start">
            <div className="brand-mark">H<span className="ml-1">M</span></div>
            <div className="ml-3">
              <span className="brand-sub">HOUSE OF</span>
              <div className="brand-text text-2xl logo-script">Miraal</div>
            </div>
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-base">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => onNavigate(item.path.slice(1) || 'home')}
              className={({ isActive }) =>
                `nav-link text-sm text-gray-700 hover:text-[var(--brand-rich)] transition ${
                  currentPage === (item.path.slice(1) || 'home') ? 'nav-active' : ''
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            onClick={() => onNavigate('contact')}
            className={({ isActive }) =>
              `nav-cta bg-[var(--brand-dark)] text-white px-4 py-2 rounded-md text-sm hover:opacity-95 transition ${
                currentPage === 'contact' ? 'nav-active' : ''
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            id="mobile-toggle"
            aria-label="Toggle menu"
            className="p-2 text-[var(--brand-dark)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu items with animation and accessibility */}
      <div
        id="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
        className={`md:hidden border-t transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                onNavigate(item.path.slice(1) || 'home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 nav-link-mobile text-[var(--brand-dark)] hover:text-[var(--brand-rich)] transition"
            >
              {item.name}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            onClick={() => {
              onNavigate('contact');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 nav-link-mobile text-[var(--brand-dark)] hover:text-[var(--brand-rich)] transition"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;