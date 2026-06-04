import { Suspense } from "react";
import { AccountLoginForm } from "@/components/account/AccountLoginForm";

export default function AccountLoginPage() {
  return (
    <Suspense>
      <AccountLoginForm />
    </Suspense>
  );
}
