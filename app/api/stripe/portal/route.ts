import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the user's Stripe customer ID
  const { data: settings } = await supabase
    .from("user_settings")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!settings?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 404 }
    );
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: settings.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ieltsboost.ai"}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
