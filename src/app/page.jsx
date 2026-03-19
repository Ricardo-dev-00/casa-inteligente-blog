import Header from "../components/Header";
import Hero from "../components/Hero";
import PostCard from "../components/PostCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getHomePosts } from "../lib/posts";

const products = [
  {
    id: 1,
    name: "Organizador de gaveta modular",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80",
    price: "49,90",
    oldPrice: "79,90",
  },
  {
    id: 2,
    name: "Kit potes herméticos para cozinha",
    image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=300&q=80",
    price: "69,90",
    oldPrice: "99,90",
  },
  {
    id: 3,
    name: "Spray multiuso concentrado",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80",
    price: "24,90",
    oldPrice: "39,90",
  },
  {
    id: 4,
    name: "Cabide antideslizante (kit 20un)",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    price: "34,90",
    oldPrice: "54,90",
  },
];

const categories = [
  { label: "Cozinha", emoji: "🍳", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", id: "cozinha", href: "/cozinha" },
  { label: "Organização", emoji: "🧺", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", id: "organizacao", href: "/organizacao" },
  { label: "Limpeza", emoji: "🧼", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", id: "limpeza", href: "/limpeza" },
];

export default async function Home() {
  const posts = await getHomePosts(3);

  return (
    <div id="topo" className="bg-gray-50 min-h-screen scroll-smooth">
      <Header />
      <Hero />

      {/* POSTS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-bold mb-2 md:mb-6 border-l-4 border-green-500 pl-3 text-gray-500">Posts recentes</h2>
          <a href="#" className="text-green-600 text-sm font-medium hover:underline mb-6 md:mb-0 pl-4 md:pl-0">
            Ver todos →
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} href={`/posts/${post.slug}`} />
          ))}
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section id="ofertas" className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold mb-2 md:mb-6 border-l-4 border-green-500 pl-3 text-gray-500">Ofertas do dia</h2>
            <a href="#" className="text-green-600 text-sm font-medium hover:underline mb-6 md:mb-0 pl-4 md:pl-0">
              Ver mais ofertas →
            </a>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-green-500 pl-3 text-gray-500">Explore por categoria</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map(({ label, emoji, bg, border, text, id, href }) => (
            <a
              key={label}
              id={id}
              href={href}
              className={`${bg} ${border} border rounded-xl p-8 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group`}
            >
              <span className="text-4xl">{emoji}</span>
              <div>
                <p className={`font-bold text-xl ${text}`}>{label}</p>
                <p className="text-gray-400 text-sm mt-0.5">Ver produtos →</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
