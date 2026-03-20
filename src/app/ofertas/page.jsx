import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getOfferProducts } from "../../lib/products";

export const metadata = {
  title: "Ofertas | Casa Inteligente",
  description: "Confira as melhores ofertas de produtos para cozinha, organizacao e limpeza.",
};

export default async function Ofertas() {
  const products = await getOfferProducts();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-2">
          <span className="text-xs sm:text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1.5 w-fit mb-3">
            <span className="relative flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-online-ping"></span>
              <span className="absolute w-2 h-2 bg-green-500 rounded-full"></span>
            </span>
            Atualizado hoje
          </span>
          <h1 className="text-3xl font-bold text-gray-900">Ofertas do dia</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Confira os melhores produtos com precos especiais para cozinha, organizacao e limpeza.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
