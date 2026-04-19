CREATE TYPE "public"."chat_sender" AS ENUM('CLIENT', 'AGENT');--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"sender" "chat_sender" NOT NULL,
	"body" text NOT NULL,
	"read_by_client" boolean DEFAULT false NOT NULL,
	"read_by_agent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_client_user_id_users_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_thread_idx" ON "chat_messages" USING btree ("client_user_id","agent_id");--> statement-breakpoint
CREATE INDEX "chat_created_idx" ON "chat_messages" USING btree ("created_at");