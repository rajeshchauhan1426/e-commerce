import prismadb from "@/app/libs/prismadb";
import React from "react";
import { SettingsForm } from "./Components/settings-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  // Fetch the store directly without checking user authentication
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  // If the store is not found, you might want to handle this case
  if (!store) {
    // Optionally, redirect or show a message if the store is not found
    return <div>Store not found</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;