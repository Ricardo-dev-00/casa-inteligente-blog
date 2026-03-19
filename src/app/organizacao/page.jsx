import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostCard from "../../components/PostCard";
import { getPostsByCategory } from "../../lib/posts";

export const metadata = {
  title: "Organização | Casa Inteligente",
  description: "Soluções inteligentes para manter sua casa organizada e otimizar seus espaços com praticidade.",
};

export default async function Organizacao() {
  const posts = await getPostsByCategory("Organização");
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-3 border-l-4 border-green-500 pl-3 text-gray-900">
          🧺 Organização
        </h1>

        <p className="text-gray-500 mb-10 pl-4">
          Soluções inteligentes para manter sua casa organizada e otimizar seus espaços com praticidade.
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
