
import {  getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import React from 'react'
import { loadProductFilter } from '@/modules/products/search-params';

import ProductListView from '@/modules/products/ui/views/product-list-view';
import { DEFAULT_LIMIT } from '@/constants';

interface Props{

    searchParams:Promise<{
      minPrice?:string|undefined,
      maxPrice?:string | undefined
    }>

}
const Page = async({searchParams}:Props) => {


       const filters=await loadProductFilter(searchParams);

    const queryClient=getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({

      ...filters,
      limit:DEFAULT_LIMIT,

    }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    
     <ProductListView  />
    </HydrationBoundary>
  )
}


export default Page