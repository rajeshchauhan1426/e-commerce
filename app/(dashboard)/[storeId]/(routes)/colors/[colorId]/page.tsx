import React from 'react'
import prismadb from "@/app/libs/prismadb"
import { ColorForm } from './components/color-form'



const ColorPage = async({
params 
}: {
    params: {storeId: string}
}) => {
    
    const color = await prismadb.color.findUnique({
        where:{
            id:params.storeId
        }
    })
  return (
    <div className='flex-col'>
    <div className='flex-1 space-y-4 p-8 pt-6'>

         <ColorForm
         initialData={color}
         />
        </div>
        </div>
  )
}

export default ColorPage;