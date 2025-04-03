"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ReleaseTicket from "./ReleaseTicket";
import { Ticket } from "lucide-react";

declare function createStripeCheckoutSession({
  eventId,
  tierId,
}: {
  eventId: Id<"events">;
  tierId?: string | null;
}): Promise<{ sessionUrl: string }>;

export default function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const ticketTiers = useQuery(api.ticketTiers.getByEventId, { eventId });
  const event = useQuery(api.events.getById, { eventId });

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = Date.now() > offerExpiresAt;

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }

      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${
            seconds === 1 ? "" : "s"
          }`
        );
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  const handlePurchase = async (tierId?: string | null) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { sessionUrl } = await createStripeCheckoutSession({
        eventId,
        tierId,
      });

      if (sessionUrl) {
        router.push(sessionUrl);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !queuePosition || queuePosition.status !== "offered") {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ticket Reserved
                </h3>
                <p className="text-sm text-gray-500">
                  Expires in {timeRemaining}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              A ticket has been reserved for you. Complete your purchase before
              the timer expires to secure your spot at this event.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select Ticket Type</h3>

          {ticketTiers ? (
            ticketTiers.length > 0 ? (
              <>
                <div className="space-y-2">
                  {ticketTiers.map((tier) => (
                    <div
                      key={tier._id}
                      className={`border rounded-md p-4 cursor-pointer ${
                        selectedTierId === tier._id
                          ? "border-blue-600 bg-blue-50"
                          : ""
                      }`}
                      onClick={() => setSelectedTierId(tier._id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{tier.name}</h4>
                        <span>${tier.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{tier.description}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p>Standard ticket: ${event?.price?.toFixed(2) || 'Loading...'}</p>
                </div>
              </>
            ) : (
              <div>
                <p>Standard ticket: ${event?.price?.toFixed(2) || 'Loading...'}</p>
              </div>
            )
          ) : (
            <p>Loading ticket options...</p>
          )}

          <button
            onClick={() => handlePurchase(selectedTierId)}
            disabled={isLoading || (ticketTiers && ticketTiers.length > 0 && !selectedTierId)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
          >
            Purchase Ticket
          </button>
        </div>

        <div className="mt-4">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>
      </div>
    </div>
  );
}
