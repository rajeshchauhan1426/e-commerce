
import prismadb from "@/app/libs/prismadb"
import {ColourColumn } from "./components/columns";
import {format} from "date-fns"
import { ColoursClient } from "./components/client";


 const ColourPage = async({
    params
}:{
    params:{storeId:string}
}) =>{
    const colours = await prismadb.colour.findMany({
        where:{
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });


     const formattedColours: ColourColumn[]= colours.map((item) => ({
        id:item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMM do, yyyy")

     }))

    return(
        <div className="flex-col">
            <div className="flex-1  space-y-4 p-8 pt-6">

                <ColoursClient data={formattedColours}/>
            </div>

        </div>
    )
}

export default ColourPage;