"use client";
import React from 'react'
import SearchInput from './search-input'
import Categories from './categories'

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';


const SearchFilters = () => {
  const trpc=useTRPC();
  const {data}=useSuspenseQuery(trpc.categories.getMany.queryOptions())
  return (
    <div className='px-4 lg:px-12 py-8 border-b  flex flex-col  gap-2 w-full' style={{backgroundColor:"#f5f5f5"}}>
        <SearchInput />
        <div className='hidden lg:block'>
        <Categories data={data} />
       
        </div>
    
    </div>
  )
}


export const SearchFilterSkeleton=()=>{
  return(
    <div className='px-4 lg:px-12 py-8 border-b  flex flex-col  gap-2 w-full' style={{backgroundColor:'#f5f5f5'}}>
    <SearchInput disabled />
    <div className='hidden lg:block'>
    <div className='h-11'/>
   
    </div>

</div>
  )
}

export default SearchFilters