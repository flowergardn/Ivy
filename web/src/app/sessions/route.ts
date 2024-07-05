import { eq } from "drizzle-orm";
import * as OTPAuth from "otpauth";
import { typeid } from "typeid-ts";
import { db } from "~/server/db";
import { session as sessionSchema } from "~/server/db/schema";
import { handleAuth } from "~/server/handleAuth";

const error = (error: string, status = 401) =>
  new Response(JSON.stringify({ error }), { status });

export async function POST(request: Request) {
  const server = await handleAuth(request);
  if (!server) return error("Unauthorized", 401);

  const body: {
    uuid: string;
  } = await request.json();

  const secret = new OTPAuth.Secret({ size: 20 });

  const currentSession = await db
    .select({
      id: sessionSchema.id,
      secret: sessionSchema.secret,
    })
    .from(sessionSchema)
    .where(eq(sessionSchema.minecraftUUID, body.uuid));

  if (currentSession.length > 0)
    return error("This user has a pre-existing session", 400);

  const session = await db
    .insert(sessionSchema)
    .values({
      serverId: server.id,
      minecraftUUID: body.uuid,
      secret: secret.base32,
      id: typeid("session"),
    })
    .returning();

  return Response.json(session[0]);
}
