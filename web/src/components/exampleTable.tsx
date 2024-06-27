"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ServerWithUsers } from "~/interfaces/Servers";
import { DataTable } from "./ui/data-table";

const columns: ColumnDef<ServerWithUsers>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "apiKey",
    header: "API Key",
    cell: ({ row }) => {
      return (
        <code className="blur-sm transition-all duration-500 hover:blur-0">
          {row.original.apiKey}
        </code>
      );
    },
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => {
      const { users } = row.original;
      const cols = users.length > 5 ? 5 : users.length;
      return (
        <div className={`grid grid-cols-${cols} gap-2`}>
          {users.map((user) => (
            <div key={user.minecraftUUID} className="flex items-center gap-2">
              <img
                src={`https://skins.mcstats.com/face/${user.minecraftUUID}`}
                className="h-8 w-8 rounded-lg md:h-6 md:w-6"
              />
              <span className="hidden md:block">{user.name}</span>
            </div>
          ))}
        </div>
      );
    },
  },
];

export default function ExampleTable() {
  const serverData = [
    {
      id: 1,
      name: "Your Network",
      apiKey: "ivy_xxxxxxxxxxxxxxxx",
      users: [
        {
          minecraftUUID: "alex",
          name: "Alex",
        },
        {
          minecraftUUID: "steve",
          name: "Steve",
        },
      ],
    },
  ] as ServerWithUsers[];

  return (
    <DataTable
      columns={columns}
      data={serverData}
      className="w-fit"
      noResults={<p>You have no servers registered within Ivy.</p>}
    />
  );
}
