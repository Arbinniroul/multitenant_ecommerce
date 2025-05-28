import { UseCart } from "../../hooks/use-cart"
import { cn, generateTenateURL } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

interface CheckOutbuttonProps{
    className?:string
    hideIfEmpty?:boolean
    tenantSlug:string
}

export const CheckOutbutton=({
    className,
    hideIfEmpty,
    tenantSlug
}:CheckOutbuttonProps)=>{

const {totalItems}=UseCart(tenantSlug);
if(hideIfEmpty && totalItems==0) return null


return(
    <Button variant={"elevated"} asChild className={cn("bg-white ",className)}>
        <Link href={`${generateTenateURL(tenantSlug)}/checkout`}>
        <ShoppingCartIcon/> {totalItems>0? totalItems:""}
        </Link>



    </Button>
)



}