import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";

import { CollectionConfig } from "payload";


export const Products:CollectionConfig={
    admin: {
  useAsTitle: 'name' ,
  description:"You must verify your account before creating products"
},
    slug:"products",
    access:{
        read:()=>true,
        create:({req})=>{
            if(isSuperAdmin(req.user)) return true;
            const tenant=req?.user?.tenants?.[0]?.tenant as Tenant
            return Boolean(tenant?.stripeDetailsSubmitted)
        }
    },
    fields:[
        {
            name:"name",
            type:'text',
            required:true, 
        },
        {
            name:"description",
            type:'richText',


        },
        {
            name:'price',
            type:'number',
            required:true,
            admin:{
                description:'in USD'
            }
        },
        {
            name:'category',
            type:'relationship',
            relationTo:'categories',
            hasMany:false
        },
           {
            name:'tags',
            type:'relationship',
            relationTo:'tags',
            hasMany:true
        },
        {
            name:'image',
            type:'upload',
            relationTo:"media"
        },
        {
            name:'refundPolicy',
            type:'select',
            options:["30-day","14-day","7-day","3-day","1-day","no-refunds"],
            defaultValue:'30-day'
        },
        {
            name:'content',
            type:'richText',
            admin:{
                description:"Protected content only visible to customers after purchase. Add product documentation ,downloadabe files ,getting started guides and bonus materials.Supports markdown formatting"
            }
        },
             {
            name:"isArchived",
            label:"Archive",
            type:"checkbox",
             admin:{
                description:"If checked this product will be archived"
             }
        },

             {
            name:"isPrivate",
            label:"Private",
            type:"checkbox",
             admin:{
                description:"If checked this product will not be shown on the public storefront"
             }
        }

    ]
}