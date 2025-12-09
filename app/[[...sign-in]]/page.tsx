"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  // In your login page component
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.publicMetadata?.role) {
      const role = user.publicMetadata.role as string;
      if (role === "student") {
        router.replace("/gpa"); // use replace() to avoid back-button issues
      } else {
        router.replace("/home");
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-full max-w-md"
        >
          <h1 className="text-xl font-bold flex items-center justify-center gap-2 w-full ">
            <Image src="/logo.png" alt="" height={48} width={48} />
          </h1>
          <h2 className="text-gray-400">Sign into your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400 bg-red-50 border border-red-200 rounded-md p-3 max-w-full break-words" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-sm text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-sm text-red-400 bg-red-50 border border-red-200 rounded-md p-2 max-w-full break-words" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-sm text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-sm text-red-400 bg-red-50 border border-red-200 rounded-md p-2 max-w-full break-words" />
          </Clerk.Field>
          <SignIn.Action
            submit
            className="bg-blue-500 text-white my-1 rounded-sm text-sm p-[10px] cursor-pointer"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
