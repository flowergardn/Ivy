"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import createServer from "../actions/createServer";
import { toast } from "~/components/ui/use-toast";

export default function CreateServerDialog(props: {
  children?: React.ReactNode;
}) {
  const FormSchema = z.object({
    serverName: z.string(),
  });
  type FormType = z.infer<typeof FormSchema>;

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: FormType) {
    const res = await createServer(data.serverName);

    if (res.success) {
      location.reload();
      return;
    }

    toast({
      title: "Failed to create server",
      description: res.message,
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a server</AlertDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a server name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="float-right mt-4 space-x-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
