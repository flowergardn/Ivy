import { db } from "~/server/db";
import { server as serverSchema } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function handleAuth(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const serverData = await db
    .select()
    .from(serverSchema)
    .where(eq(serverSchema.apiKey, authHeader))

  if (serverData.length === 0 || !serverData[0]) return null;

  return serverData[0];
}
