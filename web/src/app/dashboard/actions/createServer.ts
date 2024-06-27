"use server";

import { cookies } from "next/headers";
import { env } from "~/env";
import jwt from "jsonwebtoken";
import { db } from "~/server/db";
import { admin, server as serverSchema } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { typeid } from "typeid-ts";

interface TokenInfo {
  username: string;
}

export default async function createServer(serverName: string) {
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

  await db.insert(serverSchema).values({
    name: serverName,
    apiKey: typeid("ivy"),
    creator: userInfo.id,
  });

  return {
    success: true,
    message: "Server created successfully.",
  };
}
