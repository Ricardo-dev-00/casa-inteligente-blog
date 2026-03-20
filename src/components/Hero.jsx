export default function Hero() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">
            Facilite sua rotina em casa
          </span>

          <h2 className="text-4xl font-bold mb-4 text-gray-800 leading-tight">
            Produtos que realmente fazem a diferença no seu dia a dia
          </h2>

          <p className="text-gray-500 mb-8 text-lg">
            Descubra itens úteis, práticos e com ótimo custo-benefício para deixar sua casa mais organizada e funcional.
          </p>

          <div className="flex gap-3">
            <a href="/ofertas" className="bg-green-500 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-green-600 hover:scale-105 transition duration-200 animate-pulse cursor-pointer text-sm sm:text-base whitespace-nowrap inline-block">
              🔥 Ver ofertas
            </a>
            <a href="#categorias" className="border border-gray-400 text-gray-700 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg bg-white shadow-sm hover:bg-gray-100 hover:border-gray-500 hover:scale-105 transition duration-200 font-semibold text-sm sm:text-base whitespace-nowrap inline-block">
              Explorar categorias
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-green-100 rounded-2xl rotate-3"></div>
          <img
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80"
            alt="Produtos para casa"
            className="relative rounded-2xl w-full object-cover shadow-lg"
          />
        </div>

      </div>
    </section>
  );
}
