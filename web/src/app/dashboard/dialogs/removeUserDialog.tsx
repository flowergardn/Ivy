"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { SkullIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import removeUser from "../actions/removeUser";
import { UserWithName } from "~/interfaces/Servers";

export default function RemoveUserDialog(props: { user: UserWithName }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-full space-x-2 border-none p-0 text-red-400"
        >
          <span className="sr-only">Open menu</span>
          <SkullIcon className="h-4 w-4" />
          <div>Remove User</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the user
            from your server and invalidate ther 2FA secret.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              console.log("Removing user", props.user);
              await removeUser(props.user);
              location.reload();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
