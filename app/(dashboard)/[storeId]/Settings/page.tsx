import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prismadb from "@/app/libs/prismadb";
import React from "react";
import { SettingsForm } from "./Components/settings-form";



interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  // Get the session using NextAuth
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect them to the homepage
  if (!session || !session.user?.email) {
    redirect("/");
  }

  // Look up the user in the database using their email
  const user = await prismadb.user.findUnique({
    where: {
      email: session.user.email, // Use email to fetch the user
    },
  });

  // If the user is not found, redirect them to the homepage
  if (!user) {
    redirect("/");
  }

  // Fetch the store associated with the user
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: user.id, // Use the user ID retrieved from the database
    },
  });

  // If the store is not found, redirect them to the homepage
  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={store}/>

        </div>
    
    </div>
  );
};

export default SettingsPage;
