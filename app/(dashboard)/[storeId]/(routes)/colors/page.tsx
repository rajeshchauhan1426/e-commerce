// import { ColorsClient } from "./components/client"
// import prismadb from "@/app/libs/prismadb"
// import {ColorColumn} from "./components/columns";
// import {format} from "date-fns"


//  const ColorsPage = async({
//     params
// }:{
//     params:{storeId:string}
// }) =>{
//     const colors = await prismadb.color.findMany({
//         where:{
//             storeId: params.storeId
//         },
//         orderBy: {
//             createdAt: 'desc'
//         }
//     });


//      const formattedColors: ColorColumn[]= colors.map((item) => ({
//         id:item.id,
//         name: item.name,
//         value: item.value,
//         createdAt: format(item.createdAt, "MMM do, yyyy")

//      }))

//     return(
//         <div className="flex-col">
//             <div className="flex-1  space-y-4 p-8 pt-6">

//                 <ColorsClient data={formattedColors}/>
//             </div>

//         </div>
//     )
// }

// export default ColorsPage;


import prismadb from "@/app/libs/prismadb"

import {format} from "date-fns"
import { ColorColumn } from "./components/columns";
import { ColorsClient } from "./components/client";



 const ColourPage = async({
    params
}:{
    params:{storeId:string}
}) =>{
    const colors = await prismadb.color.findMany({
        where:{
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });


     const formattedColours: ColorColumn[]= colors.map((item) => ({
        id:item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMM do, yyyy")

     }))

    return(
        <div className="flex-col">
            <div className="flex-1  space-y-4 p-8 pt-6">

                <ColorsClient data={formattedColours}/>
            </div>

        </div>
    )
}

export default ColourPage;