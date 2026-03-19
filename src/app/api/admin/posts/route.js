import { revalidatePath } from "next/cache";
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
  if (slug) revalidatePath(`/posts/${slug}`);
}

function checkAuth(password) {
  const adminPassword = process.env.CMS_ADMIN_PASSWORD;
  if (!adminPassword) return { error: "CMS_ADMIN_PASSWORD nao configurada no servidor.", status: 500 };
  if (password !== adminPassword) return { error: "Senha do painel invalida.", status: 401 };
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authError = checkAuth(searchParams.get("password"));
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, category, published, excerpt, content, cover_image_url, created_at")
      .order("category")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json({ posts: data });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const authError = checkAuth(body?.adminPassword);
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

    revalidateAll(slug);
    return Response.json({ success: true, post: data });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const authError = checkAuth(body?.adminPassword);
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const id = body?.id;
    if (!id) return Response.json({ error: "ID do post nao informado." }, { status: 400 });

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

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

    const adminPassword = process.env.CMS_ADMIN_PASSWORD;
    if (!adminPassword) {
      return Response.json(
        { error: "CMS_ADMIN_PASSWORD nao configurada no servidor." },
        { status: 500 }
      );
    }

    if (body?.adminPassword !== adminPassword) {
      return Response.json({ error: "Senha do painel invalida." }, { status: 401 });
    }

    const title = (body?.title || "").trim();
    const category = (body?.category || "").trim();
    const excerpt = (body?.excerpt || "").trim();
    const content = (body?.content || "").trim();
    const coverImageUrl = (body?.coverImageUrl || "").trim();
    const published = Boolean(body?.published);
    const requestedSlug = (body?.slug || "").trim();

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

    revalidateAll(slug);
    return Response.json({ success: true, post: data }, { status: 201 });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}