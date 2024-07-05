"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import QRCode from "./qrcode";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { toast } from "~/components/ui/use-toast";
import validateCode from "../validateCode";

export default function SetupPage(props: { secret: string; totpUrl: string }) {
  enum Step {
    Setup2FA,
    Test2FA,
    Success,
  }
  const [page, setPage] = useState(Step.Setup2FA);

  function Setup2FA() {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add 2FA to your account</CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center">
          <QRCode url={props.totpUrl} />
          <p className="mt-4 text-center text-sm italic text-gray-300">
            ...or use the following code on your authenticator app:
          </p>
          <br />
          <code className="rounded-lg bg-primary p-2 text-sm">
            {props.secret}
          </code>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setPage(Step.Test2FA)}>
            <CheckIcon className="mr-2 h-4 w-4" /> I&apos;ve added 2FA
          </Button>
        </CardFooter>
      </Card>
    );
  }

  function Test2FA() {
    const FormSchema = z.object({
      pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
      }),
    });

    type FormType = z.infer<typeof FormSchema>;
    const form = useForm<FormType>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        pin: "",
      },
    });

    async function onSubmit(data: FormType) {
      const valid = await validateCode(data.pin, props.secret);

      if (!valid) {
        toast({
          title: "Invalid code",
          description: "Please try again.",
        });
        return;
      }

      setPage(Step.Success);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirm 2FA</CardTitle>
              <CardDescription>
                Please confirm your 2FA code on your authenticator app.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                <CheckIcon className="mr-2 h-4 w-4" /> Confirm
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    );
  }

  function Success() {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Successfully added 2FA 🎉</CardTitle>
          <CardDescription>
            In order to do certain things, you will need to confirm your 2FA
            code using <code>/authorize</code> in game.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  switch (page) {
    case Step.Setup2FA:
      return <Setup2FA />;
    case Step.Test2FA:
      return <Test2FA />;
    case Step.Success:
      return <Success />;
  }
}
