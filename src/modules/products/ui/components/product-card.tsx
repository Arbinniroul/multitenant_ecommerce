"use client"
import { formatCurrency, generateTenateURL } from "@/lib/utils"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProductCardProps{
    id:string,
    name:string,
    imageUrl?:string | null,
    tenantSlug:string,
    tenantImageUrl?:string | null,
    reviewRating:number,
    reviewCount:number,
    price:number,
}



export const ProductCard= ({id,name,imageUrl,tenantSlug,tenantImageUrl,reviewRating,reviewCount,price}:ProductCardProps) => {
    const router=useRouter();

    const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(generateTenateURL(tenantSlug));
    }
  return (

        <Link href={`${generateTenateURL(tenantSlug)}/products/${id}`}>
        <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow  duration-200 ease-in-out">
            <div className="relative aspect-square">
                <Image alt={name} fill className="object-cover" src={imageUrl || '/placeholder.png'}/>

            </div>
            <div className="p-4 border-y flex flex-col gap-3 flex-1">
                {/* TODO: REDIRECT TO USERSHOP */}
                <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
                <div className="flex items-center gap-x-2" onClick={handleUserClick}>
                    {
                        tenantImageUrl && (
                            <Image
                                src={tenantImageUrl}
                                alt={tenantSlug}
                                width={16}
                                height={16}

                                className="rounded-full border shrink-0 size-[16px]"
                            />
                        )
                    }
                    <p className="text-sm underline font-medium">{tenantSlug}</p>

                </div>
                {
                    reviewCount >0 && (
                        <div className="flex items-center gap-1">
                            <StarIcon className=" size-3.5 fill-black"/>
                            <p className="text-sm font-medium">{reviewRating}({reviewCount})</p>

                        </div>
                    )
                }

            </div>
            <div className="p-4 ">
                <div className="relative px-2 py-1 border bg-pink-400 w-fit ">
                    <p className="text-sm font-medium">
                        {
                          formatCurrency(price)
                            
                        }
                    </p>

                </div>

            </div>

        </div>

        </Link>

  )
}

export const ProductCardSkeleton = () => {
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse">

    </div>
    
}


