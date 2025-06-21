
import { ProductViews, ProductViewSkeleton } from "@/modules/library/ui/views/product-views"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

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
      <Suspense fallback={<ProductViewSkeleton/>}>
        <ProductViews productId={productId}/>

      </Suspense>
    </HydrationBoundary>
  )
}

export default Page