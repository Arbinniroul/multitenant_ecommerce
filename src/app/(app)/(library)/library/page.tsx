import { DEFAULT_LIMIT } from "@/constants"
import LibraryViews from "@/modules/library/ui/views/library-views"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"


const Page = async() => {
    const queryClient=getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.library.getMany.infiniteQueryOptions({limit:DEFAULT_LIMIT}))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <LibraryViews/>
    </HydrationBoundary>
  )
}

export default Page