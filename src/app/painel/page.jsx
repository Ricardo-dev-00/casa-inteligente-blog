"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";

const CATEGORIES = ["Cozinha", "Organização", "Limpeza", "Receitas"];

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

function ProductSelector({ allProducts, selectedProductIds, onToggle }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-700">Produtos do post (opcional)</p>
      {allProducts.length === 0 ? (
        <p className="text-xs text-gray-400">Nenhum produto carregado ainda.</p>
      ) : (
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
          {allProducts.map((product) => {
            const checked = selectedProductIds.includes(Number(product.id));
            return (
              <label key={product.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(Number(product.id))}
                />
                <span className="truncate">{product.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditModal({ post, allProducts, adminPassword, onClose, onSaved }) {
  const [title, setTitle] = useState(post.title || "");
  const [slug, setSlug] = useState(post.slug || "");
  const [category, setCategory] = useState(post.category || "Organização");
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [content, setContent] = useState(post.content || "");
  const [coverImageUrl, setCoverImageUrl] = useState(post.cover_image_url || "");
  const [published, setPublished] = useState(Boolean(post.published));
  const [selectedProductIds, setSelectedProductIds] = useState((post.productIds || []).map((id) => Number(id)));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const slugPreview = useMemo(() => slugify(slug || title), [slug, title]);

  function toggleProduct(productId) {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          title,
          slug,
          category,
          excerpt,
          content,
          coverImageUrl,
          published,
          productIds: selectedProductIds,
          adminPassword,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result?.error || "Erro ao salvar.");
        return;
      }
      onSaved();
    } catch {
      setError("Erro de rede.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Editar post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Titulo</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (opcional)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400"
              placeholder="se vazio, gera pelo titulo" />
            <p className="text-xs text-gray-500 mt-1">Slug final: {slugPreview}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white" required>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Resumo</label>
            <textarea rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Conteudo</label>
            <textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL da imagem de capa (opcional)</label>
            <input type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400"
              placeholder="https://..." />
          </div>

          <ProductSelector
            allProducts={allProducts}
            selectedProductIds={selectedProductIds}
            onToggle={toggleProduct}
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Publicado
          </label>
          {error ? <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p> : null}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={isSaving}
              className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-70">
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </button>
            <button type="button" onClick={onClose}
              className="bg-gray-100 text-gray-700 rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-200">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PainelPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Organização");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const [adminPassword, setAdminPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [posts, setPosts] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState(null);

  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productCategory, setProductCategory] = useState("Organização");
  const [productDescription, setProductDescription] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productOldPrice, setProductOldPrice] = useState("");
  const [productLink, setProductLink] = useState("");
  const [productActive, setProductActive] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const [expandedProducts, setExpandedProducts] = useState(false);
  const [expandedPostsCategory, setExpandedPostsCategory] = useState(new Set());

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionSaving, setSessionSaving] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  const slugPreview = useMemo(() => slugify(slug || title), [slug, title]);
  const productSlugPreview = useMemo(() => slugify(productSlug || productName), [productSlug, productName]);

  useEffect(() => {
    checkSession();
  }, []);

  function clearProductForm() {
    setEditingProductId(null);
    setProductName("");
    setProductSlug("");
    setProductCategory("Organização");
    setProductDescription("");
    setProductImageUrl("");
    setProductPrice("");
    setProductOldPrice("");
    setProductLink("");
    setProductActive(true);
  }

  function togglePostProduct(productId) {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function startEditProduct(product) {
    setEditingProductId(Number(product.id));
    setProductName(product.name || "");
    setProductSlug(product.slug || "");
    setProductCategory(product.category || "Organização");
    setProductDescription(product.description || "");
    setProductImageUrl(product.image_url || "");
    setProductPrice(product.price || "");
    setProductOldPrice(product.old_price || "");
    setProductLink(product.link || "");
    setProductActive(product.active !== false);
  }

  async function checkSession() {
    setSessionLoading(true);
    try {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        setStatus(`Erro: ${result?.error || "nao foi possivel verificar a sessao"}`);
        setSessionActive(false);
        return;
      }
      setSessionActive(Boolean(result?.authenticated));
      if (result?.authenticated) {
        await Promise.all([loadPosts(""), loadProducts("")]);
      }
    } catch {
      setSessionActive(false);
    } finally {
      setSessionLoading(false);
    }
  }

  async function handleSaveSession() {
    if (!adminPassword) {
      setStatus("Digite a senha para salvar a sessao segura.");
      return;
    }

    setSessionSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword, rememberDevice }),
      });
      const result = await response.json();
      if (!response.ok) {
        setStatus(`Erro: ${result?.error || "nao foi possivel salvar a sessao"}`);
        return;
      }

      setSessionActive(true);
      setAdminPassword("");
      setStatus(
        rememberDevice
          ? "Sessao segura ativa e lembrada neste dispositivo (30 dias)."
          : "Sessao segura ativa neste navegador."
      );
      await Promise.all([loadPosts(""), loadProducts("")]);
    } catch {
      setStatus("Erro de rede ao salvar a sessao.");
    } finally {
      setSessionSaving(false);
    }
  }

  async function handleLogoutSession() {
    setStatus("");
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      setSessionActive(false);
      setStatus("Sessao encerrada.");
    } catch {
      setStatus("Erro de rede ao encerrar sessao.");
    }
  }

  async function loadPosts(pwd) {
    const password = pwd ?? adminPassword;
    setLoadingPosts(true);
    setPostsError("");
    try {
      const query = password ? `?password=${encodeURIComponent(password)}` : "";
      const res = await fetch(`/api/admin/posts${query}`);
      const result = await res.json();
      if (!res.ok) {
        setPostsError(result?.error || "Erro ao carregar posts.");
        return;
      }
      setPosts(result.posts || []);
    } catch {
      setPostsError("Erro de rede.");
    } finally {
      setLoadingPosts(false);
    }
  }

  async function loadProducts(pwd) {
    const password = pwd ?? adminPassword;
    setLoadingProducts(true);
    setProductsError("");
    try {
      const query = password ? `?password=${encodeURIComponent(password)}` : "";
      const res = await fetch(`/api/admin/products${query}`);
      const result = await res.json();
      if (!res.ok) {
        setProductsError(result?.error || "Erro ao carregar produtos.");
        return;
      }
      setProducts(result.products || []);
    } catch {
      setProductsError("Erro de rede.");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!sessionActive && !adminPassword) {
      setStatus("Digite a senha do painel ou ative a sessao segura.");
      return;
    }
    setIsSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          excerpt,
          content,
          coverImageUrl,
          published,
          productIds: selectedProductIds,
          adminPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setStatus(`Erro: ${result?.error || "nao foi possivel salvar"}`);
        return;
      }
      setStatus(`Post criado: /posts/${result.post.slug}`);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCoverImageUrl("");
      setPublished(true);
      setSelectedProductIds([]);
      await loadPosts(adminPassword);
    } catch {
      setStatus("Erro de rede ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveProduct(event) {
    event.preventDefault();
    if (!sessionActive && !adminPassword) {
      setProductStatus("Digite a senha do painel ou ative a sessao segura.");
      return;
    }

    setIsSavingProduct(true);
    setProductStatus("");

    try {
      const method = editingProductId ? "PATCH" : "POST";
      const response = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProductId,
          name: productName,
          slug: productSlug,
          category: productCategory,
          description: productDescription,
          imageUrl: productImageUrl,
          price: productPrice,
          oldPrice: productOldPrice,
          link: productLink,
          active: productActive,
          adminPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setProductStatus(`Erro: ${result?.error || "nao foi possivel salvar o produto"}`);
        return;
      }

      setProductStatus(editingProductId ? "Produto atualizado com sucesso." : "Produto criado com sucesso.");
      clearProductForm();
      await Promise.all([loadProducts(adminPassword), loadPosts(adminPassword)]);
    } catch {
      setProductStatus("Erro de rede ao salvar produto.");
    } finally {
      setIsSavingProduct(false);
    }
  }

  async function handleDelete(post) {
    setDeletingId(post.id);
    setConfirmDeleteId(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, slug: post.slug, adminPassword }),
      });
      const result = await res.json();
      if (!res.ok) {
        setPostsError(result?.error || "Erro ao excluir.");
        return;
      }
      await loadPosts(adminPassword);
    } catch {
      setPostsError("Erro de rede ao excluir.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteProduct(product) {
    setDeletingProductId(product.id);
    setConfirmDeleteProductId(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, adminPassword }),
      });
      const result = await res.json();
      if (!res.ok) {
        setProductsError(result?.error || "Erro ao excluir produto.");
        return;
      }
      await Promise.all([loadProducts(adminPassword), loadPosts(adminPassword)]);
    } catch {
      setProductsError("Erro de rede ao excluir produto.");
    } finally {
      setDeletingProductId(null);
    }
  }

  const postsByCategory = useMemo(() => {
    if (!posts) return {};
    return posts.reduce((acc, post) => {
      const cat = post.category || "Sem categoria";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(post);
      return acc;
    }, {});
  }, [posts]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        <section>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Painel CMS</h1>
          <p className="text-gray-600 mb-8 text-center">Gerencie posts e produtos</p>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-semibold text-gray-700 mb-1">Senha do painel</label>
              <input id="adminPassword" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400"
                placeholder={sessionActive ? "Sessao segura ativa" : "Digite a senha do CMS"}
                required={!sessionActive} />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveSession}
                  disabled={sessionSaving || sessionLoading}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 disabled:opacity-70"
                >
                  {sessionSaving ? "Salvando..." : "Salvar sessao segura"}
                </button>
                <label className="text-xs text-gray-600 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                  />
                  Lembrar neste dispositivo
                </label>
                {sessionActive ? (
                  <>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Sessao ativa</span>
                    <button
                      type="button"
                      onClick={handleLogoutSession}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600"
                    >
                      Encerrar sessao
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">Cookie HttpOnly seguro (12h, ou 30 dias com lembrar dispositivo).</span>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Titulo</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400" required />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1">Slug (opcional)</label>
              <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400"
                placeholder="se vazio, gera pelo titulo" />
              <p className="text-xs text-gray-500 mt-1">Slug final: {slugPreview}</p>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white" required>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-1">Resumo</label>
              <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400" required />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">Conteudo</label>
              <p className="text-xs text-gray-400 mb-1">Use <code className="bg-gray-100 px-1 rounded">**texto**</code> para <strong>negrito</strong>. Separe paragrafos com uma linha em branco.</p>
              <textarea id="content" rows={8} value={content} onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400" required />
            </div>
            <div>
              <label htmlFor="coverImageUrl" className="block text-sm font-semibold text-gray-700 mb-1">URL da imagem de capa (opcional)</label>
              <input id="coverImageUrl" type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder:text-gray-400"
                placeholder="https://..." />
            </div>

            <ProductSelector
              allProducts={products}
              selectedProductIds={selectedProductIds}
              onToggle={togglePostProduct}
            />

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Publicar imediatamente
            </label>
            <button type="submit" disabled={isSaving}
              className="w-full md:w-auto bg-green-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-green-700 disabled:opacity-70">
              {isSaving ? "Salvando..." : "Salvar post"}
            </button>
            {status ? <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">{status}</p> : null}
          </form>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Posts existentes</h2>
            <button onClick={() => loadPosts()} disabled={loadingPosts}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-700 disabled:opacity-70">
              {loadingPosts ? "Carregando..." : "Carregar posts"}
            </button>
          </div>

          {postsError ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{postsError}</p>
          ) : null}

          {posts === null ? (
            <p className="text-gray-400 text-sm">Clique em "Carregar posts" para listar (senha manual ou sessao segura).</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhum post encontrado.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(postsByCategory).map(([cat, catPosts]) => {
                const isExpanded = expandedPostsCategory.has(cat);
                const displayedPosts = isExpanded ? catPosts : catPosts.slice(-3);
                return (
                <div key={cat}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{cat}</h3>
                  <ul className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
                    {displayedPosts.map((post) => (
                      <li key={post.id} className="flex items-center justify-between px-4 py-3 gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium truncate">{post.title}</p>
                          <p className="text-xs text-gray-400 truncate">/posts/{post.slug} | Produtos: {(post.productIds || []).length}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {post.published ? "Publicado" : "Rascunho"}
                          </span>
                          <button onClick={() => setEditingPost(post)}
                            className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100">
                            Editar
                          </button>
                          {confirmDeleteId === post.id ? (
                            <>
                              <button onClick={() => handleDelete(post)} disabled={deletingId === post.id}
                                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-70">
                                {deletingId === post.id ? "..." : "Confirmar"}
                              </button>
                              <button onClick={() => setConfirmDeleteId(null)}
                                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200">
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setConfirmDeleteId(post.id)}
                              className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100">
                              Excluir
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {catPosts.length > 3 && (
                    <button
                      onClick={() => {
                        const newSet = new Set(expandedPostsCategory);
                        if (isExpanded) {
                          newSet.delete(cat);
                        } else {
                          newSet.add(cat);
                        }
                        setExpandedPostsCategory(newSet);
                      }}
                      className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 mt-2"
                    >
                      {isExpanded ? "↑ Mostrar menos" : `↓ Ver todos (${catPosts.length} posts)`}
                    </button>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
            <button onClick={() => loadProducts()} disabled={loadingProducts}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-700 disabled:opacity-70">
              {loadingProducts ? "Carregando..." : "Atualizar produtos"}
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do produto</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (opcional)</label>
              <input value={productSlug} onChange={(e) => setProductSlug(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" />
              <p className="text-xs text-gray-500 mt-1">Slug final: {productSlugPreview}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
              <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preco</label>
              <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="49,90" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preco antigo (opcional)</label>
              <input value={productOldPrice} onChange={(e) => setProductOldPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="79,90" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descricao (opcional)</label>
              <textarea rows={2} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL da imagem</label>
              <input type="url" value={productImageUrl} onChange={(e) => setProductImageUrl(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link de oferta</label>
              <input type="url" value={productLink} onChange={(e) => setProductLink(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="https://..." />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
              <input type="checkbox" checked={productActive} onChange={(e) => setProductActive(e.target.checked)} />
              Produto ativo na aba de ofertas
            </label>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={isSavingProduct} className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-70">
                {isSavingProduct ? "Salvando..." : editingProductId ? "Salvar produto" : "Cadastrar produto"}
              </button>
              {editingProductId ? (
                <button type="button" onClick={clearProductForm} className="bg-gray-100 text-gray-700 rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-200">
                  Cancelar edição
                </button>
              ) : null}
            </div>
          </form>

          {productStatus ? <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">{productStatus}</p> : null}
          {productsError ? <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{productsError}</p> : null}

          <ul className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
            {products.slice(expandedProducts ? 0 : -3).map((product) => (
              <li key={product.id} className="flex items-center justify-between px-4 py-3 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 truncate">R$ {product.price} {product.old_price ? `| De: R$ ${product.old_price}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                  <button onClick={() => startEditProduct(product)} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100">
                    Editar
                  </button>
                  {confirmDeleteProductId === product.id ? (
                    <>
                      <button onClick={() => handleDeleteProduct(product)} disabled={deletingProductId === product.id}
                        className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-70">
                        {deletingProductId === product.id ? "..." : "Confirmar"}
                      </button>
                      <button onClick={() => setConfirmDeleteProductId(null)}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDeleteProductId(product.id)} className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100">
                      Excluir
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {products.length > 3 && (
            <button
              onClick={() => setExpandedProducts(!expandedProducts)}
              className="w-full mt-4 text-center text-sm font-semibold text-blue-600 hover:text-blue-700 py-2"
            >
              {expandedProducts ? "↑ Mostrar menos" : `↓ Ver todos (${products.length} produtos)`}
            </button>
          )}
        </section>

      </main>

      {editingPost ? (
        <EditModal
          post={editingPost}
          allProducts={products.map((p) => ({ id: p.id, name: p.name }))}
          adminPassword={adminPassword}
          onClose={() => setEditingPost(null)}
          onSaved={async () => {
            setEditingPost(null);
            await loadPosts(adminPassword);
          }}
        />
      ) : null}
    </div>
  );
}

