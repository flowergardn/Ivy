"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ServerWithUsers } from "~/interfaces/Servers";
import { DataTable } from "./ui/data-table";
import { Button } from "~/components/ui/button";

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
            <Button
              variant="ghost"
              className="flex h-fit w-fit items-center gap-2 p-2"
              key={user.minecraftUUID}
            >
              <img
                src={`https://skins.mcstats.com/face/${user.minecraftUUID}`}
                className="h-6 w-6 rounded-lg"
              />
              <span>{user.name}</span>
            </Button>
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
