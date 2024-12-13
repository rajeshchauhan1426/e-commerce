import React from 'react'
import prismadb from "@/app/libs/prismadb"

const BillboardPage = async({
params 
}: {
    params: {billboardId: string}
}) => {
    const billboard = await prismadb.billboard.findUnique({
        where:{
            id:params.billboardId
        }
    })
  return (
    <div className='flex-col'>
    <div className='flex-1 space-y-4 p-8 pt-6'>


        </div>
        </div>
  )
}

export default BillboardPage