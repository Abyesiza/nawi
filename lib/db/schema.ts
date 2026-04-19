import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* ───────────────────────────── Enums ───────────────────────────── */

export const roleEnum = pgEnum("role", ["CLIENT", "AGENT", "ADMIN"]);

export const userStatusEnum = pgEnum("user_status", [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
]);

export const contactMethodEnum = pgEnum("contact_method", [
  "WHATSAPP",
  "EMAIL",
  "NONE",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
]);

export const venuePrefEnum = pgEnum("venue_pref", ["EXTERNAL", "CLIENT"]);

export const placeTypeEnum = pgEnum("place_type", [
  "AIRBNB",
  "BOAT_CRUISE",
  "FOREST_COTTAGE",
  "ISLAND",
  "GAMEPARK",
  "HOTEL",
  "OTHER",
]);

export const messageChannelEnum = pgEnum("message_channel", [
  "EMAIL",
  "WHATSAPP",
]);

export const messageStatusEnum = pgEnum("message_status", [
  "QUEUED",
  "SENT",
  "FAILED",
  "STUBBED",
]);

export const productCategoryEnum = pgEnum("product_category", [
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
]);

/* ───────────────────────────── Users ───────────────────────────── */

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    alias: text("alias").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("CLIENT"),
    status: userStatusEnum("status").notNull().default("ACTIVE"),

    // Contact info (encrypted at rest with AES-256-GCM via lib/crypto.ts)
    contactMethod: contactMethodEnum("contact_method").notNull().default("NONE"),
    contactValueEnc: text("contact_value_enc"),

    // Real-name fields are intentionally absent — we never collect them for clients.
    // For staff, see `agents.displayName`.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_alias_unique").on(t.alias)]
);

/* ───────────────────────────── Sessions ─────────────────────────── */

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(), // sha256 of opaque random token
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)]
);

/* ───────────────────────────── Agents ───────────────────────────── */

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  // Real internal name — visible only to admins, never exposed to clients.
  displayName: text("display_name").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * The privacy core: every (agent, client) pair gets a unique persona name.
 * The same human agent appears under different names to different clients.
 */
export const agentPersonas = pgTable(
  "agent_personas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    clientUserId: uuid("client_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    personaName: text("persona_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("personas_agent_client_unique").on(t.agentId, t.clientUserId),
    index("personas_client_idx").on(t.clientUserId),
  ]
);

/* ───────────────────────────── Scenenaries (Experiences) ────────── */

export const scenenaries = pgTable("scenenaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  heroImageUrl: text("hero_image_url"),
  galleryUrls: jsonb("gallery_urls").$type<string[]>().notNull().default([]),
  basePriceCents: integer("base_price_cents"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ───────────────────────────── Products / Marketplace ───────────── */

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: productCategoryEnum("category").notNull(),
    subcategory: text("subcategory"), // free-text so admin can add new ones
    description: text("description").notNull(),
    priceCents: integer("price_cents").notNull(),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    /** Search/discovery tags surfaced in the marketplace. */
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    /** When true, item is featured at the top of the marketplace. */
    featured: boolean("featured").notNull().default(false),
    /** Lead time in days from request to availability (0 = same day). */
    leadTimeDays: integer("lead_time_days").notNull().default(0),
    /** Stock indicator: IN_STOCK | LOW | OUT | ON_REQUEST */
    stockStatus: text("stock_status").notNull().default("IN_STOCK"),
    /** Lower numbers sort first within their category. */
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    discreetShip: boolean("discreet_ship").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("products_category_idx").on(t.category),
    index("products_featured_idx").on(t.featured),
  ]
);

/* ───────────────────────────── Bookings ─────────────────────────── */

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Created on submit (per architectural decision: on-submit account creation)
    clientUserId: uuid("client_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    assignedAgentId: uuid("assigned_agent_id").references(() => agents.id, {
      onDelete: "set null",
    }),

    status: bookingStatusEnum("status").notNull().default("PENDING_REVIEW"),

    // Core fields
    eventType: text("event_type").notNull(),
    theme: text("theme"),
    scenenaryId: uuid("scenenary_id").references(() => scenenaries.id, {
      onDelete: "set null",
    }),

    // Dates
    dateFrom: timestamp("date_from", { withTimezone: true }).notNull(),
    dateTo: timestamp("date_to", { withTimezone: true }),
    preferredTime: text("preferred_time"),

    // Logistics
    guestCount: text("guest_count").notNull().default("2"),
    venuePref: venuePrefEnum("venue_pref").notNull().default("EXTERNAL"),
    placeType: placeTypeEnum("place_type"),
    destination: text("destination"),
    roomRating: integer("room_rating"), // 3, 4, 5
    pickupRequired: boolean("pickup_required").notNull().default(false),

    addons: jsonb("addons").$type<string[]>().notNull().default([]),
    productIds: jsonb("product_ids").$type<string[]>().notNull().default([]),
    specialNotes: text("special_notes"),

    totalPriceCents: integer("total_price_cents"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("bookings_client_idx").on(t.clientUserId),
    index("bookings_agent_idx").on(t.assignedAgentId),
    index("bookings_status_idx").on(t.status),
  ]
);

/* ───────────────────────────── Messages log ─────────────────────── */

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id").references(() => bookings.id, {
      onDelete: "set null",
    }),
    toUserId: uuid("to_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    channel: messageChannelEnum("channel").notNull(),
    toAddressEnc: text("to_address_enc").notNull(), // encrypted
    subject: text("subject"),
    body: text("body").notNull(),
    status: messageStatusEnum("status").notNull().default("QUEUED"),
    error: text("error"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("messages_booking_idx").on(t.bookingId),
    index("messages_user_idx").on(t.toUserId),
  ]
);

/* ───────────────────────────── Chat (in-app) ────────────────────── */

export const chatSenderEnum = pgEnum("chat_sender", ["CLIENT", "AGENT"]);

/**
 * In-app chat between a client and their assigned agent. The (clientUserId, agentId)
 * pair acts as an implicit thread — no separate threads table needed.
 *
 * Privacy rules enforced in actions:
 *  - client only reads/writes rows where clientUserId == self
 *  - agent only reads/writes rows where agentId == self.agentId AND a persona exists
 *    for (agentId, clientUserId)
 *  - the persona name (not displayName) is used in any UI label shown to the client
 */
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientUserId: uuid("client_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    sender: chatSenderEnum("sender").notNull(),
    body: text("body").notNull(),
    readByClient: boolean("read_by_client").notNull().default(false),
    readByAgent: boolean("read_by_agent").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("chat_thread_idx").on(t.clientUserId, t.agentId),
    index("chat_created_idx").on(t.createdAt),
  ]
);

/* ───────────────────────────── Types ────────────────────────────── */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type AgentPersona = typeof agentPersonas.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Scenenary = typeof scenenaries.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
