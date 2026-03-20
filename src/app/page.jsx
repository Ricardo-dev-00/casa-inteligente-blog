import Header from "../components/Header";
import Hero from "../components/Hero";
import PostCard from "../components/PostCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getHomePosts } from "../lib/posts";
import { getOfferProducts } from "../lib/products";

function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    return configured.startsWith("http") ? configured : `https://${configured}`;
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Dicas e ofertas para sua casa",
  description:
    "Encontre dicas de cozinha, organização, limpeza e receitas com recomendações de produtos e ofertas atualizadas.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Casa Inteligente | Dicas e ofertas para sua casa",
    description:
      "Dicas de casa e produtos recomendados para cozinha, organização, limpeza e receitas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Inteligente | Dicas e ofertas para sua casa",
    description:
      "Dicas de casa e produtos recomendados para cozinha, organização, limpeza e receitas.",
  },
};

const categories = [
  { label: "Cozinha", emoji: "🍳", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", id: "cozinha", href: "/cozinha" },
  { label: "Organização", emoji: "🧺", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", id: "organizacao", href: "/organizacao" },
  { label: "Limpeza", emoji: "🧼", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", id: "limpeza", href: "/limpeza" },
  { label: "Receitas", emoji: "🍽️", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", id: "receitas", href: "/receitas" },
];

export default async function Home() {
  const posts = await getHomePosts(3);
  const products = await getOfferProducts(4);
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Casa Inteligente",
    url: siteUrl,
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/ofertas`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div id="topo" className="bg-gray-50 min-h-screen scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <Hero />

      {/* POSTS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-bold mb-2 md:mb-6 border-l-4 border-green-500 pl-3 text-gray-500">Posts recentes</h2>
          <a href="/cozinha" className="text-green-600 text-sm font-medium hover:underline mb-6 md:mb-0 pl-4 md:pl-0">
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
            <a href="/ofertas" className="text-green-600 text-sm font-medium hover:underline mb-6 md:mb-0 pl-4 md:pl-0">
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

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
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
