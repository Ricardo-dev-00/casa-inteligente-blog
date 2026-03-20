import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Sobre | Casa Inteligente",
  description: "Conheça a Casa Inteligente, seu blog de dicas, produtos e soluções para casa",
};

export default function Sobre() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Sobre Casa Inteligente</h1>
        
        <div className="bg-white rounded-lg p-8 shadow-sm space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Bem-vindo ao Casa Inteligente</h2>
            <p className="mb-4">
              Casa Inteligente é um blog dedicado a fornecer dicas práticas, produtos úteis e soluções inovadoras para facilitar seu dia a dia em casa. Nosso objetivo é ajudar você a criar um lar mais organizado, funcional e aconchegante.
            </p>
            <p>
              Acreditamos que uma casa bem organizada e equipada com os produtos certos contribui significativamente para a qualidade de vida e bem-estar de toda a família.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Nossa Missão</h2>
            <p>
              Oferecer conteúdo de qualidade, produtos recomendados e dicas práticas que ajudem você a:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Organizar melhor sua cozinha e áreas da casa</li>
              <li>Manter a limpeza de forma mais eficiente e prática</li>
              <li>Encontrar produtos com excelente custo-benefício</li>
              <li>Implementar soluções inteligentes no dia a dia</li>
              <li>Aproveitar ao máximo o espaço disponível</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Por Que Nos Escolher?</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold mb-2 text-green-600">Conteúdo Prático</h3>
                <p>Dicas e estratégias que você pode implementar imediatamente em casa.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-green-600">Produtos Selecionados</h3>
                <p>Recomendações baseadas em qualidade e relação custo-benefício.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-green-600">Atualização Contínua</h3>
                <p>Novos posts e tendências regularmente para manter você informado.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-green-600">Comunidade Engajada</h3>
                <p>Faça parte de uma comunidade que busca melhorar sua qualidade de vida.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Nossas Categorias</h2>
            <p className="mb-4">
              Organizamos nosso conteúdo em quatro categorias principais para facilitar sua navegação:
            </p>
            <ul className="space-y-3">
              <li>
                <strong>🍳 Cozinha:</strong> Utensílios, organização e dicas para tornar sua cozinha mais funcional e agradável.
              </li>
              <li>
                <strong>🧺 Organização:</strong> Estratégias e produtos para manter sua casa organizada e otimizar espaços.
              </li>
              <li>
                <strong>🧼 Limpeza:</strong> Técnicas eficientes, produtos recomendados e dicas para manter a limpeza em dia.
              </li>
              <li>
                <strong>🍽️ Receitas:</strong> Receitas práticas, ideias para o dia a dia e inspirações para aproveitar melhor sua cozinha.
              </li>
            </ul>
          </section>

          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Entre em Contato</h2>
            <p>
              Tem sugestões, dúvidas ou gostaria de colaborar? Entre em contato conosco através do email disponível no site. Adoramos ouvir suas ideias e feedback!
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
