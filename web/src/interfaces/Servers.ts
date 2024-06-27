import type { Server, User } from "~/server/db/schema";

export interface UserWithName extends User {
  name: string;
}

export interface ServerWithUsers extends Server {
  users: UserWithName[];
}
