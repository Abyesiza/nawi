import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import * as schema from "../lib/db/schema";
import { eq } from "drizzle-orm";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing");
const sql = neon(url);
const db = drizzle(sql, { schema });

async function ensureUser(opts: {
  alias: string;
  password: string;
  role: "CLIENT" | "AGENT" | "ADMIN";
}) {
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.alias, opts.alias))
    .limit(1);
  if (existing.length > 0) {
    console.log(`  · user ${opts.alias} already exists`);
    return existing[0];
  }
  const passwordHash = await bcrypt.hash(opts.password, 10);
  const [u] = await db
    .insert(schema.users)
    .values({
      alias: opts.alias,
      passwordHash,
      role: opts.role,
      status: "ACTIVE",
    })
    .returning();
  console.log(`  ✓ created ${opts.role}: ${opts.alias} / ${opts.password}`);
  return u;
}

async function ensureAgent(userId: string, displayName: string) {
  const existing = await db
    .select()
    .from(schema.agents)
    .where(eq(schema.agents.userId, userId))
    .limit(1);
  if (existing.length > 0) return existing[0];
  const [a] = await db
    .insert(schema.agents)
    .values({ userId, displayName, isAvailable: true })
    .returning();
  console.log(`  ✓ agent profile: ${displayName}`);
  return a;
}

async function ensureScenenary(s: {
  slug: string;
  title: string;
  category: string;
  description: string;
  features: string[];
}) {
  const existing = await db
    .select()
    .from(schema.scenenaries)
    .where(eq(schema.scenenaries.slug, s.slug))
    .limit(1);
  if (existing.length > 0) return;
  await db.insert(schema.scenenaries).values({ ...s, isActive: true });
  console.log(`  ✓ scenenary: ${s.title}`);
}

type ProductSeed = {
  slug: string;
  name: string;
  category: (typeof schema.productCategoryEnum.enumValues)[number];
  subcategory?: string;
  description: string;
  priceCents: number;
};

async function ensureProduct(p: ProductSeed) {
  const existing = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.slug, p.slug))
    .limit(1);
  if (existing.length > 0) return;
  await db.insert(schema.products).values({ ...p, isActive: true, images: [] });
}

