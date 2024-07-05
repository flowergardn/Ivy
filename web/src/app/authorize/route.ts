import { eq } from "drizzle-orm";
import * as OTPAuth from "otpauth";
import { db } from "~/server/db";
import { TOTP_CONFIG } from "~/server/constants";
import { user as usersSchema } from "~/server/db/schema";
import { handleAuth } from "~/server/handleAuth";

const error = (error: string, status = 401) =>
  new Response(JSON.stringify({ error }), { status });

export async function PUT(req: Request) {
  const server = await handleAuth(req);
  if (!server) return error("Unauthorized", 401);

  const body: {
    uuid: string;
    code: string;
  } = await req.json();

  if (!body.code || !body.uuid) return error("Bad request", 400);

  const user = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.minecraftUUID, body.uuid));

  if (user.length === 0 || !user[0]) return error("User not found", 404);

  const validCode = new OTPAuth.TOTP({
    ...TOTP_CONFIG,
    label: `Ivy`,
    secret: user[0].secret,
  }).generate();

  if (validCode !== body.code) return error("Invalid code", 401);

  return Response.json({ success: true });
}
