import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";


export const Orders:CollectionConfig={
    slug:'orders',
    access:{
              read:({req})=>isSuperAdmin(req.user),
              create:({req})=>isSuperAdmin(req.user),
              update:({req})=>isSuperAdmin(req.user),
              delete:({req})=>isSuperAdmin(req.user),

    },
    admin:{
        useAsTitle:"name",
    },
    fields:[
        {
            name:"name",
            type:"text",
            required:true,
        },
        {
            name:"user",
            type:"relationship",
            relationTo:"users",
            required:true,
            hasMany:false
        },
        {
            name:"products",
            type:"relationship",
            relationTo:"products",
            required:true,
            hasMany:false
        },
    { name:"stripeCheckoutSessionId",
        type:"text",
        required:true,
        admin:{
            description:"Stripe checkout session associated with this order"
        }

    }  ,
    {
        name:"stripeAccountId",
        type:'text',
        admin:{
            description:"Stripe account associated with the others"
        }

    }
  ]
}