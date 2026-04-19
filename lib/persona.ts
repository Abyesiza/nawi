import "server-only";
import { db } from "./db";
import { agents, agentPersonas } from "./db/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Pool of "stage names" assigned to an agent on a per-client basis.
 * Same agent appears as different persona to different clients — privacy by design.
 */
const PERSONA_FIRST = [
  "Silver", "Crimson", "Onyx", "Ethereal", "Silent", "Velvet", "Midnight",
  "Sable", "Ivory", "Obsidian", "Hidden", "Quiet", "Phantom", "Shadow",
  "Twilight", "Marble", "Moonless", "Starless", "Cinder", "Smoke",
];

const PERSONA_LAST = [
  "Phantom", "Mist", "Edge", "Pulse", "Siren", "Bloom", "Echo", "Wraith",
  "Verse", "Cipher", "Ember", "Vale", "Quill", "Halo", "Lark", "Aria",
  "Crescent", "Sable", "Tide", "Knight",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(): string {
  return `${pick(PERSONA_FIRST)}${pick(PERSONA_LAST)}`;
}

/**
 * Ensure a persona exists for the (agent, client) pair. If one already
 * exists, return it unchanged (we never mint a second persona for a pair —
 * that would leak a relationship). Otherwise mint a fresh, agent-unique name.
 */
export async function ensurePersonaForPair(
  agentId: string,
  clientUserId: string
): Promise<{ personaName: string }> {
  const existing = await db
    .select()
    .from(agentPersonas)
    .where(
      and(
        eq(agentPersonas.agentId, agentId),
        eq(agentPersonas.clientUserId, clientUserId)
      )
    )
    .limit(1);
  if (existing.length > 0) return { personaName: existing[0].personaName };

  let personaName = generateName();
  for (let i = 0; i < 8; i++) {
    const dup = await db
      .select({ id: agentPersonas.id })
      .from(agentPersonas)
      .where(
        and(
          eq(agentPersonas.agentId, agentId),
          eq(agentPersonas.personaName, personaName)
        )
      )
      .limit(1);
    if (dup.length === 0) break;
    personaName = generateName();
  }

  await db.insert(agentPersonas).values({
    agentId,
    clientUserId,
    personaName,
  });
  return { personaName };
}

/**
 * Assign an agent to a client (round-robin among available agents) and
 * mint a brand-new persona name unique within (agent, client). If a persona
 * already exists for this pair, return it.
 *
 * Returns { agentId, personaName }.
 */
export async function assignAgentAndPersona(
  clientUserId: string
): Promise<{ agentId: string; personaName: string }> {
  // Pick the available agent with the fewest existing personas (cheap load balancing).
  const candidates = await db
    .select({
      id: agents.id,
      personaCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${agentPersonas}
        WHERE ${agentPersonas.agentId} = ${agents.id}
      )`,
    })
    .from(agents)
    .where(eq(agents.isAvailable, true))
    .orderBy(sql`2 ASC`)
    .limit(1);

  if (candidates.length === 0) {
    throw new Error(
      "No agents are available. An admin must promote at least one user to AGENT."
    );
  }

  const agentId = candidates[0].id;

  const { personaName } = await ensurePersonaForPair(agentId, clientUserId);
  return { agentId, personaName };
}
