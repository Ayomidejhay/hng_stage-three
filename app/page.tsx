"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "./components/shared/SplashScreen";
import { getSession } from "./lib/storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const start = Date.now();
    const minSplash = 1000;

    const session = getSession();

    const elapsed = Date.now() - start;
    const wait = Math.max(0, minSplash - elapsed);

    const timer = setTimeout(() => {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, wait);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}