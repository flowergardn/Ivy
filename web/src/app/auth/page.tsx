"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "~/components/ui/use-toast";
import { login, signUp } from "./actions";
import { hasCookie } from "cookies-next";

export default function Login() {
  useEffect(() => {
    if (hasCookie("accessToken")) location.replace("/dashboard");
  }, []);

  const FormSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: "Your username must be at least 2 characters.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Your username can only contain letters, numbers, and underscores.",
      }),
    password: z
      .string()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])[A-Za-z\d\S]{8,}$/, {
        message:
          "Your password must contain a minimum of eight characters, one letter, and one number.",
      }),
  });
  type FormType = z.infer<typeof FormSchema>;

  const Fields = (props: { form: UseFormReturn<FormType> }) => {
    return (
      <>
        <FormField
          control={props.form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="flowers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  };

  const LoginPage = () => {
    const form = useForm<FormType>({
      resolver: zodResolver(FormSchema),
    });

    async function onSubmit(data: FormType) {
      const result = await login(data.username, data.password);

      if (!result) return;

      if (!result.succcess) {
        toast({
          title: "Login failed",
          description: result.message,
        });
        return;
      }

      toast({
        title: "Login successful",
        description: "You can now manage your servers.",
      });
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Login to Ivy</CardTitle>
              <CardDescription>
                In order to manage your servers, you will need to login with
                your Ivy account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Fields form={form} />
            </CardContent>
            <CardFooter>
              <Button type="submit">Login</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    );
  };

  const SignUpPage = () => {
    const form = useForm<FormType>({
      resolver: zodResolver(FormSchema),
    });

    async function onSubmit(data: FormType) {
      const result = await signUp(data.username, data.password);

      if (!result.succcess) {
        toast({
          title: "Sign up failed",
          description: result.message,
        });
        return;
      }

      toast({
        title: "Sign up successful",
        description: "You can now manage your servers.",
      });
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Sign up for Ivy</CardTitle>
              <CardDescription>
                Create an account to start using Ivy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Fields form={form} />
            </CardContent>
            <CardFooter>
              <Button type="submit">Sign up</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    );
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginPage />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
