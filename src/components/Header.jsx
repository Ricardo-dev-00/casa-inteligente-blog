"use client";

import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Cozinha", href: "/cozinha" },
  { label: "Organização", href: "/organizacao" },
  { label: "Limpeza", href: "/limpeza" },
  { label: "Ofertas do Dia", href: "/ofertas", highlight: true },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header ref={headerRef} className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="font-bold text-xl text-green-600">
          🏠 Casa Inteligente
        </a>

        <nav className="space-x-6 hidden md:block">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.highlight
                  ? "text-green-600 font-semibold relative animate-pulse"
                  : "text-gray-600 hover:text-green-500 transition-colors"
              }
            >
              {link.highlight ? "🔥 Ofertas" : link.label}
            </a>
          ))}
        </nav>

        {/* Menu mobile */}
        <button
          className="md:hidden text-gray-600 transition-transform duration-200"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={
                  link.highlight
                    ? "text-green-600 font-semibold py-2"
                    : "text-gray-700 hover:text-green-600 transition-colors py-2"
                }
              >
                {link.highlight ? "🔥 Ofertas do Dia" : link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
