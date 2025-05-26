"use client";
import React from 'react'
import SearchInput from './search-input'
import Categories from './categories'

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { DEFAULT_BG_COLOR } from '@/modules/home/constants';
import BreadCrumbNavigation from './breadcrumbs-navigation';


const SearchFilters = () => {
  const trpc=useTRPC();
  const {data}=useSuspenseQuery(trpc.categories.getMany.queryOptions())
  const params=useParams();
   const categoryParam = params?.category as string | undefined;
  const activeCategory = categoryParam?.toLowerCase() || "all";
  

  const activeCategoryData = data.find(
    (cat) => cat.slug.toLowerCase() === activeCategory
  );

  const  activeCategoryColor=activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName=activeCategoryData?.name || null
  const activeSubCategory=params.subcategory as string | undefined;
  const activeSubCategoryName=activeCategoryData?.subcategories?.find((subcategory)=>subcategory.slug===activeSubCategory)?.name || null;
  



  return (
    <div className='px-4 lg:px-12 py-8 border-b  flex flex-col  gap-2 w-full' style={{backgroundColor:activeCategoryColor}}>
        <SearchInput />
        <div className='hidden lg:block'>
        <Categories data={data} />
       
        </div>
     <BreadCrumbNavigation activeCategoryName={activeCategoryName} activeCategory={activeCategory}  activeSubcategoryName={activeSubCategoryName}/>
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