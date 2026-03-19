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

    revalidatePath("/");
    revalidatePath("/cozinha");
    revalidatePath("/organizacao");
    revalidatePath("/limpeza");
    revalidatePath(`/posts/${slug}`);

    return Response.json({ success: true, post: data }, { status: 201 });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}