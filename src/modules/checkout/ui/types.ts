import Stripe from "stripe"

export type ProductMetadata={
    stripeAccountId:string,
    id:string,
    name:string,
    price:number
}

export type CheckoutMetaData={
    userId:string
}

export type ExpandedLineItem=Stripe.LineItem &{
    price:Stripe.Price&{
        product:Stripe.Product&{
            metaData:ProductMetadata,
        }

    }
}