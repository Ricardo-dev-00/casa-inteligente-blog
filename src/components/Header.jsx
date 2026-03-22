const navLinks = [
  { label: "Home", href: "/" },
  { label: "Cozinha", href: "/cozinha" },
  { label: "Organização", href: "/organizacao" },
  { label: "Limpeza", href: "/limpeza" },
  { label: "Receitas", href: "/receitas" },
  { label: "Ofertas do Dia", href: "/ofertas", highlight: true },
];

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
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
                  ? "text-green-600 font-semibold relative"
                  : "text-gray-600 hover:text-green-500 transition-colors"
              }
            >
              {link.highlight ? "🔥 Ofertas" : link.label}
            </a>
          ))}
        </nav>

        <details className="md:hidden group relative">
          <summary className="list-none cursor-pointer text-gray-600 transition-transform duration-200" aria-label="Abrir menu">
            <span className="sr-only">Abrir menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-open:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hidden group-open:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </summary>

          <nav className="absolute right-0 mt-3 min-w-56 border border-gray-100 bg-white rounded-lg shadow-lg p-2 z-50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={
                    link.highlight
                      ? "text-green-600 font-semibold py-2 px-2 rounded"
                      : "text-gray-700 hover:text-green-600 transition-colors py-2 px-2 rounded"
                  }
                >
                  {link.highlight ? "🔥 Ofertas do Dia" : link.label}
                </a>
              ))}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