async function main() {
  console.log("Seeding Nawi DB…\n");

  console.log("Users:");
  const admin = await ensureUser({
    alias: "AdminMoonRose",
    password: "ChangeMe-Admin-2026!",
    role: "ADMIN",
  });
  const agentUserA = await ensureUser({
    alias: "AgentSilverEdge",
    password: "ChangeMe-AgentA-2026!",
    role: "AGENT",
  });
  const agentUserB = await ensureUser({
    alias: "AgentCrimsonMist",
    password: "ChangeMe-AgentB-2026!",
    role: "AGENT",
  });

  console.log("\nAgent profiles:");
  await ensureAgent(agentUserA.id, "Sasha (internal)");
  await ensureAgent(agentUserB.id, "Liam (internal)");

  console.log("\nScenenaries:");
  const SCENES = [
    {
      slug: "forest-sanctuary",
      title: "Forest Sanctuary",
      category: "NATURE",
      description:
        "Transformation of your space into a lush, moonlit forest garden. Real moss textures, warm fairy lighting, and night-blooming jasmine.",
      features: [
        "Acoustic soundscape",
        "Petal pathway",
        "Forest-scented oils",
        "Organic treats",
      ],
    },
    {
      slug: "moonlit-terrace",
      title: "Moonlit Terrace",
      category: "SERENE",
      description:
        "Open-air intimacy. Billowing silks, telescopic starlight, and the quiet crackle of a private fire-pit.",
      features: [
        "Star-gazing kit",
        "Premium silk drapes",
        "Ambient fire-glow",
        "Artisanal cheese board",
      ],
    },
    {
      slug: "royal-chamber",
      title: "Royal Chamber",
      category: "CLASSIC",
      description:
        "Gold-leaf accents, heavy velvet drapes, and a royal feast presentation for a night of timeless decadence.",
      features: [
        "Gold-leaf accents",
        "Silk/velvet bedding",
        "Curated royal feast",
        "Rare vintage wine",
      ],
    },
    {
      slug: "celestial-heights",
      title: "Celestial Heights",
      category: "FANTASY",
      description:
        "A star-gazer's dream. Hyper-realistic nebula projection across the ceiling, floating candles, and deep velvet textures.",
      features: [
        "Nebula projection",
        "Floating candles",
        "Velvet textures",
        "Champagne service",
      ],
    },
    {
      slug: "billionaire-suite",
      title: "Billionaire Suite",
      category: "ULTRA",
      description:
        "Full billionaire-style setup: live violin, rose-petal pathways, candle-light dinner, bubble bath, lingerie gift box, cake. The works.",
      features: [
        "Live violin",
        "Rose-petal pathway",
        "Bubble bath setup",
        "Lingerie gift box",
        "Cake & champagne",
      ],
    },
  ];
  for (const s of SCENES) await ensureScenenary(s);

  console.log("\nMarketplace products:");
  const PRODUCTS: ProductSeed[] = [
    // PLACE_SUGGESTION
    { slug: "place-airbnb", name: "Curated Airbnb", category: "PLACE_SUGGESTION", subcategory: "Airbnb", description: "Hand-picked Airbnb with romantic interior, by destination.", priceCents: 12000 },
    { slug: "place-boat", name: "Boat Cruise", category: "PLACE_SUGGESTION", subcategory: "Boat Cruise", description: "Private boat cruise on Lake Victoria or the Nile.", priceCents: 35000 },
    { slug: "place-cottage", name: "Forest Cottage", category: "PLACE_SUGGESTION", subcategory: "Forest Cottage", description: "Secluded forest cottage retreat with full setup.", priceCents: 22000 },
    { slug: "place-island", name: "Private Island Stay", category: "PLACE_SUGGESTION", subcategory: "Island", description: "Multi-day island escape with concierge.", priceCents: 80000 },
    { slug: "place-gamepark", name: "Gamepark Retreat", category: "PLACE_SUGGESTION", subcategory: "Gamepark", description: "Romantic suite inside a national park lodge.", priceCents: 60000 },

    // FLOWERS
    { slug: "flower-roses", name: "Red Roses Bouquet", category: "FLOWERS", subcategory: "Roses", description: "Premium long-stem red roses, hand-tied.", priceCents: 8000 },
    { slug: "flower-blue-roses", name: "Blue Roses Bouquet", category: "FLOWERS", subcategory: "Blue Roses", description: "Rare blue-tinted roses for a striking statement.", priceCents: 10500 },
    { slug: "flower-lily", name: "Lily Bouquet", category: "FLOWERS", subcategory: "Lily", description: "Fragrant white lilies, elegant and pure.", priceCents: 7500 },
    { slug: "flower-daisy", name: "Daisy Bouquet", category: "FLOWERS", subcategory: "Daisy", description: "Cheerful daisy arrangement, bright and soft.", priceCents: 5500 },
    { slug: "flower-sunflower", name: "Sunflower Bouquet", category: "FLOWERS", subcategory: "Sunflower", description: "Sun-warmed bouquet for a joyful mood.", priceCents: 6500 },
    { slug: "flower-mixed", name: "Mixed Wild Bouquet", category: "FLOWERS", subcategory: "Mixed", description: "Designer-mixed seasonal florals.", priceCents: 9000 },

    // BEVERAGE
    { slug: "drink-wine", name: "Curated Wine Pairing", category: "BEVERAGE", subcategory: "Wine", description: "Sommelier-picked bottle pairing for the menu.", priceCents: 12000 },
    { slug: "drink-champagne", name: "Champagne Service", category: "BEVERAGE", subcategory: "Champagne", description: "Premium champagne, chilled and presented on arrival.", priceCents: 18000 },

    // TREATS
    { slug: "treat-chocolate-berries", name: "Chocolate & Berries Plate", category: "TREATS", subcategory: "Chocolate", description: "Hand-dipped chocolate strawberries and mixed berries.", priceCents: 4500 },
    { slug: "treat-cake", name: "Custom Cake", category: "TREATS", subcategory: "Cake", description: "Bespoke cake designed for the occasion.", priceCents: 9000 },

    // PLAYLIST
    { slug: "play-rnb", name: "Slow R&B Playlist", category: "PLAYLIST", subcategory: "R&B", description: "Curated 4-hour slow R&B playlist.", priceCents: 1500 },
    { slug: "play-jazz", name: "Jazz Playlist", category: "PLAYLIST", subcategory: "Jazz", description: "Smooth jazz, late-night lounge mood.", priceCents: 1500 },
    { slug: "play-instrumental", name: "Instrumental Playlist", category: "PLAYLIST", subcategory: "Instrumental", description: "Soft instrumentals — cinematic, ambient, classical.", priceCents: 1500 },

    // ROOM_SETUP
    { slug: "setup-petals", name: "Rose Petal Setup", category: "ROOM_SETUP", subcategory: "Petals", description: "Rose petals on bed, pathway, bathtub.", priceCents: 5000 },
    { slug: "setup-candle-dinner", name: "Candlelight Dinner Setup", category: "ROOM_SETUP", subcategory: "Dinner", description: "Themed dinner table with candles and linen.", priceCents: 12000 },
    { slug: "setup-themed-decor", name: "Themed Color Decor", category: "ROOM_SETUP", subcategory: "Decor", description: "Color-coordinated decor matched to your theme.", priceCents: 15000 },

    // ADULT_PLAY
    { slug: "play-dice", name: "Lover's Dice", category: "ADULT_PLAY", subcategory: "Game", description: "Tasteful intimate dice set.", priceCents: 1800 },
    { slug: "play-blindfold", name: "Silk Blindfold", category: "ADULT_PLAY", subcategory: "Blindfold", description: "Weighted silk blindfold, plush velvet lining.", priceCents: 4500 },
    { slug: "play-rope", name: "Soft Rope Set", category: "ADULT_PLAY", subcategory: "Rope", description: "Soft cotton rope, beginner-friendly.", priceCents: 3500 },
    { slug: "play-cards", name: "Truth or Dare Cards", category: "ADULT_PLAY", subcategory: "Cards", description: "Curated, tasteful card deck for couples.", priceCents: 2200 },
    { slug: "play-oils", name: "Body Oils & Lubricants", category: "ADULT_PLAY", subcategory: "Oils", description: "Premium oils with calming scent options.", priceCents: 3000 },
    { slug: "play-position-book", name: "Position-of-the-Day Book", category: "ADULT_PLAY", subcategory: "Book", description: "Tastefully illustrated book of intimate ideas.", priceCents: 2500 },

    // SENSUAL_TOUCH
    { slug: "touch-silk-robe", name: "Silk Robe", category: "SENSUAL_TOUCH", subcategory: "Robe", description: "Floor-length Italian silk robe.", priceCents: 12000 },
    { slug: "touch-lingerie", name: "Lingerie Selection", category: "SENSUAL_TOUCH", subcategory: "Lingerie", description: "Curated lingerie box matched to your size & style.", priceCents: 16500 },

    // LUXURY_SERVICE
    { slug: "lux-massage", name: "Couple Massage", category: "LUXURY_SERVICE", subcategory: "Massage", description: "Two professional therapists, in-suite.", priceCents: 25000 },
    { slug: "lux-photo", name: "Private Photographer", category: "LUXURY_SERVICE", subcategory: "Photo", description: "Discreet, artistic coverage of your moment.", priceCents: 30000 },
    { slug: "lux-violin", name: "Live Violin", category: "LUXURY_SERVICE", subcategory: "Music", description: "Live solo violinist for a portion of the evening.", priceCents: 28000 },
    { slug: "lux-sax", name: "Live Saxophone", category: "LUXURY_SERVICE", subcategory: "Music", description: "Live solo saxophonist, smooth jazz mood.", priceCents: 28000 },

    // ULTRA_LUXURY / BILLIONAIRE
    { slug: "ultra-proposal", name: "Surprise Proposal Production", category: "ULTRA_LUXURY", description: "Full surprise proposal staged with photographer, music, decor.", priceCents: 90000 },
    { slug: "ultra-vip-airbnb", name: "VIP Airbnb Experience", category: "ULTRA_LUXURY", description: "High-end Airbnb with full ultra-luxury setup.", priceCents: 75000 },
    { slug: "billionaire-package", name: "Full Billionaire Style Package", category: "BILLIONAIRE_PACKAGE", description: "Violin music, rose petals, candles, champagne, dinner table setup, bubble bath, lingerie gift box, cake.", priceCents: 200000 },

    // LIGHTING
    { slug: "light-candles", name: "Warm Candle Set", category: "LIGHTING", subcategory: "Candles", description: "Curated set of warm-toned candles for the room.", priceCents: 4000 },
    { slug: "light-lamps", name: "Soft Lamp Set", category: "LIGHTING", subcategory: "Lamps", description: "Soft ambient lamps with warm bulbs.", priceCents: 5500 },
  ];
  for (const p of PRODUCTS) await ensureProduct(p);
  console.log(`  ✓ ${PRODUCTS.length} products ensured`);

  console.log(`\nDone.\n`);
  console.log(`Sign in as ADMIN at /login → AdminMoonRose / ChangeMe-Admin-2026!`);
  console.log(`(rotate these passwords from /admin/users immediately in production)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
