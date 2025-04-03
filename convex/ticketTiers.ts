import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create a new ticket tier
export const create = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    quantity: v.number(),
    benefits: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify the user owns the event
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    const userId = identity.subject;
    const event = await ctx.db.get(args.eventId);
    
    if (!event || event.userId !== userId) {
      throw new Error("Unauthorized: You don't own this event");
    }
    
    // Create the ticket tier
    return await ctx.db.insert("ticketTiers", {
      eventId: args.eventId,
      name: args.name,
      description: args.description,
      price: args.price,
      quantity: args.quantity,
      benefits: args.benefits,
    });
  },
});

// Get all ticket tiers for an event
export const getByEventId = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ticketTiers")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});