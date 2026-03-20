import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Política de Privacidade | Casa Inteligente",
  description: "Política de Privacidade do Blog Casa Inteligente",
};

export default function Privacidade() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Política de Privacidade</h1>
        
        <div className="bg-white rounded-lg p-8 shadow-sm space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introdução</h2>
            <p>
              A Casa Inteligente ("nós", "nosso" ou "nos") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e salvaguardamos suas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Informações que Coletamos</h2>
            <p>
              Podemos coletar informações sobre você de várias maneiras, incluindo:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Informações voluntariamente fornecidas quando você interage com o site</li>
              <li>Dados sobre seu navegador, dispositivo e padrões de navegação</li>
              <li>Informações de cookies e tecnologias similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Como Usamos Suas Informações</h2>
            <p>
              Usamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Melhorar e personalizar sua experiência no site</li>
              <li>Enviar informações sobre produtos e serviços</li>
              <li>Executar análises estatísticas e pesquisa de mercado</li>
              <li>Detectar, prevenir e resolver problemas técnicos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Segurança das Informações</h2>
            <p>
              Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através do email disponível no site.
            </p>
          </section>

          <section className="text-sm text-gray-500 border-t pt-6">
            <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
