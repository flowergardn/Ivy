"use client";

import { DataTable } from "~/components/ui/data-table";
import { isMobile } from "react-device-detect";
import { ServerWithUsers } from "~/interfaces/Servers";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import DeleteServerDialog from "./dialogs/deleteServerDialog";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import RemoveUserDialog from "./dialogs/removeUserDialog";

export default function Table(props: { servers: ServerWithUsers[] }) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile]);

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

        console.log("Users in column", users);

        let cols = users.length > 4 ? 4 : users.length;
        if (mobile) cols = 2;

        const Users = () =>
          users.map((user) => (
            <DropdownMenu key={user.minecraftUUID}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-fit w-fit items-center gap-2 p-2"
                >
                  <img
                    src={`https://skins.mcstats.com/face/${user.minecraftUUID}`}
                    className="h-6 w-6 rounded-lg"
                  />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <RemoveUserDialog user={user} />
              </DropdownMenuContent>
            </DropdownMenu>
          ));

        return (
          <div className={cn("grid grid-cols-1 gap-2", `md:grid-cols-${cols}`)}>
            {users.length > 0 ? <Users /> : <p>No users</p>}
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

  // Filter the columns to only show "important" columns on mobile
  const cols = columns.filter((col) => {
    if (!mobile) return true;
    const currentColumn = col as { accessorKey: string };
    const showColumns = ["name", "users"];
    if (showColumns.includes(currentColumn.accessorKey)) return true;
  });

  return (
    <DataTable
      columns={cols}
      data={props.servers}
      noResults={<p>You have no servers registered within Ivy.</p>}
    />
  );
}
