"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { StarIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

export default function EventReviews({ eventId }: { eventId: Id<"events"> }) {
  const { user, isSignedIn } = useUser();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  const reviews = useQuery(api.reviews.getByEventId, { eventId });
  const averageRating = useQuery(api.reviews.getAverageRating, { eventId });
  const createReview = useMutation(api.reviews.create);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      // Show sign-in prompt
      return;
    }
    
    try {
      await createReview({
        eventId,
        rating,
        comment,
      });
      setComment("");
    } catch (error) {
      console.error("Error creating review:", error);
      // Error handling UI
    }
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      
      {averageRating && (
        <div className="flex items-center mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating.average)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2">
            {averageRating.average.toFixed(1)} ({averageRating.count} reviews)
          </span>
        </div>
      )}
      
      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <h3 className="text-lg font-medium mb-2">Write a Review</h3>
          
          <div className="mb-4">
            <div className="flex items-center">
              <p className="mr-2">Rating:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
              required
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Submit Review
          </button>
        </form>
      )}
      
      {/* Display existing reviews */}
      <div className="space-y-6">
        {reviews?.map((review) => (
          <div key={review._id} className="border-b pb-4">
            <div className="flex items-center mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {formatDistanceToNow(new Date(review.createdAt), { 
                  addSuffix: true 
                })}
              </span>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
        
        {reviews?.length === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}