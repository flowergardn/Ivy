import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as OTPAuth from "otpauth";
import { db } from "~/server/db";
import { session as sessionSchema } from "~/server/db/schema";
import SetupPage from "./components/setup";

export default async function SessionPage({
  params: { id: sessionId },
}: {
  params: { id: string };
}) {
  const sessionData = await db
    .select()
    .from(sessionSchema)
    .where(eq(sessionSchema.id, sessionId));

  if (sessionData.length === 0) redirect("/");
  const session = sessionData[0]!;

  const totp = new OTPAuth.TOTP({
    issuer: "Ivy",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: session.secret,
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <SetupPage secret={session.secret} totpUrl={totp.toString()} />
    </div>
  );
}
