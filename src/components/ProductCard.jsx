export default function ProductCard({ name, image, imageAlt, price, oldPrice, link }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 relative flex flex-col">

      {/* TAG */}
      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10 animate-pulse">
        🔥 Oferta
      </span>

      {/* IMAGEM */}
      <div className="overflow-hidden rounded-xl mb-4">
        <img
          src={image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80"}
          alt={imageAlt || name || "Produto"}
          className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* NOME */}
      <h3 className="font-semibold text-gray-800 mb-2 leading-snug flex-1">
        {name || "Organizador de gaveta modular"}
      </h3>

      {/* PREÇOS */}
      <div className="mb-4">
        <span className="text-gray-400 line-through mr-2 text-sm">
          R$ {oldPrice || "79,90"}
        </span>
        <span className="text-green-600 font-bold text-lg">
          R$ {price || "49,90"}
        </span>
      </div>

      {/* BOTÃO */}
      <a
        href={link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors font-semibold text-sm text-center block cursor-pointer"
      >
        Ver preco atualizado
      </a>
    </div>
  );
}

