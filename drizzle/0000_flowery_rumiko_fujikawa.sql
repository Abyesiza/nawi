CREATE TYPE "public"."booking_status" AS ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."contact_method" AS ENUM('WHATSAPP', 'EMAIL', 'NONE');--> statement-breakpoint
CREATE TYPE "public"."message_channel" AS ENUM('EMAIL', 'WHATSAPP');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('QUEUED', 'SENT', 'FAILED', 'STUBBED');--> statement-breakpoint
CREATE TYPE "public"."place_type" AS ENUM('AIRBNB', 'BOAT_CRUISE', 'FOREST_COTTAGE', 'ISLAND', 'GAMEPARK', 'HOTEL', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('PLACE_SUGGESTION', 'ADULT_PLAY', 'BEVERAGE', 'TREATS', 'FLOWERS', 'PLAYLIST', 'ROOM_SETUP', 'SENSUAL_TOUCH', 'LUXURY_SERVICE', 'ULTRA_LUXURY', 'BILLIONAIRE_PACKAGE', 'LIGHTING', 'LINGERIE', 'TOYS', 'ATMOSPHERE', 'PROPS_COSTUMES');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('CLIENT', 'AGENT', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('PENDING', 'ACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."venue_pref" AS ENUM('EXTERNAL', 'CLIENT');--> statement-breakpoint
CREATE TABLE "agent_personas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"client_user_id" uuid NOT NULL,
	"persona_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agents_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"assigned_agent_id" uuid,
	"status" "booking_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"event_type" text NOT NULL,
	"theme" text,
	"scenenary_id" uuid,
	"date_from" timestamp with time zone NOT NULL,
	"date_to" timestamp with time zone,
	"preferred_time" text,
	"guest_count" text DEFAULT '2' NOT NULL,
	"venue_pref" "venue_pref" DEFAULT 'EXTERNAL' NOT NULL,
	"place_type" "place_type",
	"destination" text,
	"room_rating" integer,
	"pickup_required" boolean DEFAULT false NOT NULL,
	"addons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"product_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"special_notes" text,
	"total_price_cents" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid,
	"to_user_id" uuid,
	"channel" "message_channel" NOT NULL,
	"to_address_enc" text NOT NULL,
	"subject" text,
	"body" text NOT NULL,
	"status" "message_status" DEFAULT 'QUEUED' NOT NULL,
	"error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" "product_category" NOT NULL,
	"subcategory" text,
	"description" text NOT NULL,
	"price_cents" integer NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"discreet_ship" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scenenaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hero_image_url" text,
	"gallery_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"base_price_cents" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scenenaries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alias" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'CLIENT' NOT NULL,
	"status" "user_status" DEFAULT 'ACTIVE' NOT NULL,
	"contact_method" "contact_method" DEFAULT 'NONE' NOT NULL,
	"contact_value_enc" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_personas" ADD CONSTRAINT "agent_personas_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_personas" ADD CONSTRAINT "agent_personas_client_user_id_users_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_user_id_users_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_assigned_agent_id_agents_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_scenenary_id_scenenaries_id_fk" FOREIGN KEY ("scenenary_id") REFERENCES "public"."scenenaries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personas_agent_client_unique" ON "agent_personas" USING btree ("agent_id","client_user_id");--> statement-breakpoint
CREATE INDEX "personas_client_idx" ON "agent_personas" USING btree ("client_user_id");--> statement-breakpoint
CREATE INDEX "bookings_client_idx" ON "bookings" USING btree ("client_user_id");--> statement-breakpoint
CREATE INDEX "bookings_agent_idx" ON "bookings" USING btree ("assigned_agent_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messages_booking_idx" ON "messages" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "messages_user_idx" ON "messages" USING btree ("to_user_id");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_alias_unique" ON "users" USING btree ("alias");