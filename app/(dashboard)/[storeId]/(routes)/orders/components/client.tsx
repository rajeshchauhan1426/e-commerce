"use client";


import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";



import { DataTable } from "@/app/components/ui/data-table";


import { OrderColumn, columns } from "./columns";


interface OrderClientProps{
  data: OrderColumn[]
}

export const OrdersClient: React.FC<OrderClientProps> = ({
  data
}) => {


  return (
    <>
     
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />
      
      <Separator />
      <DataTable  searchKey="products" columns={columns} data={data}/>
  
  </>
  );
};
 