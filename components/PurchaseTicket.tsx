"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { createStripeCheckoutSession } from "@/app/actions/createStripeCheckoutSession";
import { useToast } from "@/components/ui/use-toast";

export default function PurchaseTicket({ 
  eventId, 
  tierId 
}: { 
  eventId: Id<"events">; 
  tierId?: Id<"ticketTiers">; 
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const result = await createStripeCheckoutSession({ eventId, tierId });
      
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast({
          title: "Added to waiting list",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePurchase} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Processing..." : "Purchase Ticket"}
    </Button>
  );
}
