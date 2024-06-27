CREATE TABLE IF NOT EXISTS "ivy_server" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_key" varchar(30) NOT NULL,
	CONSTRAINT "ivy_server_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ivy_session" (
	"id" text PRIMARY KEY NOT NULL,
	"minecraft_uuid" varchar(36) NOT NULL,
	"server_id" serial NOT NULL,
	"secret" varchar(32) NOT NULL,
	CONSTRAINT "ivy_session_id_unique" UNIQUE("id"),
	CONSTRAINT "ivy_session_minecraft_uuid_unique" UNIQUE("minecraft_uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ivy_user" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" varchar(32) NOT NULL,
	"minecraft_uuid" varchar(36) NOT NULL,
	"server_id" serial NOT NULL,
	CONSTRAINT "ivy_user_id_unique" UNIQUE("id"),
	CONSTRAINT "ivy_user_minecraft_uuid_unique" UNIQUE("minecraft_uuid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ivy_session" ADD CONSTRAINT "ivy_session_server_id_ivy_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."ivy_server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ivy_user" ADD CONSTRAINT "ivy_user_server_id_ivy_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."ivy_server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
