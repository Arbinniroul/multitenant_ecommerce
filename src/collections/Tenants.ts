import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name:"name",
      required:true,    
      type:"text",
      label:"store name",
      admin:{
        description:"This is the name of your store",
      }
    },
    {
        name:"slug",
        type:"text",
        index:true,
        unique:true,
        required:true,
        admin:{
          description:"This is the subdomain of your store, it will be used to access your store. For example if you enter 'my-store' then your store will be accessible at my-store.funroad.com",
    },
},
{
    name:'image',
    type:'upload',
    relationTo:'media',

},
{
    name:'stripeAccountId',
    type:'text',
    required:true,
    admin:{
        readOnly:true,
    }
},
{
    name:"stripeDetailsSubmitted",
    type:"checkbox",
    admin:{
        readOnly:true,
        description:"This is true if the tenant has submitted their stripe details, this is used to determine if the tenant can receive payments or not."
    }
}
  ],
}
