"use client";

import SignIn from "components/auth/SignIn";
import SignUp from "components/auth/SignUp";
import { useSearchParams } from "next/navigation";

const page = () => {
  const params = useSearchParams();
  const method = params.get("method");

  return <>{method === "signup" ? <SignUp /> : <SignIn />}</>;
};

export default page;
