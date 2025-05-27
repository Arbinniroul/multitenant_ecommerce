
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import {Sort, Where} from "payload"
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constants";

export const productsRouter=createTRPCRouter({

    getMany:baseProcedure

    .input(z.object({
        cursor:z.number().default(1),
        limit:z.number().default(DEFAULT_LIMIT),
        category:z.string().nullable().optional(),
        minprice:z.string().nullable().optional(),
        maxprice:z.string().nullable().optional(),
        tags:z.array(z.string()).nullable().optional(),
        sort:z.enum(sortValues).nullable().optional().default('curated'),
        tenantSlug:z.string().nullable().optional()
    }))
    
    .query(async({ctx,input})=>{
        const where:Where={}
        let sort:Sort="-createdAt"
        if(input.sort=="trending"){
            sort="name"
        }
           if(input.sort=="hot_and_new"){
            sort="-createdAt"
        }
          if(input.sort=="trending"){
            sort="+createdAt"
        }

        if(input.minprice && input.maxprice){
            where.price={
                greater_than_equal:input.minprice,
                less_than_equal:input.maxprice,
            }
        }
        else if(input.minprice){
            where.price={
                greater_than_equal:input.minprice,
            }
        }
        else if(input.maxprice){
                where.price={
                less_than_equal:input.maxprice,

            }
        }
        if(input.tenantSlug){
            where['tenant.slug']={
                equals:input.tenantSlug
            }
        }

        if(input.category){
            
            const categoriesData=await ctx.db.find({
                collection:'categories',
                limit:1,
                depth:1,
                pagination:false,
                where:{
                    slug:{
                        equals:input.category

                    }
                }
            })
            const formattedData=categoriesData.docs.map((doc)=>
                (  {
                    ...doc,
                    subcategories:(doc.subcategories?.docs??[]).map((doc)=>({
                        ...doc as Category,
                        subcategories:undefined,
                        
                    }))
                    
                }))
                const parentCategory=formattedData[0];
            const subCategoriesSlug=[];
        if(parentCategory){
            subCategoriesSlug.push(...parentCategory.subcategories.map((subcategory)=>subcategory.slug))
             where['category.slug']={
                in:[parentCategory.slug,...subCategoriesSlug]
            }
        }
       
        } 
        if(input.tags && input.tags.length>0){
            where['tags.name']={
                in:input.tags
            }
        }
        const data=await ctx.db.find({
         
                collection:"products",
                depth:2,//Populate "category" , "tenant" , "images" and "tenant.images"
                where,
                sort,
                page:input.cursor,
                limit:input.limit,
               


    })
   

        return {...data,
            docs:data.docs.map((doc)=>({...doc,image:doc.image as Media | null,
                tenant:doc.tenant as Tenant & {image:Media |null;},

            }))
        }
    })


})
