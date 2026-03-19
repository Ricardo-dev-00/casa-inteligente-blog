"use client";

export default function PostCard({ title, excerpt, image, category, date, href }) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden block"
    >
      <div className="overflow-hidden">
        <img
          src={image || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80"}
          alt={title || "Post do blog"}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14' font-family='sans-serif'%3EImagem indispon%C3%ADvel%3C/text%3E%3C/svg%3E";
          }}
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
    </Wrapper>
  );
}
