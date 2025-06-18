import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/ui/types";


export async function POST(req: Request) {
    let event: Stripe.Event;
    try {
        
        const body = await req.text();
        const signature = req.headers.get("stripe-signature") as string;
        
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Webhook Error: ${errorMessage}`);
        return NextResponse.json(
            { message: `Webhook Error: ${errorMessage}` },
            { status: 400 }
        );
    }

    console.log("Successfully processed event:", event.id);

    const permittedEvents: string[] = [
        "checkout.session.completed",
        "account.updated"
    ];

    const payload = await getPayload({ config });

    if (permittedEvents.includes(event.type)) {
        try {
            switch (event.type) {
                case "checkout.session.completed":
                    const session = event.data.object as Stripe.Checkout.Session;
                    
                    if (!session.metadata?.userId) {
                        throw new Error("User id is required");
                    }

                    const user = await payload.findByID({
                        collection: "users",
                        id: session.metadata.userId
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const expandedSession = await stripe.checkout.sessions.retrieve(
                        session.id,
                        {
                            expand: ["line_items.data.price.product"],
                        },
                    
                    );

                    if (!expandedSession.line_items?.data || !expandedSession.line_items.data.length) {
                        throw new Error("No line items found");
                    }

                    const lineItems = expandedSession.line_items.data as ExpandedLineItem[];

                 
                  for (const item of lineItems) {
  if (!item.price?.product || typeof item.price.product === "string") {
    continue;
  }

  const product = item.price.product as Stripe.Product;
  

  const yourProductId = product.metadata?.id; 
  
  if (!yourProductId) {
    console.error("Missing product ID in metadata:", product);
    continue;
  }

  await payload.create({
    collection: "orders",
    data: {
      stripeCheckoutSessionId: session.id,
      user: user.id, 
      stripeAccountId:event.account,
      products: yourProductId, 
      name: product.name,
    },
  });
}
                    break;
                        case "account.updated":
                          const  data=event.data.object as Stripe.Account;
                            
                            await payload.update({
                                collection:"tenants",
                                where:{
                                    stripeAccountId:{
                                        equals:data.id,
                                    }
                                },
                                data:{
                                    stripeDetailsSubmitted:data.details_submitted
                                }
                            })


                default:
                    throw new Error(`Unhandled event: ${event.type}`);
            }
        } catch (error) {
            console.error("Webhook handler error:", error);
            return NextResponse.json(
                { message: "Webhook handler failed" },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ message: "Received" }, { status: 200 });
}