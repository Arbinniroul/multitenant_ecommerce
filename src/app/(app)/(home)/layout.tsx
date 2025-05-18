
import React, { Suspense } from 'react'
import { Navbar } from './navbar';
import Footer from './footer';
import SearchFilters, { SearchFilterSkeleton } from './search-filters';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
 interface layoutProps{
    children:React.ReactNode;
 }
const Layout =async ({children}:layoutProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions()
  );
  
  return (
    <div className='flex flex-col min-h-screen '>
        <Navbar/>
        <HydrationBoundary state={dehydrate(queryClient)}>
         <Suspense fallback={<SearchFilterSkeleton/>}>

        <SearchFilters /> 
        <div className='flex-1 bg-[#f4f4f0]'>
        {children}

        </div>
        <Footer/>
         </Suspense>
        </HydrationBoundary>
        </div>
  )
}

export default Layout