"use client"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query";
import { UseCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import { generateTenateURL } from "@/lib/utils";
import CheckoutItem from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface CheckoutViewProps{
    tenantSlug:string
}
export const CheckOutView=({tenantSlug}:CheckoutViewProps)=>{
    const router=useRouter()
    const [states,setStates]=useCheckoutStates();
    const {productIds,removeProduct,clearCart}=UseCart(tenantSlug)
    const trpc=useTRPC();
    const {data,error,isLoading}=useQuery(trpc.checkout.getProducts.queryOptions({
        ids:productIds,
    }))
const purchase=useMutation(trpc.checkout.purchase.mutationOptions({
    onMutate:()=>{
        setStates({success:false,cancel:false})
    },
    onSuccess:(data)=>{
        window.location.href=data?.url;
    },
    onError:(error)=>{if(error.data?.code==="UNAUTHORIZED"){
        //TODO:Modify when subdomain enabled
        router.push("/sign-in")
        toast.error(error.message)
    }}
}))
useEffect(()=>{

    if(states.success){
        setStates({success:false,cancel:false})
        clearCart()
        router.push("/products")
    }
},[states.success,clearCart,router,setStates])
    useEffect(()=>{
        if(!error) return;
        if(error?.data?.code=="NOT_FOUND"){
       clearCart()
       toast.warning("Invalid Products found.Cart Cleared")

        }
    },[error,clearCart])
    if(isLoading){
        return (
           <div className="border border-black border-dashed  p-4 flex items-center justify-center w-full bg-white  rounded-lg flex-col gap-y-4 ">
                    <LoaderIcon className="text-muted-foreground animate-spin" />
                    <p className="text-base font-medium">No product found</p>
                </div>
  
        )
    }
   if(!data || data.docs.length===0) return(
      <div className="border border-black border-dashed  p-4 flex items-center justify-center w-full bg-white  rounded-lg flex-col gap-y-4 ">
                    <InboxIcon />
                    <p className="text-base font-medium">No product found</p>
                </div>

   )



  return(
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
            <div className="lg:col-span-4 ">
                <div className="border rounded-md overflow-hidden  bg-white">
                    {data?.docs.map((product,index)=>(
                        <CheckoutItem key={product.id}  name={product.name} isLast={index===data.docs.length-1} imageURL={product.image?.url || ""} productURL={`${generateTenateURL(product.tenant.slug)}/products/${productIds}`} tenantURL={generateTenateURL(product.tenant.slug)} tenantName={product?.tenant?.name} price={product.price} onRemove={()=>{removeProduct(product.id)}}/>
                    ))}

                </div>

            </div>
            <div className="lg:col-span-3">
            <CheckoutSidebar
            total={data?.totalPrice}
            onPurchase={()=>{purchase.mutate({tenantSlugs:tenantSlug,productIds})}}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
            />
            </div>

        </div>
      

    </div>
  )
} 