import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { user as usersSchema } from "~/server/db/schema";
import { handleAuth } from "~/server/handleAuth";

const error = (error: string, status = 401) =>
  new Response(JSON.stringify({ error }), { status });

export async function GET(request: Request) {
  const server = await handleAuth(request);
  if (!server) return error("Unauthorized", 401);

  const users = await db
    .select({
      uuid: usersSchema.minecraftUUID,
    })
    .from(usersSchema)
    .where(eq(usersSchema.serverId, server.id));

  return Response.json({
    users,
  });
}
