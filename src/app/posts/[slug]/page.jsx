import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PostCard from "../../../components/PostCard";
import {
  getAllPostSlugs,
  getPostBySlugData,
  getRelatedPostsData,
} from "../../../lib/posts";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlugData(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Casa Inteligente`,
    description: post.excerpt,
  };
}

function renderBold(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlugData(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPostsData(post.relatedSlugs || [], post.category);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* BREADCRUMB */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1 flex-wrap">
          <a href="/" className="hover:text-green-500 transition-colors">Home</a>
          <span>/</span>
          <a href={post.categoryHref} className="hover:text-green-500 transition-colors">{post.category}</a>
          <span>/</span>
          <span className="text-gray-600 line-clamp-1">{post.title}</span>
        </nav>

        {/* CABEÇALHO DO POST */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
            {post.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3 leading-snug">
            {post.title}
          </h1>
          <p className="text-gray-400 text-sm">{post.date}</p>
        </div>

        {/* IMAGEM CAPA */}
        <div className="rounded-2xl overflow-hidden mb-8 shadow">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* INTRO */}
        <div className="space-y-4 mb-10">
          {post.intro.map((paragraph, i) => (
            <p key={i} className="text-gray-600 leading-relaxed text-base">
              {renderBold(paragraph)}
            </p>
          ))}
        </div>

        {/* PRODUTOS */}
        {post.products && post.products.length > 0 && (
          <section className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-green-500 pl-3">
              Produtos recomendados
            </h2>

            {post.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row gap-4 sm:items-center hover:shadow-xl hover:-translate-y-1 transition relative"
              >
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  🔥 Oferta
                </span>

                {/* IMAGEM */}
                <div className="shrink-0 mt-6 sm:mt-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-xl"
                  />
                </div>

                {/* INFO */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <span className="line-through text-gray-400 text-sm mr-2">
                        R$ {product.oldPrice}
                      </span>
                      <span className="text-green-600 font-bold text-lg">
                        R$ {product.price}
                      </span>
                    </div>

                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-105 transition font-semibold whitespace-nowrap"
                    >
                      🛒 Ver oferta
                    </a>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-10 text-center">
              <p className="text-gray-600 mb-4">
                Quer ver mais produtos úteis para sua casa?
              </p>

              <a
                href="/ofertas"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 hover:scale-105 transition font-semibold shadow"
              >
                🔥 Ver mais ofertas
              </a>
            </div>
          </section>
        )}

        {/* POSTS RELACIONADOS */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-green-500 pl-3 mb-6">
              Posts relacionados
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.slice(0, 4).map((related) => (
                <PostCard
                  key={related.slug}
                  title={related.title}
                  excerpt={related.excerpt}
                  image={related.image}
                  category={related.category}
                  date={related.date}
                  href={`/posts/${related.slug}`}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
