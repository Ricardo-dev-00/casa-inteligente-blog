import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostCard from "../../components/PostCard";
import { getPostsByCategory } from "../../lib/posts";

export const metadata = {
  title: "Limpeza | Casa Inteligente",
  description: "Itens essenciais para facilitar a limpeza e manter sua casa sempre limpa e agradavel.",
};

export default async function Limpeza() {
  const posts = await getPostsByCategory("Limpeza");

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-3 border-l-4 border-green-500 pl-3 text-gray-900">
          🧼 Limpeza
        </h1>

        <p className="text-gray-500 mb-10 pl-4">
          Itens essenciais para facilitar a limpeza e manter sua casa sempre limpa e agradavel.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} href={`/posts/${post.slug}`} />
          ))}
        </div>

      </section>

      <Footer />
    </div>
  );
}