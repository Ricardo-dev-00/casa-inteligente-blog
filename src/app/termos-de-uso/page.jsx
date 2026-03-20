import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Termos de Uso | Casa Inteligente",
  description: "Termos de Uso do Blog Casa Inteligente",
};

export default function TermosDeUso() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Termos de Uso</h1>
        
        <div className="bg-white rounded-lg p-8 shadow-sm space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Aceitos dos Termos</h2>
            <p>
              Ao acessar e usar este site, você aceita e concorda em estar vinculado pelos termos e condições descritos aqui. Se você não concordar em cumprir com os Termos de Uso publicados neste site, por favor, não use este site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Uso Licenciado</h2>
            <p>
              É concedida a você uma licença limitada para acessar e visualizar este site e seu conteúdo, desde que você não:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Reproduza ou copie o conteúdo sem permissão</li>
              <li>Use para fins comerciais não autorizados</li>
              <li>Tente contornar restrições de segurança</li>
              <li>Distribua, transmita ou publique o conteúdo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Conteúdo do Usuário</h2>
            <p>
              Você é responsável por qualquer conteúdo que postar, enviar ou exibir no site. Você concede ao Casa Inteligente uma licença perpétua e irrevogável para usar esse conteúdo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Isenção de Responsabilidade</h2>
            <p>
              Este site e seu conteúdo são fornecidos "no estado em que se encontram" e "conforme disponível". O Casa Inteligente se isenta de todas as garantias, expressas ou implícitas, incluindo garantias de comercialidade ou adequação para um fim específico.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Limitação de Responsabilidade</h2>
            <p>
              Em nenhuma circunstância, o Casa Inteligente será responsável por qualquer dano direto, indireto, incidental, especial ou consequencial resultante do seu uso ou da impossibilidade de usar este site ou seu conteúdo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Links para Terceiros</h2>
            <p>
              Este site pode conter links para sites de terceiros. O Casa Inteligente não controla esses sites e não é responsável pelo seu conteúdo, políticas ou práticas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Terminação</h2>
            <p>
              O Casa Inteligente pode rescindir ou suspender sua licença e acesso a este site a qualquer momento, sem aviso prévio e sem responsabilidade, por qualquer motivo ou sem motivo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Lei Aplicável</h2>
            <p>
              Estes Termos de Uso são regidos e interpretados de acordo com as leis do Brasil.
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
