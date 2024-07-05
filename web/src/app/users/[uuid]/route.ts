import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { user as usersSchema } from "~/server/db/schema";
import { handleAuth } from "~/server/handleAuth";

const error = (error: string, status = 401) =>
  new Response(JSON.stringify({ error }), { status });

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const server = await handleAuth(request);
  if (!server) return error("Unauthorized", 401);

  const users = await db
    .select({
      uuid: usersSchema.minecraftUUID,
    })
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.serverId, server.id),
        eq(usersSchema.minecraftUUID, params.uuid),
      ),
    );

  if (users.length === 0) return error("User not found", 404);
  return Response.json(users[0]!);
}
