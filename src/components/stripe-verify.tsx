import { Button } from "@payloadcms/ui";
import Link from "next/link";

export const StripeVerify=()=>{
    return(
        <Link href={"/stripe-verify"}>
            <Button>
                Verify account
            </Button>
        </Link>
    )
}
