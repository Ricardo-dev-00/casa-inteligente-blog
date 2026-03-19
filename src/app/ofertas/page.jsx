import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";

export const metadata = {
  title: "Ofertas | Casa Inteligente",
  description: "Confira as melhores ofertas de produtos para cozinha, organização e limpeza.",
};

const products = [
  {
    id: 1,
    name: "Organizador de gaveta modular",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80",
    price: "49,90",
    oldPrice: "79,90",
    link: "#",
  },
  {
    id: 2,
    name: "Kit potes herméticos para cozinha",
    image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=300&q=80",
    price: "69,90",
    oldPrice: "99,90",
    link: "#",
  },
  {
    id: 3,
    name: "Spray multiuso concentrado",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80",
    price: "24,90",
    oldPrice: "39,90",
    link: "#",
  },
  {
    id: 4,
    name: "Cabide antideslizante (kit 20un)",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    price: "34,90",
    oldPrice: "54,90",
    link: "#",
  },
  {
    id: 5,
    name: "Rodo mágico com esponja absorvente",
    image: "https://images.unsplash.com/photo-1632923057158-a2f8d6ed0f2b?w=300&q=80",
    price: "37,90",
    oldPrice: "59,90",
    link: "#",
  },
  {
    id: 6,
    name: "Jogo de facas em aço inox (6 peças)",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=300&q=80",
    price: "89,90",
    oldPrice: "129,90",
    link: "#",
  },
  {
    id: 7,
    name: "Caixas organizadoras com tampa (kit 6)",
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=300&q=80",
    price: "79,90",
    oldPrice: "109,90",
    link: "#",
  },
  {
    id: 8,
    name: "Escorredor de louças retrátil",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&q=80",
    price: "39,90",
    oldPrice: "59,90",
    link: "#",
  },
  {
    id: 9,
    name: "Tábua de corte de bambu com ranhuras",
    image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=300&q=80",
    price: "59,90",
    oldPrice: "84,90",
    link: "#",
  },
  {
    id: 10,
    name: "Panos de microfibra (kit 12 unidades)",
    image: "https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=300&q=80",
    price: "29,90",
    oldPrice: "49,90",
    link: "#",
  },
  {
    id: 11,
    name: "Suporte de parede para panelas",
    image: "https://images.unsplash.com/photo-1584990347449-a02f45ce5f0b?w=300&q=80",
    price: "89,90",
    oldPrice: "129,90",
    link: "#",
  },
  {
    id: 12,
    name: "Aspirador de pó portátil",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&q=80",
    price: "119,90",
    oldPrice: "169,90",
    link: "#",
  },
];

export default function Ofertas() {
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
          <h1 className="text-3xl font-bold text-gray-900">🔥 Ofertas do dia</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Confira os melhores produtos com preços especiais para cozinha, organização e limpeza.
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
