"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type ServerWithUsers } from "~/interfaces/Servers";
import DeleteServerDialog from "./deleteServerDialog";

export const columns: ColumnDef<ServerWithUsers>[] = [
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
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DeleteServerDialog server={row.original} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
