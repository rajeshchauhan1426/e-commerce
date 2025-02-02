import React from 'react'
import prismadb from "@/app/libs/prismadb"
import { BillboardForm } from './components/product-form'



const ProductPage = async({
params 
}: {
    params: {productId: string}
}) => {
    
    const product = await prismadb.product.findUnique({
        where:{
            id:params.productId
        },
        include: {
            images: true
        }
    })
  return (
    <div className='flex-col'>
    <div className='flex-1 space-y-4 p-8 pt-6'>

         <BillboardForm
         initialData={product}
         />
        </div>
        </div>
  )
}

export default ProductPage