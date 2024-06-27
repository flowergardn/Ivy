"use server";

import { eq } from "drizzle-orm";
import * as OTPAuth from "otpauth";
import { typeid } from "typeid-ts";
import { db } from "~/server/db";
import {
  session as sessionSchema,
  user as userSchema,
} from "~/server/db/schema";

export default async function validateCode(code: string, secret: string) {
  const totp = new OTPAuth.TOTP({
    issuer: "Ivy",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  const validToken = totp.generate();

  const isValid = validToken === code;

  if (!isValid) return false;

  const sessionData = await db
    .select()
    .from(sessionSchema)
    .where(eq(sessionSchema.secret, secret));

  if (sessionData.length === 0) return false;
  const session = sessionData[0]!;

  await db.delete(sessionSchema).where(eq(sessionSchema.secret, secret));

  await db.insert(userSchema).values({
    minecraftUUID: session.minecraftUUID,
    secret: session.secret,
    id: typeid("user"),
    serverId: session.serverId,
  });

  return true;
}
