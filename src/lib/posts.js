import { getSupabaseClient } from "./supabase";
import {
  posts as localPosts,
  getPostBySlug as getLocalPostBySlug,
  getRelatedPosts as getLocalRelatedPosts,
} from "../data/posts";
import { getProductsByIds } from "./products";

function formatDatePtBr(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  const formatted = date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(".", "")
    .toLowerCase();

  return formatted;
}

function getCategoryHref(category) {
  if (!category) return "/";

  const normalized = category.toLowerCase();
  if (normalized.includes("cozinha")) return "/cozinha";
  if (normalized.includes("organiza")) return "/organizacao";
  if (normalized.includes("limpeza")) return "/limpeza";
  if (normalized.includes("receita")) return "/receitas";

  return "/";
}

function mapDbRowToPostCard(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    image: row.cover_image_url || "",
    imageAlt: row.cover_image_alt || "",
    category: row.category || "",
    date: formatDatePtBr(row.created_at),
  };
}

export async function getHomePosts(limit = 3) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return localPosts.slice(0, limit).map((post) => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      category: post.category,
      date: post.date,
    }));
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    return localPosts.slice(0, limit).map((post) => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      category: post.category,
      date: post.date,
    }));
  }

  return data.map(mapDbRowToPostCard);
}

export async function getAllPostSlugs() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return localPosts.map((post) => post.slug);
  }

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true);

  if (error || !data?.length) {
    return localPosts.map((post) => post.slug);
  }

  return data.map((item) => item.slug);
}

export async function getPostBySlugData(slug) {
  const localPost = getLocalPostBySlug(slug);
  const supabase = getSupabaseClient();

  if (!supabase) {
    return localPost;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return localPost;
  }

  const introFromDb = (data.content || "")
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  let dbProducts = [];
  const { data: relationRows } = await supabase
    .from("post_products")
    .select("product_id")
    .eq("post_id", data.id);

  const productIds = (relationRows || []).map((row) => Number(row.product_id)).filter((id) => Number.isFinite(id));
  if (productIds.length > 0) {
    dbProducts = await getProductsByIds(productIds);
  }

  return {
    ...localPost,
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt || localPost?.excerpt || "",
    category: data.category || localPost?.category || "",
    categoryHref: getCategoryHref(data.category || localPost?.category),
    date: formatDatePtBr(data.created_at),
    image: data.cover_image_url || localPost?.image || "",
    imageAlt: data.cover_image_alt || localPost?.imageAlt || "",
    intro: introFromDb.length ? introFromDb : localPost?.intro || [],
    products: dbProducts.length ? dbProducts : localPost?.products || [],
    relatedSlugs: localPost?.relatedSlugs || [],
  };
}

export async function getPostsByCategory(category) {
  const supabase = getSupabaseClient();

  const localFallback = localPosts
    .filter((p) => p.category?.toLowerCase() === category.toLowerCase())
    .map((post) => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      category: post.category,
      date: post.date,
    }));

  if (!supabase) return localFallback;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .ilike("category", category)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return localFallback;

  return data.map(mapDbRowToPostCard);
}

export async function getRelatedPostsData(slugs, fallbackCategory) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getLocalRelatedPosts(slugs || []);
  }

  if (Array.isArray(slugs) && slugs.length > 0) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .in("slug", slugs)
      .eq("published", true)
      .limit(4);

    if (!error && data?.length) {
      return data.map(mapDbRowToPostCard);
    }
  }

  const query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const { data, error } = fallbackCategory
    ? await query.eq("category", fallbackCategory)
    : await query;

  if (error || !data?.length) {
    return getLocalRelatedPosts(slugs || []).slice(0, 4);
  }

  return data.map(mapDbRowToPostCard);
}
