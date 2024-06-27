import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "~/components/Navbar";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";
import { server as serverSchema, user as userSchema } from "~/server/db/schema";
import { db } from "~/server/db";
import { Button } from "~/components/ui/button";
import CreateServerDialog from "./createServerDialog";
import { eq } from "drizzle-orm";
import { ServerWithUsers } from "~/interfaces/Servers";

export default async function DashboardPage() {
  const isLoggedIn = cookies().has("accessToken");

  if (!isLoggedIn) redirect("/auth");

  const servers = await getServers();
  console.log(servers);

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <div className="m-8 hidden p-4 md:block">
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
        <div>
          <DataTable
            columns={columns}
            data={servers}
            className="w-fit"
            noResults={<p>You have no servers registered within Ivy.</p>}
          />
        </div>
      </div>
    </div>
  );
}

async function getServers() {
  const serversMap = new Map();

  const dbResults = await db
    .select({
      id: serverSchema.id,
      name: serverSchema.name,
      apiKey: serverSchema.apiKey,
      userUUID: userSchema.minecraftUUID,
    })
    .from(serverSchema)
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
      serverEntry.users.push({
        minecraftUUID: s.userUUID,
        name: userInfo.name,
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
