"use client";

import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PainelPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Organização");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [adminPassword, setAdminPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const slugPreview = useMemo(() => slugify(slug || title), [slug, title]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          category,
          excerpt,
          content,
          coverImageUrl,
          published,
          adminPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus(`Erro: ${result?.error || "nao foi possivel salvar"}`);
        return;
      }

      setStatus(`Post criado com sucesso: /posts/${result.post.slug}`);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCoverImageUrl("");
      setPublished(true);
    } catch {
      setStatus("Erro de rede ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel CMS</h1>
        <p className="text-gray-600 mb-8">Crie e publique posts sem usar SQL manual.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-semibold text-gray-700 mb-1">Senha do painel</label>
            <input
              id="adminPassword"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Digite a senha do CMS"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Titulo</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1">Slug (opcional)</label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="se vazio, gera pelo titulo"
            />
            <p className="text-xs text-gray-500 mt-1">Slug final: {slugPreview}</p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="Cozinha">Cozinha</option>
              <option value="Organização">Organização</option>
              <option value="Limpeza">Limpeza</option>
            </select>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-1">Resumo</label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">Conteudo</label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-semibold text-gray-700 mb-1">URL da imagem de capa (opcional)</label>
            <input
              id="coverImageUrl"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publicar imediatamente
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto bg-green-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-green-700 disabled:opacity-70"
          >
            {isSaving ? "Salvando..." : "Salvar post"}
          </button>

          {status ? (
            <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">{status}</p>
          ) : null}
        </form>
      </main>

      <Footer />
    </div>
  );
}