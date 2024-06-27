// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator, serial, text, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ivy_${name}`);

export const user = createTable("user", {
  // typeid: user_xxxxxxxxxxx
  id: text("id").unique().notNull().primaryKey(),
  // 2fa secret
  secret: varchar("secret", { length: 32 }).notNull(),
  // Minecraft UUID
  minecraftUUID: varchar("minecraft_uuid", { length: 36 }).unique().notNull(),
  // Ivy Server ID
  serverId: serial("server_id")
    .notNull()
    .references(() => server.id, { onDelete: "cascade" }),
});

export const server = createTable("server", {
  id: serial("id").unique().notNull().primaryKey(),
  creator: serial("creator")
    .notNull()
    .references(() => admin.id),
  name: varchar("name", { length: 30 }).notNull(),
  apiKey: varchar("api_key", { length: 30 }).notNull(),
});

// This is used to create sessions. Once the user confirms their 2fa code, their entry is deleted and replaced with a user entry.
export const session = createTable("session", {
  // typeid: session_xxxxxxxxxxx
  id: text("id").unique().notNull().primaryKey(),
  // Minecraft UUID
  minecraftUUID: varchar("minecraft_uuid", { length: 36 }).unique().notNull(),
  // Ivy Server ID
  serverId: serial("server_id")
    .notNull()
    .references(() => server.id, { onDelete: "no action" }),
  // 2FA secret
  secret: varchar("secret", { length: 32 }).notNull(),
});

export const admin = createTable("admin", {
  id: serial("id").unique().notNull().primaryKey(),
  username: varchar("username").notNull(),
  password: varchar("password").notNull(),
});

export interface User {
  secret: string;
  minecraftUUID: string;
  serverId: number;
}

export interface Server {
  name: string;
  id: number;
  apiKey: string;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
}
