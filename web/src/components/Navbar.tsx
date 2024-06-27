"use client";

import { Button } from "./ui/button";
import { hasCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasCookie("accessToken"));
  }, []);

  const Buttons = () => {
    if (isLoggedIn) {
      return (
        <nav className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Log out
          </Button>
        </nav>
      );
    }

    return (
      <nav className="flex items-center gap-2">
        <a href={"/login"}>
          <Button size="sm" variant="outline">
            Log in
          </Button>
        </a>
      </nav>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Ivy</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Buttons />
        </div>
      </div>
    </header>
  );
}
