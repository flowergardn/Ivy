"use server";

import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { Admin, admin as adminSchema } from "~/server/db/schema";
import jwt from "jsonwebtoken";
import { env } from "~/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(username: string, password: string) {
  const currentUser = await db
    .select()
    .from(adminSchema)
    .where(eq(adminSchema.username, username));

  if (currentUser.length > 0)
    return {
      succcess: false,
      message: "Username is already taken.",
    };

  let createdUser: Admin[];

  try {
    const hash = await argon2.hash(password);

    createdUser = await db
      .insert(adminSchema)
      .values({
        username,
        password: hash,
      })
      .returning();
  } catch (error) {
    return {
      succcess: false,
      message: "An error occurred while creating your account.",
    };
  }

  const accessToken = jwt.sign(
    {
      username,
      id: createdUser[0]!.id,
    },
    env.JWT_SECRET,
  );

  cookies().set("accessToken", accessToken);

  redirect("/dashboard");
}

export async function login(username: string, password: string) {
  const currentUser = await db
    .select()
    .from(adminSchema)
    .where(eq(adminSchema.username, username));

  if (currentUser.length === 0)
    return {
      succcess: false,
      message: "Username or password is incorrect.",
    };

  const user = currentUser[0]!;

  try {
    const isValid = await argon2.verify(user.password, password);

    if (!isValid)
      return {
        succcess: false,
        message: "Username or password is incorrect.",
      };
  } catch (error) {
    return {
      succcess: false,
      message: "An error occurred while doing security checks.",
    };
  }

  const accessToken = jwt.sign(
    {
      username,
      id: user.id,
    },
    env.JWT_SECRET,
  );

  cookies().set("accessToken", accessToken);

  redirect("/dashboard");
}
