import { revalidatePath } from "next/cache";
import { getCmsAuthResult } from "../../../../lib/adminAuth";
import { getSupabaseAdminClient } from "../../../../lib/supabase";

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

function revalidateAll(slug) {
  revalidatePath("/");
  revalidatePath("/cozinha");
  revalidatePath("/organizacao");
  revalidatePath("/limpeza");
  revalidatePath("/receitas");
  if (slug) revalidatePath(`/posts/${slug}`);
}

function checkAuth(request, password) {
  const result = getCmsAuthResult(request, password);
  if (result.ok) return null;
  return { error: result.error, status: result.status };
}

function normalizeProductIds(productIds) {
  return Array.from(
    new Set(
      (Array.isArray(productIds) ? productIds : [])
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id))
    )
  );
}

async function getPostProductMap(supabase, postIds) {
  if (!Array.isArray(postIds) || postIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("post_products")
    .select("post_id, product_id")
    .in("post_id", postIds);

  if (error || !data?.length) return new Map();

  const map = new Map();
  for (const row of data) {
    const key = row.post_id;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row.product_id);
  }
  return map;
}

async function savePostProducts(supabase, postId, productIds) {
  const normalized = normalizeProductIds(productIds);

  const { error: deleteError } = await supabase
    .from("post_products")
    .delete()
    .eq("post_id", postId);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  if (!normalized.length) return { ok: true };

  const payload = normalized.map((productId) => ({ post_id: postId, product_id: productId }));
  const { error: insertError } = await supabase.from("post_products").insert(payload);
  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  return { ok: true };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authError = checkAuth(request, searchParams.get("password"));
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, category, published, excerpt, content, cover_image_url, created_at")
      .order("category")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 400 });

    const postIds = (data || []).map((post) => post.id);
    const productsMap = await getPostProductMap(supabase, postIds);
    const postsWithProducts = (data || []).map((post) => ({
      ...post,
      productIds: productsMap.get(post.id) || [],
    }));

    return Response.json({ posts: postsWithProducts });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const authError = checkAuth(request, body?.adminPassword);
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const id = body?.id;
    if (!id) return Response.json({ error: "ID do post nao informado." }, { status: 400 });

    const title = (body?.title || "").trim();
    const category = (body?.category || "").trim();
    const excerpt = (body?.excerpt || "").trim();
    const content = (body?.content || "").trim();
    const coverImageUrl = (body?.coverImageUrl || "").trim();
    const published = Boolean(body?.published);
    const requestedSlug = (body?.slug || "").trim();
    const productIds = normalizeProductIds(body?.productIds);

    if (!title || !category || !excerpt || !content) {
      return Response.json({ error: "Preencha titulo, categoria, resumo e conteudo." }, { status: 400 });
    }

    const slug = slugify(requestedSlug || title);
    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    const { data, error } = await supabase
      .from("posts")
      .update({ title, slug, excerpt, content, category, cover_image_url: coverImageUrl || null, published })
      .eq("id", id)
      .select("id, slug, title, category, published")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 400 });

    const relationResult = await savePostProducts(supabase, id, productIds);
    if (!relationResult.ok) return Response.json({ error: relationResult.error }, { status: 400 });

    revalidateAll(slug);
    return Response.json({ success: true, post: { ...data, productIds } });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const authError = checkAuth(request, body?.adminPassword);
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const id = body?.id;
    if (!id) return Response.json({ error: "ID do post nao informado." }, { status: 400 });

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    await supabase.from("post_products").delete().eq("post_id", id);

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 400 });

    revalidateAll(body?.slug || "");
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const authError = checkAuth(request, body?.adminPassword);
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const title = (body?.title || "").trim();
    const category = (body?.category || "").trim();
    const excerpt = (body?.excerpt || "").trim();
    const content = (body?.content || "").trim();
    const coverImageUrl = (body?.coverImageUrl || "").trim();
    const published = Boolean(body?.published);
    const requestedSlug = (body?.slug || "").trim();
    const productIds = normalizeProductIds(body?.productIds);

    if (!title || !category || !excerpt || !content) {
      return Response.json(
        { error: "Preencha titulo, categoria, resumo e conteudo." },
        { status: 400 }
      );
    }

    const slug = slugify(requestedSlug || title);
    if (!slug) {
      return Response.json({ error: "Slug invalido." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return Response.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." },
        { status: 500 }
      );
    }

    const payload = {
      title,
      slug,
      excerpt,
      content,
      category,
      cover_image_url: coverImageUrl || null,
      published,
    };

    const { data, error } = await supabase
      .from("posts")
      .insert(payload)
      .select("id, slug, title, category, published")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const relationResult = await savePostProducts(supabase, data.id, productIds);
    if (!relationResult.ok) return Response.json({ error: relationResult.error }, { status: 400 });

    revalidateAll(slug);
    return Response.json({ success: true, post: { ...data, productIds } }, { status: 201 });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}