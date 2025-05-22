"use client"
interface Props{
    disabled?:boolean
    data?:CustomCategory[];
}
import { Input } from '@/components/ui/input'
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'
import { CustomCategory } from '../types'
import { CategoriesSidebar } from './categories-sidebar';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const SearchInput = ({disabled}:Props) => {
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  const trpc=useTRPC();
  const session=useQuery(trpc.auth.session.queryOptions());
  return (
    <div className='items-center gap-2 w-ful flex '>
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
       <div className='relative w-full'>
        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500'/>
        <Input className='pl-8 '    placeholder='Search Products' disabled={disabled}/>
       

      
       </div>
       <Button variant={'elevated'} className='size-12 shrink-0 lg:hidden' onClick={()=>setIsSidebarOpen(true)}>
        <ListFilterIcon/>


       </Button>
      
       {session.data?.user &&(
        <Button variant={"elevated"} asChild>
          <Link href={"/library"}>
          <BookmarkCheckIcon />
          Library
          </Link>
        </Button>
       ) }
    </div>
  )
}

export default SearchInput