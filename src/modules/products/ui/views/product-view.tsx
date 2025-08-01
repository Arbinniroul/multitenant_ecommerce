"use client";
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenateURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image"
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";


//TODO add real ratings
interface ProductViewProps {
    tenantSlug: string,
    productId: string
}
const CartButton=dynamic(
    ()=>import("../components/cart.button").then((mod)=>mod.CartButton),{ssr:false,loading:()=><Button disabled className="flex-1 bg-pink-400">Add to Cart</Button>}


)


export const ProductView = ({ tenantSlug, productId }: ProductViewProps) => {
    const trpc = useTRPC();
    const[isCopied,setIsCopied]=useState(false);
    const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({ id: productId }))

    console.log(data, 'data')

    return (
        <div className="px-4 lg:px-12 py-10 ">
            <div className="border rounded-sm bg-white overflow-hidden">
                <div className="relative aspect-[3.9] border-b ">
                    <Image src={data?.cover?.url || "/placeholder.png"} alt="cover" fill className="object-cover" />

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-6 ">
                    <div className="col-span-4">
                        <div className="p-6">
                            <h1 className="text-4xl font-medium ">
                                {data?.name}
                            </h1>
                            <div className="border-y flex">
                                <div className="px-6 py-4 flex justify-center border-r">
                                    <div className="relative px-2 py-1 border bg-pink-400 w-fit ">
                                        <p className="text-base font-medium">{formatCurrency(data.price)}</p>

                                    </div>
                                </div>

                                <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                                    <Link href={generateTenateURL(tenantSlug)} className="flex items-center gap-2">
                                        {
                                            data.tenant.image?.url && (
                                                <Image src={data.tenant.image.url}
                                                    alt={data.tenant.name}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full border shrink-0 size-[20px] "

                                                />
                                            )
                                        }
                                        <p className="text-base underline font-medium">{data.tenant.name}</p>
                                    </Link>

                                </div>
                                <div className="hidden lg:flex px-6 py-4 items-center justify-center ">
                                    <div className="flex items-center gap-2">
                                        <StarRating
                                            rating={data.reviewRating}
                                            iconClassName="size-4"
                                        />
                                        <p className="text-base font-medium">{data.reviewCount} ratings</p>

                                    </div>

                                </div>

                            </div>
                            <div className=" block lg:hidden py-6 justify-center border-b" >
                                <div className="flex items-center gap-2">
                                    <StarRating rating={data.reviewRating} iconClassName="size-4" />
                                    <p className="text-base font-medium">{data.reviewCount} ratings</p>

                                </div>


                            </div>
                            <div className="p-6">
                                {
                                    data?.description ? (<RichText data={data.description}/>) :
                                        <p className="font-medium text-muted-foreground italic">
                                            No description provided

                                        </p>
                                }

                            </div>

                        </div>


                    </div>
                    <div className='col-span-2'>
                        <div className="border-t lg:border-t-0 lg:border-l height-full">
                            <div className="flex flex-col gap-4 border-b p-6">
                                <div className="flex flex-row items-center gap-2">
                                    
                         <CartButton productId={productId} isPurchased={data?.isPurchased} tenantSlug={tenantSlug}/>
                                    
                                  
                                    <Button variant={"elevated"}  className="bg-pink-100" onClick={() => {
                                         setIsCopied(true);
                                     navigator.clipboard.writeText(window.location.href); 
                                     setTimeout(()=>setIsCopied(false),1000)
                                        toast.success("URL copied to clipboard")}} disabled={isCopied} >
                                        <LinkIcon />

                                    </Button>


                                </div>
                                <p className="text-center font-medium" > {data?.refundPolicy==="no-refunds"?(<p>No refunds</p>):`${data?.refundPolicy} money back guarentee`}</p>


                            </div>
                            <div className="p-6 ">
                                <div className="flex items-center  justify-between">
                                    <h3 className="text-xl font-medium">Ratings</h3>
                                    <div className="flex items-center gap-x-1 font-medium">
                                        <StarIcon className="size-4 fill-black"/>
                                        <p>({data.reviewRating})</p>
                                        <p className="text-base">{data.reviewCount} ratings</p>

                                    </div>

                                </div>
                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4"
                                >
                                    {
                                        [5,4,3,2,1].map((stars)=>
                                        (<Fragment key={stars}>
                                            <div className="font-medium">
                                                {stars}{stars===1?"star":"stars"}
                                                </div>
                                                <Progress value={data.ratingDistribution[stars]} className="h-[1lh]"/>
                                            <div className="font-medium">
                                                {data.ratingDistribution[stars]}%


                                            </div>

                                           
                                          
                                            


                                        </Fragment>

                                         ))
                                    }


                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}
export const ProductViewSkeleton=()=>{
    return(
          <div className="px-4 lg:px-12 py-10 ">
            <div className="border rounded-sm bg-white overflow-hidden">
                <div className="relative aspect-[3.9] border-b ">
                    <Image src={"/placeholder.png"} alt="cover" fill className="object-cover" />

                </div>
                </div>
                </div>
    )
}


