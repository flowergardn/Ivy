import {
  GithubIcon,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";
import ExampleTable from "~/components/exampleTable";
import { LandingActions, LandingDescription, LandingHeader, LandingHeading } from "~/components/landing-components";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export default function HomePage() {
  return (
    <div className="container relative">
      <LandingHeader>
        <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
          <PartyPopper className="h-4 w-4" />{" "}
          <Separator className="mx-2 h-4" orientation="vertical" />{" "}
          <span>Open Beta</span>
        </div>
        <LandingHeading>Make your server secure</LandingHeading>
        <LandingDescription>
          Ivy is a simple, lightweight, and fast 2FA management solution that
          allows you to easily manage access to sensitive areas of your server.
        </LandingDescription>
        <LandingActions>
          <Link href="/auth" className={cn(buttonVariants())}>
            Get Started
          </Link>

          <Link
            target="_blank"
            rel="noreferrer"
            href={"https://github.com/prettyflowerss/Ivy"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <GithubIcon className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </LandingActions>
      </LandingHeader>
      <section className="flex justify-center items-center">
        <ExampleTable />
      </section>
    </div>
  );
}
