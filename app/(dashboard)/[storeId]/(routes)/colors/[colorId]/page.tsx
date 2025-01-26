import React from "react";
import prismadb from "@/app/libs/prismadb";
import { ColorForm } from "./components/color-form";

interface ColorPageProps {
  params: {
    storeId: string;
    colorId: string; // Add colorId to params
  };
}

const ColorPage: React.FC<ColorPageProps> = async ({ params }) => {
  // Fetch the color data if colorId is provided
  const color = params.colorId
    ? await prismadb.color.findUnique({
        where: {
          id: params.colorId, // Use colorId to fetch the color
        },
      })
    : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;