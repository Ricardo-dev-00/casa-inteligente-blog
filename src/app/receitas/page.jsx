import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostCard from "../../components/PostCard";
import { getPostsByCategory } from "../../lib/posts";

export const metadata = {
  title: "Receitas | Casa Inteligente",
  description: "Receitas praticas, ideias para o dia a dia e inspiracoes para aproveitar melhor sua cozinha.",
};

export default async function Receitas() {
  const posts = await getPostsByCategory("Receitas");

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-3 border-l-4 border-green-500 pl-3 text-gray-900">
          🍽️ Receitas
        </h1>

        <p className="text-gray-500 mb-10 pl-4">
          Receitas praticas, ideias para o dia a dia e inspiracoes para aproveitar melhor sua cozinha.
        </p>

        {posts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 shadow-sm">
            Ainda nao ha posts publicados nesta categoria.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} href={`/posts/${post.slug}`} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
