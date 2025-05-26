

import { ProductFilters } from '@/modules/products/ui/components/productFilter';
import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/products-lists';
import {  getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import React from 'react'
import { loadProductFilter } from '@/modules/products/search-params';

import ProductListView from '@/modules/products/ui/views/product-list-view';

interface Props{
    params:Promise<{
    category:string

    }>,
    searchParams:Promise<{
      minPrice?:string|undefined,
      maxPrice?:string | undefined
    }>

}
const Page = async({params,searchParams}:Props) => {

     const {category}=await params;
       const filters=await loadProductFilter(searchParams);

    const queryClient=getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
      category,
      ...filters

    }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    
     <ProductListView category={category} />
    </HydrationBoundary>
  )
}


export default Page