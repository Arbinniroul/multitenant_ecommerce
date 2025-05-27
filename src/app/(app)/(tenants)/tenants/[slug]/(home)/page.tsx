import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilter } from "@/modules/products/search-params";
import ProductListView from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";

interface PageProps{
    searchParams:Promise< SearchParams>;
    params:Promise<{slug:string}>;




}


const Page=async({searchParams,params}:PageProps)=>{
    const {slug}=await params;
    const filters=await loadProductFilter(searchParams);
    const queryClient=getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        tenantSlug:slug,
        limit:DEFAULT_LIMIT
    }))
    return(
        <div>
         <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView tenantSlug={slug} narrowView/>

         </HydrationBoundary>
        </div>

    )
}

export default Page;