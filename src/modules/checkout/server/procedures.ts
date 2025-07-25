
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import {  Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { ProductMetadata } from "../ui/types";



export const checkoutRouter=createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
  const user = await ctx.db.findByID({
    collection: "users",
    id: ctx.session.user.id,
    depth: 0
  });
    console.log({user})
  if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

  const tenantId = user.tenants?.[0]?.tenant as string;
  const tenant = await ctx.db.findByID({
    collection: "tenants",
    id: tenantId
  });

  if (!tenant) throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });


  if (tenant.stripeDetailsSubmitted) {
    return { 
      url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      message: "Already verified" 
    };
  }


  if (!tenant.stripeAccountId) {
    const account = await stripe.accounts.create({
      type: 'standard',
      email: user.email,
    });

    await ctx.db.update({
      collection: "tenants",
      id: tenantId,
      data: { stripeAccountId: account.id }
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: tenant.stripeAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
    type: "account_onboarding"
  });

  if (!accountLink.url) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to create Stripe verification link",
    });
  }

  return { url: accountLink.url };
})
    ,purchase: protectedProcedure
    .input(z.object({
      productIds: z.array(z.string().min(1)),
      tenantSlugs: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const products = await ctx.db.find({
          collection: "products",
          depth: 2,
          where: {
            and: [
              { id: { in: input.productIds } },
              { "tenant.slug": { equals: input.tenantSlugs } },
              {
                isArchived:{
                    not_equals:true
                }
              }
            ]
          }
        });

        if (products.totalDocs !== input.productIds.length) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
        }

        const tenantsData = await ctx.db.find({
          collection: "tenants",
          limit: 1,
          pagination: false,
          where: { slug: { equals: input.tenantSlugs } }
        });

        const tenant = tenantsData.docs[0];
        if (!tenant) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Tenant Not found" });
        }

        // Remove the Stripe verification requirement
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100,
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata
            },
          }
        }));

        const checkout = await stripe.checkout.sessions.create({
          customer_email: ctx.session.user.email,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlugs}/checkout?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlugs}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          metadata: { 
            userId: ctx.session.user.id,
            productIds: JSON.stringify(input.productIds),
            tenantSlug: input.tenantSlugs
          }
        });

        if (!checkout.url) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create checkout session" });
        }
        
        return { url: checkout.url };
      } catch (error) {
        console.error('Checkout error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Checkout failed'
        });
      }
    })
    ,getProducts:baseProcedure

    .input(z.object({
       ids:z.array(z.string())
    }))
    .query(async({ctx,input})=>{
        const data=await ctx.db.find({
            collection:"products",
            depth:2,
            where:{
              and:[{
                  id:{
                    in:input.ids
                },
              
            },
            {
                isArchived:{
                    not_equals:true
                },
            },
              ]}
        })
        if(data.totalDocs!==input.ids.length){
            throw new TRPCError({code:"NOT_FOUND",message:"Products not found"})
        }

    
   const totalPrice=data.docs.reduce((acc,product)=>{
    const price=Number(product.price);
    return acc+(isNaN(price)? 0:price)
   },0)

   

        return {...data,
                totalPrice:totalPrice,

            docs:data.docs.map((doc)=>({...doc,image:doc.image as Media | null,
                tenant:doc.tenant as Tenant & {image:Media |null;},

            }))
        }
    })


})
