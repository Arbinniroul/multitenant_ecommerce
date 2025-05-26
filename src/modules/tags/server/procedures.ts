
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import {Where} from "payload"
import { Category } from "@/payload-types";
import { DEFAULT_LIMIT } from "@/constants";
export const tagsRouter=createTRPCRouter({

    getMany:baseProcedure

    .input(z.object({
        cursor:z.number().default(1),
       limit:z.number().default(DEFAULT_LIMIT),
    }))
    
    .query(async({ctx,input})=>{
      
   const data=await ctx.db.find({

    collection:'tags',
    limit:input.limit,
    depth:1,
   })

        return data
    })


})