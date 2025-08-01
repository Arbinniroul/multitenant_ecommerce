import { Checkbox } from '@/components/ui/checkbox';
import { DEFAULT_LIMIT } from '@/constants';
import { useTRPC } from '@/trpc/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';
import React from 'react'

interface TagsFilterProps{
    value?:string[] | null;
    onChange:(value:string[])=>void;

}
const TagsFilter = ({value,onChange}:TagsFilterProps) => {
    const trpc=useTRPC();
    const onClick=(tag:string)=>{
        if(value?.includes(tag)){
            onChange(value.filter((t)=>t!==tag)||[]);

    }
    else{
        onChange([...value || [], tag]);
    }
}
    const {data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage}=useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT,

    },{
        getNextPageParam: (lastPage) => {
            return lastPage.docs.length>0 ?lastPage.nextPage: undefined;
        }
      
    }))
  return (
    <div className='flex flex-col gap-y-2'>
        {
            isLoading ? (
                <div className='flex items-center justify-center p-4'>
                    <LoaderIcon className='size-4 animate-spin'/>

                </div>
            ):(
                data?.pages.map((page)=>
                page.docs.map((tag)=>(
                    <div key={tag.id} className='flex items-center justify-between  cursor-pointer hover:bg-gray-100 p-2 rounded-md' onClick={()=> onClick(tag.name)}>
                        <p className='font-medium'>{tag.name}</p>
                        <Checkbox checked={value?.includes(tag.name)} onCheckedChange={()=>onClick(tag.name)}  onChange={()=>{}}/>

                    </div>
                )))
            )
        }
        {
            hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className='font-medium underline flex justify-start text-start disabled:opacity-50'
                >
                    {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                </button>
            )
        }


    </div>
  )
}

export default TagsFilter