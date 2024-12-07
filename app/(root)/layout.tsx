import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prismadb from "@/app/libs/prismadb";
import React from "react";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the session is valid
    if (!session?.user?.email) {
      console.log("No session found. Redirecting to /sign-in.");
      redirect("/");
    }

    // Fetch the user by email
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.id) {
      console.log("No user found for the given email. Redirecting to /sign-in.");
      redirect("/");
    }

    // Fetch a store associated with the user
    const store = await prismadb.store.findFirst({
      where: { userId: user.id },
    });

    if (store) {
      console.log(`Store found with ID: ${store.id}. Redirecting to /${store.id}.`);
      redirect(`/${store.id}`);
    } else {
      console.log("No store found for the user.");
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Error in SetupLayout:", error);
    redirect("/"); // Redirect to sign-in if something goes wrong
  }
}
