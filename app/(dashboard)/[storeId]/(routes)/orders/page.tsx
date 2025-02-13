import prismadb from "@/app/libs/prismadb";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { OrdersClient } from "./components/client";

interface OrderColumn {
    id: string;
    phone: string;
    address: string;
    isPaid: string;  // Keep as string
    products: string;
    totalPrice: string;
    createdAt: string;
  }
  
  const OrdersPage = async ({
    params,
  }: {
    params: { storeId: string };
  }) => {
    const orders = await prismadb.order.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    const formattedOrders: OrderColumn[] = orders.map((item) => ({
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
      totalPrice: formatter.format(
        item.orderItems.reduce((total, orderItem) => total + Number(orderItem.product.price), 0)
      ),
      isPaid: item.isPaid ? "Yes" : "No",  // Convert boolean to string "Yes"/"No"
      createdAt: format(item.createdAt, "MMM do, yyyy"),
    }));
  
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <OrdersClient data={formattedOrders} />
        </div>
      </div>
    );
  };
  
  export default OrdersPage;
  