"use client"
import { useTRPC } from "@/trpc/client";
import {  useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useProductFilter } from "../../hooks/user-productfilter";
import {ProductCard} from "./product-card";
import { DEFAULT_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
 

interface Props{
    category?:string
}
export const ProductList=({category}:Props)=>{
    const [filters]=useProductFilter();
    const trpc=useTRPC();
    const {data,hasNextPage,isFetchingNextPage,fetchNextPage}=useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category,
    ...filters,
        limit:DEFAULT_LIMIT,

    },{
        getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        }
    }));

    if(data.pages?.[0]?.docs.length === 0){
        return (
            <div className="border border-black border-dashed  p-4 flex items-center justify-center w-full bg-white  rounded-lg flex-col gap-y-4 ">
                <InboxIcon />
                <p className="text-base font-medium">No product found</p>
            </div>
        )
    }

    return(
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {
                data?.pages.flatMap((page)=>page.docs).map((product)=>(
                  <ProductCard id={product.id} key={product.id} name={product.name} imageUrl={product.image} authorUsername={"hello"}  reviewRating={3} reviewCount={5} price={product.price} />
                ))
            }
        </div>
        {
            hasNextPage && (
                <div className="flex items-center justify-center p-4">
                    <Button
                        variant={"elevated"}
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-4 py-2  text-white rounded-md  transition-colors"
                    >
                        Load More
                    </Button>
                </div>
            )
        }
        </>
    )
}
export const ProductListSkeleton=()=>{
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className=" rounded-md bg-white overflow-hidden h-full animate-pulse">
                    <div className="relative aspect-square bg-gray-200"></div>
                    <div className="p-4  flex flex-col gap-3 flex-1">
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="p-4">
                        <div className="h-6 w-10 bg-gray-300  rounded"></div>
                    </div>
                </div>
            ))}
</div>
    )
}