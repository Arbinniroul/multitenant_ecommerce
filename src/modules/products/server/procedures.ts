
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import {headers as getHeaders} from "next/headers"
import {Sort, Where} from "payload"
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";

export const productsRouter=createTRPCRouter({
    
   getOne: baseProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    try {
   
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });
      
   

      const product = await ctx.db.findByID({
        collection: "products",
        depth: 2,
        id: input.id,
           select:{
                  content:false
                }

      }
     
    )
    
    .catch(err => {
        console.error("DB findById error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch product",
          cause: err
        });
      });
       if(product.isArchived){
        throw new TRPCError({code:"NOT_FOUND",message:"Product not found"})
      }

      if (!product) {
        throw new TRPCError({ 
          code: "NOT_FOUND",
          message: "Product not found"
        });
      }

      
      let isPurchased = false;
      if (session.user) {
        try {
          const ordersData = await ctx.db.find({
            collection: "orders",
            pagination: false,
            limit: 1,
            where: {
              and: [
                { 
                  products: { 
                    equals: input.id 
                  }
                },
                {
                  user: {
                    equals: session.user.id
                  }
                }
              ]
            }
          });
          isPurchased = !!ordersData.docs[0];
          
        } catch (err) {
          console.error("Order lookup failed:", err);
          isPurchased = false; 
        }
      
      }
      const reviews=await ctx.db.find({
            collection:"reviews",
            pagination:false,
            where:{
              product:{
                equals:input.id
              }
            }
          })
          const reviewRating=reviews.docs.length>0?reviews.docs.reduce((acc,review)=>acc+review.rating,0)/reviews.totalDocs:0
          const ratingDistribution:Record<number, number>={
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0

          }
          if(reviews.totalDocs>0){
            reviews.docs.forEach((review)=>{
              const rating=review.rating;
              if(rating >=1 && rating<=5){
                ratingDistribution[rating]=(ratingDistribution[rating]||0)+1
              }
            })
             Object.keys(ratingDistribution).forEach((key)=>{
            const rating=Number(key);
            const count=ratingDistribution[rating]||0
            ratingDistribution[rating]=Math.round(
              (count/reviews.totalDocs)*100
            )
          })
          }
         


      return {
        ...product,
        isPurchased,
        reviewRating,
        reviewCount:reviews.totalDocs,
        ratingDistribution,
        image: product.image as Media | null,
        cover: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
      };

    } catch (err) {
      console.error("Product query failed:", err);
      

      if (err instanceof TRPCError) {
        throw err;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to process product request",
        cause: err
      });
    }
  })
    ,getMany:baseProcedure

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
        const where:Where={
          isArchived:{
            not_equals:true,
          }
        }

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
                select:{
                  content:false
                }
               


    })
      const datawithSummarizedReview=await Promise.all(
          data.docs.map(async(doc)=>{
            const reviewsData=await ctx.db.find({
              collection:"reviews",
              pagination:false,
              where:{
                product:{
                  equals:doc.id
                }
              }
            })
            return{
              ...doc,
              reviewCount:reviewsData.totalDocs,
              reviewRating:reviewsData.docs.length==0?0:reviewsData.docs.reduce((acc,review)=>acc+review.rating,0)/reviewsData.totalDocs
            }
          })
        )
   

        return {...data,
            docs:datawithSummarizedReview.map((doc)=>({
              ...doc,
              image:doc.image as Media | null,
                tenant:doc.tenant as Tenant & {image:Media |null;},

            }))
        }
    })


})
