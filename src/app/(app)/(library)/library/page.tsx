
import { DEFAULT_LIMIT } from "@/constants"
import LibraryViews from "@/modules/library/ui/views/library-views"

import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

export const dynamic = 'force-dynamic';
const Page = () => {


    const queryClient=getQueryClient()
    void queryClient.prefetchQuery(trpc.library.getMany.queryOptions({
      limit:DEFAULT_LIMIT
    }))
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <LibraryViews/>
    </HydrationBoundary>
  )
}

export default Page