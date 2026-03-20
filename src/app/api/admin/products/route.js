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

function checkAuth(request, password) {
  const result = getCmsAuthResult(request, password);
  if (result.ok) return null;
  return { error: result.error, status: result.status };
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/ofertas");
  revalidatePath("/painel");
}

function normalizeBody(body) {
  const name = (body?.name || "").trim();
  const requestedSlug = (body?.slug || "").trim();
  const category = (body?.category || "").trim();
  const description = (body?.description || "").trim();
  const imageUrl = (body?.imageUrl || "").trim();
  const price = (body?.price || "").trim();
  const oldPrice = (body?.oldPrice || "").trim();
  const link = (body?.link || "").trim();
  const active = body?.active !== false;
  const slug = slugify(requestedSlug || name);

  return { name, slug, category, description, imageUrl, price, oldPrice, link, active };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authError = checkAuth(request, searchParams.get("password"));
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, category, description, image_url, price, old_price, link, active, created_at")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json({ products: data || [] });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const authError = checkAuth(request, body?.adminPassword);
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const { name, slug, category, description, imageUrl, price, oldPrice, link, active } = normalizeBody(body);

    if (!name || !price) {
      return Response.json({ error: "Preencha nome e preco do produto." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category: category || null,
        description: description || null,
        image_url: imageUrl || null,
        price,
        old_price: oldPrice || null,
        link: link || null,
        active,
      })
      .select("id, name, slug, category, description, image_url, price, old_price, link, active")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 400 });

    revalidateAll();
    return Response.json({ success: true, product: data }, { status: 201 });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const authError = checkAuth(request, body?.adminPassword);
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const id = Number(body?.id);
    if (!Number.isFinite(id)) {
      return Response.json({ error: "ID do produto nao informado." }, { status: 400 });
    }

    const { name, slug, category, description, imageUrl, price, oldPrice, link, active } = normalizeBody(body);

    if (!name || !price) {
      return Response.json({ error: "Preencha nome e preco do produto." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        slug,
        category: category || null,
        description: description || null,
        image_url: imageUrl || null,
        price,
        old_price: oldPrice || null,
        link: link || null,
        active,
      })
      .eq("id", id)
      .select("id, name, slug, category, description, image_url, price, old_price, link, active")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 400 });

    revalidateAll();
    return Response.json({ success: true, product: data });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const authError = checkAuth(request, body?.adminPassword);
    if (authError) return Response.json({ error: authError.error }, { status: authError.status });

    const id = Number(body?.id);
    if (!Number.isFinite(id)) {
      return Response.json({ error: "ID do produto nao informado." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY nao configurada." }, { status: 500 });

    await supabase.from("post_products").delete().eq("product_id", id);

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 400 });

    revalidateAll();
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Falha ao processar requisicao." }, { status: 500 });
  }
}
