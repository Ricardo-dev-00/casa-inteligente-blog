export default function PostCard({ title, excerpt, image, category, date }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden">
      <div className="overflow-hidden">
        <img
          src={image || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80"}
          alt={title || "Post do blog"}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5">
        {category && (
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
            {category}
          </span>
        )}

        <h3 className="font-bold text-gray-800 mt-1 mb-2 text-lg leading-snug">
          {title || "10 produtos para organizar sua casa"}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2">
          {excerpt || "Veja itens simples que fazem muita diferença no dia a dia."}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">{date || "19 mar 2026"}</span>
          <span className="text-green-600 text-sm font-medium group-hover:underline">
            Ler mais →
          </span>
        </div>
      </div>
    </div>
  );
}
