export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">

        {/* Marca */}
        <div>
          <h2 className="text-xl font-bold mb-3 opacity-100 text-gray-900">🏠 Casa Inteligente</h2>
          <p className="text-gray-600 text-sm">
            Dicas, produtos e soluções práticas para facilitar seu dia a dia em casa.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <h3 className="font-semibold mb-3 opacity-100 text-gray-900">Navegação</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="/" className="hover:text-green-500 transition-colors">Home</a></li>
            <li><a href="/cozinha" className="hover:text-green-500 transition-colors">Cozinha</a></li>
            <li><a href="/organizacao" className="hover:text-green-500 transition-colors">Organização</a></li>
            <li><a href="/limpeza" className="hover:text-green-500 transition-colors">Limpeza</a></li>
            <li><a href="/ofertas" className="hover:text-green-500 transition-colors">Ofertas do Dia</a></li>
          </ul>
        </div>

        {/* Legal / Info */}
        <div>
          <h3 className="font-semibold mb-3 opacity-100 text-gray-900">Informações</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="/" className="hover:text-green-500 transition-colors">Sobre</a></li>
            <li><a href="/" className="hover:text-green-500 transition-colors">Contato</a></li>
            <li><a href="/privacidade" className="hover:text-green-500 transition-colors">Política de Privacidade</a></li>
            <li><a href="/termos-de-uso" className="hover:text-green-500 transition-colors">Termos de Uso</a></li>
          </ul>
        </div>
      </div>

      {/* Linha final */}
      <div className="border-t text-center py-4 text-gray-500 text-sm">
        © 2026 Casa Inteligente. Todos os direitos reservados.
      </div>
    </footer>
  );
}
