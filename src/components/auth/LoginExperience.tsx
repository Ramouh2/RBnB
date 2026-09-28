"use client";

import { useRouter } from "next/navigation";
import { signInAction } from "@/app/login/actions";
import { LiquidLogin } from "./LiquidLogin";

/** Branche LiquidLogin sur la Server Action d'authentification RBnB et la redirection dashboard. */
export function LoginExperience() {
  const router = useRouter();

  return (
    <LiquidLogin
      onSubmit={signInAction}
      onSuccess={() => {
        router.replace("/dashboard");
        router.refresh();
      }}
    />
  );
}
