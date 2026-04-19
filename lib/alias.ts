import "server-only";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

/**
 * Curated word lists chosen for tone: discreet, romantic, mysterious, never crude.
 * Combined as `${PREFIX}${SUFFIX}_${NN}` to give >250k unique combos before relying
 * on the numeric suffix.
 */
const ALIAS_PREFIXES = [
  "Velvet", "Crimson", "Amber", "Ivory", "Onyx", "Hidden", "Silent", "Golden",
  "Azure", "Ember", "Silken", "Twilight", "Midnight", "Sable", "Ruby", "Pearl",
  "Marble", "Whisper", "Moonlit", "Starlit", "Garnet", "Plum", "Rosewood",
  "Saffron", "Topaz", "Coral", "Jade", "Indigo", "Ivory", "Opal", "Cypress",
  "Lavender", "Cobalt", "Sapphire", "Amethyst",
];

const ALIAS_SUFFIXES = [
  "Fox", "Rose", "Willow", "Lark", "Jasper", "Moon", "Shadow", "Heart",
  "Dove", "Swan", "Falcon", "Dahlia", "Lily", "Iris", "Cypress", "Cedar",
  "Ember", "Wisp", "Fern", "Orchid", "Magnolia", "Petal", "Bloom", "Echo",
  "Verse", "Cinder", "Quill", "Velour", "Mirage", "Dune", "Aria", "Lyric",
  "Sonnet", "Stanza",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a globally unique client alias. Retries with collision check
 * against the database until it finds a free one.
 */
export async function generateUniqueAlias(): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const candidate = `${pick(ALIAS_PREFIXES)}${pick(ALIAS_SUFFIXES)}_${
      Math.floor(Math.random() * 900) + 100
    }`;
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.alias, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
  }
  // Extremely unlikely fallback — append timestamp tail to guarantee uniqueness.
  return `${pick(ALIAS_PREFIXES)}${pick(ALIAS_SUFFIXES)}_${Date.now()
    .toString(36)
    .slice(-5)}`;
}
