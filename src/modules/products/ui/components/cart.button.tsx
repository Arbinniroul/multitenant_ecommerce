import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UseCart } from "@/modules/checkout/hooks/use-cart"
import Link from "next/link"

interface Props{
    tenantSlug:string
    productId:string
    isPurchased?:boolean,
}


export const CartButton = ({tenantSlug,productId,isPurchased}:Props) => {
  if(isPurchased){
    return(
    <Button variant={"elevated"} asChild className="flex-1 font-medium bg-pink-400"><Link prefetch href={`/library/${productId}`}>View in Library</Link></Button>)
  }
    const cart=UseCart(tenantSlug)
  return (
          <Button variant={"elevated"} className={cn( "flex-1 bg-pink-500" ,cart.isProductInCart(productId) && "bg-white" ) }  onClick={()=>cart.toggleProduct(productId)}>
                                      {
                                        cart.isProductInCart(productId)?"Remove from Cart":"Add to Cart"
                                      }

                                    </Button>
  )
}

