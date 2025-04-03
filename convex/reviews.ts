import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    eventId: v.id("events"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const userId = identity.subject;
    
    // Check if user has a ticket for this event
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_user_event", (q) => 
        q.eq("userId", userId).eq("eventId", args.eventId)
      )
      .collect();
    
    if (tickets.length === 0) {
      throw new Error("You can only review events you have attended");
    }
    
    // Check if user already left a review
    const existingReviews = await ctx.db
      .query("reviews")
      .withIndex("by_event_user", (q) => 
        q.eq("eventId", args.eventId).eq("userId", userId)
      )
      .collect();
    
    if (existingReviews.length > 0) {
      throw new Error("You have already reviewed this event");
    }
    
    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    
    return await ctx.db.insert("reviews", {
      eventId: args.eventId,
      userId,
      rating: args.rating,
      comment: args.comment,
      createdAt: Date.now(),
    });
  },
});

export const getByEventId = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    
    return reviews;
  },
});

export const getAverageRating = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    
    if (reviews.length === 0) return null;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: sum / reviews.length,
      count: reviews.length
    };
  },
});