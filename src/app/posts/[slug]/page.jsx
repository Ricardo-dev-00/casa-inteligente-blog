import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PostCard from "../../../components/PostCard";
import ProductCard from "../../../components/ProductCard";
import {
  getAllPostSlugs,
  getPostBySlugData,
  getRelatedPostsData,
} from "../../../lib/posts";

const CONTENT_BLOCKS_PREFIX = "[[CI_BLOCKS_V1]]";

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

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlugData(slug);
  if (!post) return {};

  const siteUrl = getSiteUrl();
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image, alt: post.imageAlt || post.title }] : [],
      locale: "pt_BR",
      siteName: "Casa Inteligente",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
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

function parseContentBlocks(rawContent) {
  const raw = String(rawContent || "").trim();
  if (!raw || !raw.startsWith(CONTENT_BLOCKS_PREFIX)) return [];

  const json = raw.slice(CONTENT_BLOCKS_PREFIX.length).trim();
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((block) => {
        if (block?.type === "products") {
          return {
            type: "products",
            title: String(block?.title || "Produtos recomendados").trim() || "Produtos recomendados",
          };
        }

        const text = String(block?.text || "").trim();
        if (!text) return null;
        return { type: "text", text };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getRenderBlocks(post) {
  const structuredBlocks = parseContentBlocks(post?.content);
  if (structuredBlocks.length > 0) return structuredBlocks;

  const legacyTextBlocks = (post?.intro || [])
    .map((paragraph) => String(paragraph || "").trim())
    .filter(Boolean)
    .map((text) => ({ type: "text", text }));

  if (post?.products?.length) {
    return [...legacyTextBlocks, { type: "products", title: "Produtos recomendados" }];
  }

  return legacyTextBlocks;
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlugData(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPostsData(post.relatedSlugs || [], post.category);
  const siteUrl = getSiteUrl();
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  const renderBlocks = getRenderBlocks(post);
  const hasProductBlock = renderBlocks.some((block) => block.type === "products") && post.products?.length > 0;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    inLanguage: "pt-BR",
    articleSection: post.category,
    mainEntityOfPage: postUrl,
    url: postUrl,
    image: post.image ? [post.image] : undefined,
    author: {
      "@type": "Organization",
      name: "Casa Inteligente",
    },
    publisher: {
      "@type": "Organization",
      name: "Casa Inteligente",
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
            alt={post.imageAlt || post.title}
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="space-y-8 mb-10">
          {renderBlocks.map((block, index) => {
            if (block.type === "products") {
              if (!post.products || post.products.length === 0) return null;
              return (
                <section key={`products-${index}`} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 border-l-4 border-green-500 pl-3">
                    {block.title || "Produtos recomendados"}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {post.products.map((product) => (
                      <ProductCard
                        key={`${index}-${product.id}`}
                        name={product.name}
                        image={product.image}
                        imageAlt={product.imageAlt}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        link={product.link}
                      />
                    ))}
                  </div>
                </section>
              );
            }

            return (
              <p key={`text-${index}`} className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
                {renderBold(block.text)}
              </p>
            );
          })}
        </div>

        {hasProductBlock && (
          <div className="mt-10 text-center mb-12">
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
