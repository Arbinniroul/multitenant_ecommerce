import { CheckOutView } from "@/modules/checkout/ui/views/checkout-view"

interface PageProps{
    params:Promise <{slug:string}>
}
const Page = async({params}:PageProps) => {
    const {slug}=await params
  return <CheckOutView tenantSlug={slug}/>
}

export default Page