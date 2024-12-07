import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prismadb from "@/app/libs/prismadb";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar/navbar";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function DashboardLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>; // Ensure storeId is passed correctly as part of params
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  // Ensure the session is correctly fetched
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect("/"); // Redirect to sign-in if not authenticated
  }

  // Fetch the user based on their email (from session)
  const user = await prismadb.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.id) {
    redirect("/"); // Redirect if user ID is not found
  }

  // Get storeId from params, ensure it's available
  const storeId = params.storeId;  // Directly access params.storeId

  if (!storeId) {
    redirect("/");  // If no storeId, redirect to home or fallback page
  }

  // Check if the store exists and is associated with the user
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,  // Match store ID from params
      userId: user.id,  // Ensure the store belongs to the user
    },
  });

  // If store is not found, redirect to fallback page
  if (!store) {
    redirect("/"); // Redirect if store doesn't exist or user isn't authorized
  }

  // Render layout with children after store is validated
  return (
    <>
     
      {children}
    </>
  );
}
