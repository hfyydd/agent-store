// components/MobileMenu.js
'use client';

import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import NavLink from './NavLink';

export default function MobileMenu({ navItems, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-b-foreground/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} className="block px-3 py-2 rounded-md text-base font-medium" />
            ))}
            <div className="px-3 py-2">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}