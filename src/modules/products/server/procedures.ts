
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import {Where} from "payload"
import { Category } from "@/payload-types";
export const productsRouter=createTRPCRouter({
    
    getMany:baseProcedure
    .input(z.object({
        category:z.string().nullable().optional(),
        minprice:z.string().nullable().optional(),
        maxprice:z.string().nullable().optional(),
    }))
    .query(async({ctx,input})=>{
        const where:Where={}
        if(input.minprice){
            where.price={
                greater_than_equal:input.minprice
            }
        }
          if(input.maxprice){
            where.price={
                less_than_equal:input.maxprice
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

        const data=await ctx.db.find({
         
                collection:"products",
                depth:1,//Populate "category" and "images"
                where,
               


    })

        return data
    })


})