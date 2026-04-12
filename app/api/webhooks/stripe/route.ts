import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}


export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    console.error("Supabase admin client not available");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (!userId) {
        console.error("No client_reference_id in checkout session", session.id);
        break;
      }

      // Update user plan to pro
      const { error } = await supabase
        .from("user_settings")
        .update({
          plan_type: "pro",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to upgrade user", userId, error);
      } else {
        console.log("User upgraded to pro:", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // If subscription is cancelled or unpaid, downgrade
      if (
        subscription.status === "canceled" ||
        subscription.status === "unpaid" ||
        subscription.status === "past_due"
      ) {
        const { error } = await supabase
          .from("user_settings")
          .update({ plan_type: "free" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed to downgrade user", customerId, error);
        } else {
          console.log("User downgraded to free:", customerId);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { error } = await supabase
        .from("user_settings")
        .update({ plan_type: "free" })
        .eq("stripe_customer_id", customerId);

      if (error) {
        console.error("Failed to downgrade user on deletion", customerId, error);
      } else {
        console.log("Subscription deleted, user downgraded:", customerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
