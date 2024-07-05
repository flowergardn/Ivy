import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "~/components/ui/data-table";
import {
  server,
  server as serverSchema,
  user as userSchema,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { Button } from "~/components/ui/button";
import CreateServerDialog from "./dialogs/createServerDialog";
import { eq } from "drizzle-orm";
import { ServerWithUsers } from "~/interfaces/Servers";
import Table from "./table";
import jwt from "jsonwebtoken";
import { env } from "~/env";

export default async function DashboardPage() {
  const isLoggedIn = cookies().has("accessToken");

  if (!isLoggedIn) redirect("/auth");

  const servers = await getServers();

  return (
    <div className="h-screen">
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <div className="m-8 p-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-lg">
            Here you can see all the servers you have registered within Ivy.
          </p>
          <CreateServerDialog>
            <Button variant={"outline"} className="mt-4 border-primary/50">
              Add a server
            </Button>
          </CreateServerDialog>
        </div>
        <div className="w-full md:w-fit">
          <Table servers={servers} />
        </div>
      </div>
    </div>
  );
}

async function getServers() {
  const serversMap = new Map();

  const userToken = cookies().get("accessToken")?.value ?? "";
  const tokenInfo = jwt.verify(userToken, env.JWT_SECRET) as {
    username: string;
    id: number;
  };

  const dbResults = await db
    .select({
      id: serverSchema.id,
      name: serverSchema.name,
      apiKey: serverSchema.apiKey,
      userUUID: userSchema.minecraftUUID,
      userId: userSchema.id,
    })
    .from(serverSchema)
    .where(eq(serverSchema.creator, tokenInfo.id))
    .leftJoin(userSchema, eq(userSchema.serverId, serverSchema.id));

  const fetchPromises = dbResults.map(async (s) => {
    if (!serversMap.has(s.id)) {
      serversMap.set(s.id, {
        id: s.id,
        name: s.name,
        apiKey: s.apiKey,
        users: [],
      });
    }

    const serverEntry = serversMap.get(s.id);
    if (s.userUUID) {
      const userInfo = await fetchPlayer(s.userUUID);
      console.log("Adding user", {
        minecraftUUID: s.userUUID,
        name: userInfo.name,
        id: s.userId,
      });
      serverEntry.users.push({
        minecraftUUID: s.userUUID,
        name: userInfo.name,
        id: s.userId,
        serverId: s.id,
      });
    }
  });

  await Promise.all(fetchPromises);

  return Array.from(serversMap.values()) as ServerWithUsers[];
}

async function fetchPlayer(uuid: string) {
  interface Player {
    uuid: string;
    name: string;
  }

  const response = await fetch(
    `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,
  );
  const data = (await response.json()) as Player;
  return data;
}
