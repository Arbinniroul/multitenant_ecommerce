import { isSuperAdmin } from '@/lib/access';
import type { CollectionConfig } from 'payload';

export const Tags:CollectionConfig={
    slug:'tags',
    access:
     {
          read:()=>true,
          create:({req})=>isSuperAdmin(req.user),
          update:({req})=>isSuperAdmin(req.user),
          delete:({req})=>isSuperAdmin(req.user),
          
        
        },
    admin:{
        useAsTitle:'name',
     hidden:({user})=>!isSuperAdmin(user)

    },
    fields:[
        {
            name:'name',
            type:'text',
            unique:true,
            required:true,
        },
        {
            name:'products',
            type:'relationship',
            relationTo:'products',
            hasMany:true,
        }

    ],

}