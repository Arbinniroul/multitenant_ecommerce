"use client"

interface ProductFilters{
    title:string,
    classname?:string,
    children:React.ReactNode
}
import { cn } from '@/lib/utils';
import {  ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react'
import { PriceFilter } from './priceFilter';
import { useProductFilter } from '../../hooks/user-productfilter';
import TagsFilter from './tagsFilter';


const ProductFilter = ({title,classname,children}:ProductFilters) => {

   const[isOpen,setIsOpen]=useState(false);
    const Icon=isOpen?ChevronDownIcon:ChevronRightIcon
    return(
        <div className={cn("p-4 border-b flex flex-col gap-2",classname)}>
          <div onClick={()=>setIsOpen((current)=>!current)} className='flex items-center justify-between cursor-pointer'>
            <p className='font-medium'>{title}</p>
            <Icon className='size-5 '/>

          </div>
          {isOpen && children}
        </div>
    )
}
export const ProductFilters = () => {

const [filters,setFilters]=useProductFilter();
   const handleClear = () => {
    setFilters({
      minprice: '',
      maxprice: '',
      tags: null,
    });
    
  }

const hasAnyFilters=Object.entries(filters).some(([key,value])=>{
  if(key=="sort") return false;
  if(Array.isArray(value)) {
    return value.length > 0;
  }
  if( typeof value === "string" ) {
    return value!== "";
  }

  return value!==null
});
const onChange=(key:keyof typeof filters,value:unknown)=>{
  setFilters({...filters,[key]:value})
}

  return (
    <div className='border rounded-md bg-white '>
        <div className='p-4 border-b flex items-center justify-between'>
            <p className='font-medium'>Filters</p>
            {
                hasAnyFilters && (
                    <button onClick={handleClear} className='text-sm  cursor-pointer underline'>Clear</button>
                )
            }

        </div>
        <ProductFilter title='Price' >
            <PriceFilter minPrice={filters.minprice} maxPrice={filters.maxprice} onMinPriceChange={(value)=>onChange("minprice",value)} onMaxPriceChange={(value)=>onChange("maxprice",value)}/>

        </ProductFilter>
          <ProductFilter title='Tags' classname='border-b-0'>
             <TagsFilter onChange={(value)=>onChange("tags",value)} value={filters.tags} />

            </ProductFilter>
    </div>
  )
}

