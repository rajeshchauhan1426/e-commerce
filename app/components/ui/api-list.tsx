import { useParams } from 'next/navigation';
import React from 'react'
import { useOrigin } from '../hooks/use-origin';
import { ApiAlert } from './ api-alert';

interface ApiListProps{
    entityName: string
    entityIdName: string;
}

 export const  ApiList: React.FC<ApiListProps> =({
    entityName,
    entityIdName,
 }) => {

    const { storeId, billboardId } = useParams<{ storeId: string; billboardId: string }>() || {};
    const params = useParams();
    const origin = useOrigin();
    const baseURl = `${origin}/api/${storeId}`
  return (
    <>
    <ApiAlert
    title='GET'
    variant='public'
    description={`${baseURl}/${entityName}`}/>
    <ApiAlert
    title='GET'
    variant='public'
    description={`${baseURl}/${entityName}/{${entityName}}`}/>
    <ApiAlert
    title='POST'
    variant='admin'
    description={`${baseURl}/${entityName}`}/>
    <ApiAlert
    title='PATCH'
    variant='admin'
    description={`${baseURl}/${entityName}/{${entityIdName}}`}/>
    <ApiAlert
    title='DELETE'
    variant='admin'
    description={`${baseURl}/${entityName}/{${entityIdName}}`}/>
    </>
  )
}

