"use server";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function createStripeCheckoutSession({
  eventId,
  tierId,
}: {
  eventId: Id<"events">;
  tierId?: Id<"ticketTiers">;
}) {
  // Get authenticated user
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to purchase tickets");
  }

  // Get event details
  const event = await convex.query(api.events.getById, { id: eventId });
  if (!event) {
    throw new Error("Event not found");
  }

  // Get pricing info
  let price = event.price;
  let name = `Ticket for ${event.name}`;
  
  if (tierId) {
    const tier = await convex.query(api.ticketTiers.getById, { id: tierId });
    if (tier) {
      price = tier.price;
      name = `${tier.name} - ${event.name}`;
    }
  }

  // Add to waiting list and get position
  const queueResult = await convex.mutation(api.events.joinWaitingList, {
    eventId,
    userId,
  });

  if (queueResult.status !== "offered") {
    // User was added to waiting list but no tickets available yet
    return { success: false, message: queueResult.message };
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name,
            description: event.description,
          },
          unit_amount: Math.round(price * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tickets?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/event/${eventId}?cancelled=true`,
    metadata: {
      eventId,
      userId,
      waitingListId: queueResult.waitingListId,
      tierId: tierId || "",
    },
    expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes (Stripe minimum)
  });

  return {
    success: true,
    url: session.url,
  };
}
