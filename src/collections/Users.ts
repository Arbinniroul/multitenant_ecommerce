import { isSuperAdmin } from '@/lib/access'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import type { CollectionConfig } from 'payload'


const defaultTenantArrayField=tenantsArrayField({
  tenantsArrayFieldName:"tenants",
  tenantsCollectionSlug:"tenants",
  tenantsArrayTenantFieldName:"tenant",
  arrayFieldAccess:
{
  read:()=>true,
  create:({req})=>isSuperAdmin(req.user),
  update:({req})=>isSuperAdmin(req.user),
  

},
 tenantFieldAccess:
{
  read:()=>true,
  create:({req})=>isSuperAdmin(req.user),
  update:({req})=>isSuperAdmin(req.user),

}
})
export const Users: CollectionConfig = {
  slug: 'users',
   access:
{
  read:()=>true,
  create:({req})=>isSuperAdmin(req.user),
  delete:({req})=>isSuperAdmin(req.user),
  update:({req,id})=>{
    if(isSuperAdmin(req.user)) return true
    return req.user?.id===id

  },

},
  admin: {
    useAsTitle: 'email',
    hidden:({user})=>!isSuperAdmin(user)
  },
  auth: true,
  fields: [
    
    {
      name:"username",
      required:true,    
      unique:true,
      type:"text"
    },
    {
      admin:{
        position:"sidebar",
      },
      name:'roles',
      type: 'select',
      hasMany: true,
      options: [
        "super-admin",
        "user",
        "admin"
      ],
      access:{
        update:({req})=>isSuperAdmin(req.user)
      }
    },
    {
      ...defaultTenantArrayField,
      admin:{
        ...(defaultTenantArrayField?.admin || {}),
        position:"sidebar",
      }
    }
  ],
}
