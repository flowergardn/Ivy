"use server";

import { cookies } from "next/headers";
import { env } from "~/env";
import jwt from "jsonwebtoken";
import { db } from "~/server/db";
import { type Server, admin, server as serverSchema } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

interface TokenInfo {
  username: string;
}

export default async function deleteServer(server: Server) {
  const userToken = cookies().get("accessToken")?.value ?? "";
  const tokenInfo = jwt.verify(userToken, env.JWT_SECRET) as TokenInfo;

  const user = await db
    .select()
    .from(admin)
    .where(eq(admin.username, tokenInfo.username));

  if (user.length === 0)
    return {
      success: false,
      message: "You are not logged in.",
    };

  const userInfo = user[0]!;

  await db
    .delete(serverSchema)
    .where(
      and(
        eq(serverSchema.id, server.id),
        eq(serverSchema.creator, userInfo.id),
      ),
    );

  return {
    success: true,
    message: "Server deleted successfully.",
  };
}
