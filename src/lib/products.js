import { getSupabaseClient } from "./supabase";
import { products as localProducts } from "../data/products";

function mapDbProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category || "",
    description: row.description || "",
    image: row.image_url || "",
    imageAlt: row.image_alt || "",
    price: row.price || "",
    oldPrice: row.old_price || "",
    link: row.link || "#",
    active: row.active !== false,
  };
}

function normalizeLocalProduct(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category || "",
    description: product.description || "",
    image: product.image || "",
    imageAlt: product.imageAlt || "",
    price: product.price || "",
    oldPrice: product.oldPrice || "",
    link: product.link || "#",
    active: product.active !== false,
  };
}

export async function getOfferProducts(limit) {
  const supabase = getSupabaseClient();
  const localFallback = localProducts.filter((item) => item.active !== false).map(normalizeLocalProduct);

  if (!supabase) {
    return typeof limit === "number" ? localFallback.slice(0, limit) : localFallback;
  }

  const query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const { data, error } = typeof limit === "number" ? await query.limit(limit) : await query;

  if (error || !data?.length) {
    return typeof limit === "number" ? localFallback.slice(0, limit) : localFallback;
  }

  return data.map(mapDbProduct);
}

export async function getProductsByIds(ids = []) {
  const normalizedIds = (ids || []).map((id) => Number(id)).filter((id) => Number.isFinite(id));
  if (!normalizedIds.length) return [];

  const supabase = getSupabaseClient();

  if (!supabase) {
    const byId = new Map(localProducts.map((item) => [Number(item.id), normalizeLocalProduct(item)]));
    return normalizedIds.map((id) => byId.get(id)).filter(Boolean);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", normalizedIds)
    .eq("active", true);

  if (error || !data?.length) {
    const byId = new Map(localProducts.map((item) => [Number(item.id), normalizeLocalProduct(item)]));
    return normalizedIds.map((id) => byId.get(id)).filter(Boolean);
  }

  const byId = new Map(data.map((row) => [Number(row.id), mapDbProduct(row)]));
  return normalizedIds.map((id) => byId.get(id)).filter(Boolean);
}
