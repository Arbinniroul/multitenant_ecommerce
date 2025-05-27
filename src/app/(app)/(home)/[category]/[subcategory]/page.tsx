
import { DEFAULT_LIMIT } from '@/constants';
import { loadProductFilter } from '@/modules/products/search-params';
import ProductListView from '@/modules/products/ui/views/product-list-view';
import {  getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import React   from 'react'
interface Props{
    params:Promise<{
    subcategory:string

    }>,
      searchParams:Promise<{
      minPrice?:string|undefined,
      maxPrice?:string | undefined
    }>

}
const Page = async({params,searchParams}:Props) => {

     const {subcategory}=await params;
       const filters=await loadProductFilter(searchParams);

    const queryClient=getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions ({
      category:subcategory,
      ...filters,
      limit:DEFAULT_LIMIT,

    }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    
     <ProductListView category={subcategory} />
    </HydrationBoundary>
  )
}

export default Page