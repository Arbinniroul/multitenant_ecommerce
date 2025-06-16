
import { ProductViews } from "@/modules/library/ui/views/product-views"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

 interface Props{
  params:Promise<{
    productId:string
  }>
 }
const Page = async({params}:Props) => {
  const {productId}=await params;

    const queryClient=getQueryClient()
    void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({
      productId
    }))
          void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({
      productId:productId
    }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductViews productId={productId}/>
    </HydrationBoundary>
  )
}

export default Page