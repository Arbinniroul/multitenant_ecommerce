// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {Categories}  from './collections/Categories'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Tags } from './collections/Tags'
import { Tenants } from './collections/Tenants'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Orders } from './collections/Orders'
import { Reviews } from './collections/Reviews'
import { isSuperAdmin } from './lib/access'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components:{
      beforeNavLinks:['./components/stripe-verify#StripeVerify']
    }
  },
  collections: [Users,Media,Categories,Products,Tags,Tenants,Orders,Reviews],

  cookiePrefix:"funroad",
  editor: lexicalEditor({
                  features:({defaultFeatures})=>[
                      ...defaultFeatures,
                      UploadFeature({
                          collections:{
                              media:{
                                  fields:[
                                      {
                                          name:"name",
                                          type:"text"
                                      }
                                  ]
                              }
                          }
                      })
  
                  ]
              }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      collections:{
        products:{
          
        },
      },
      tenantsArrayField:{
        includeDefaultField:false
      },
      userHasAccessToAllTenants:(user)=>isSuperAdmin(user),

    }),
    vercelBlobStorage({
      enabled:true,
      collections:{
        media:true,
       


      },
      token:process.env.BLOB_READ_WRITE_TOKEN
    })
    
  ],
})
