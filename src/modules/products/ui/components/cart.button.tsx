import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UseCart } from "@/modules/checkout/hooks/use-cart"

interface Props{
    tenantSlug:string
    productId:string
}


export const CartButton = ({tenantSlug,productId}:Props) => {
    const cart=UseCart(tenantSlug)
  return (
          <Button variant={"elevated"} className={cn( "flex-1 bg-pink-500" ,cart.isProductInCart(productId) && "bg-white" ) }  onClick={()=>cart.toggleProduct(productId)}>
                                      {
                                        cart.isProductInCart(productId)?"Remove from Cart":"Add to Cart"
                                      }

                                    </Button>
  )
}

