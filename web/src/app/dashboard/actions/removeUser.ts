"use server";

import { and, eq } from "drizzle-orm";
import { UserWithName } from "~/interfaces/Servers";
import { db } from "~/server/db";
import { user as userSchema } from "~/server/db/schema";

export default async function removeUser(user: UserWithName) {
  console.log("Removing user", user);
  await db
    .delete(userSchema)
    .where(
      and(eq(userSchema.id, user.id), eq(userSchema.serverId, user.serverId)),
    );

  return {
    success: true,
    message: "User removed successfully.",
  };
}
