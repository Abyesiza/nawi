"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, scenenaries } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/current";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function parseFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseImages(text: string): string[] {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ───────────────────────────── Scenarios ───────────────────────── */

export async function upsertScenenary(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || "BESPOKE";
  const description = String(formData.get("description") ?? "").trim();
  const features = parseFeatures(String(formData.get("features") ?? ""));
  const galleryUrls = parseImages(String(formData.get("galleryUrls") ?? ""));
  const heroImageUrl = galleryUrls[0] ?? null;
  const basePriceRaw = formData.get("basePriceCents");
  const basePriceCents = basePriceRaw ? Math.round(Number(basePriceRaw) * 100) : null;
  const isActive = formData.get("isActive") !== "false";

  if (!title || !description) return { error: "Title and description required." };

  if (id) {
    await db
      .update(scenenaries)
      .set({
        title,
        category,
        description,
        features,
        heroImageUrl,
        galleryUrls,
        basePriceCents,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(scenenaries.id, id));
  } else {
    await db.insert(scenenaries).values({
      slug: slugify(title) + "-" + Date.now().toString(36).slice(-4),
      title,
      category,
      description,
      features,
      heroImageUrl,
      galleryUrls,
      basePriceCents,
      isActive,
    });
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  return { ok: true };
}

export async function toggleScenenary(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const next = formData.get("active") === "true";
  await db
    .update(scenenaries)
    .set({ isActive: next, updatedAt: new Date() })
    .where(eq(scenenaries.id, id));
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
}

export async function deleteScenenary(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  await db.delete(scenenaries).where(eq(scenenaries.id, id));
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
}

/* ───────────────────────────── Products ────────────────────────── */

const ALLOWED_PRODUCT_CATEGORIES = [
  "PLACE_SUGGESTION",
  "ADULT_PLAY",
  "BEVERAGE",
  "TREATS",
  "FLOWERS",
  "PLAYLIST",
  "ROOM_SETUP",
  "SENSUAL_TOUCH",
  "LUXURY_SERVICE",
  "ULTRA_LUXURY",
  "BILLIONAIRE_PACKAGE",
  "LIGHTING",
  "LINGERIE",
  "TOYS",
  "ATMOSPHERE",
  "PROPS_COSTUMES",
] as const;

type ProductCategory = (typeof ALLOWED_PRODUCT_CATEGORIES)[number];

const ALLOWED_STOCK_STATUSES = ["IN_STOCK", "LOW", "OUT", "ON_REQUEST"] as const;
type StockStatus = (typeof ALLOWED_STOCK_STATUSES)[number];

function parseTags(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 24);
}

export async function upsertProduct(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const category = (ALLOWED_PRODUCT_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as ProductCategory)
    : null;
  const subcategory = String(formData.get("subcategory") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = formData.get("priceCents");
  const priceCents = priceRaw ? Math.round(Number(priceRaw) * 100) : 0;
  const images = parseImages(String(formData.get("images") ?? ""));
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const featured = formData.get("featured") === "true";
  const leadTimeRaw = formData.get("leadTimeDays");
  const leadTimeDays = leadTimeRaw ? Math.max(0, Math.floor(Number(leadTimeRaw))) : 0;
  const sortOrderRaw = formData.get("sortOrder");
  const sortOrder = sortOrderRaw ? Math.floor(Number(sortOrderRaw)) : 0;
  const stockStatusRaw = String(formData.get("stockStatus") ?? "IN_STOCK").trim();
  const stockStatus: StockStatus = (ALLOWED_STOCK_STATUSES as readonly string[]).includes(stockStatusRaw)
    ? (stockStatusRaw as StockStatus)
    : "IN_STOCK";
  const isActive = formData.get("isActive") !== "false";
  const discreetShip = formData.get("discreetShip") !== "false";

  if (!name || !description || !category) {
    return { error: "Name, description and a valid category are required." };
  }

  if (id) {
    await db
      .update(products)
      .set({
        name,
        category,
        subcategory,
        description,
        priceCents,
        images,
        tags,
        featured,
        leadTimeDays,
        sortOrder,
        stockStatus,
        isActive,
        discreetShip,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
  } else {
    await db.insert(products).values({
      slug: slugify(name) + "-" + Date.now().toString(36).slice(-4),
      name,
      category,
      subcategory,
      description,
      priceCents,
      images,
      tags,
      featured,
      leadTimeDays,
      sortOrder,
      stockStatus,
      isActive,
      discreetShip,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/dashboard/marketplace");
  revalidatePath("/marketplace");
  return { ok: true };
}

export async function toggleProduct(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const next = formData.get("active") === "true";
  await db
    .update(products)
    .set({ isActive: next, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/dashboard/marketplace");
}

export async function deleteProduct(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/dashboard/marketplace");
}
