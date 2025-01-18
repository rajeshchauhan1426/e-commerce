"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/app/components/ui/data-table";
import { ApiList } from "@/app/components/ui/api-list";


interface CategoryClientProps{
  data: CategoryColumn[]
}

export const  CategoryClient: React.FC<CategoryClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();

  // Safeguard against null or undefined params
  const storeId = params?.storeId;

  if (!storeId) {
    return (
      <div>
        <Heading
          title="Error"
          description="Store ID not found. Please check the URL."
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories(${data.length})`}
          description="Manage Categories for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable  searchKey="name" columns={columns} data={data}/>
      <Heading title="API" description="API calls for Categories" />
      <Separator/>
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
 