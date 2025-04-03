"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketConfirmationEmail({
  email,
  eventName,
  eventDate,
  ticketId,
}: {
  email: string;
  eventName: string;
  eventDate: Date;
  ticketId: string;
}) {
  try {
    const data = await resend.emails.send({
      from: "Ticket Marketplace <tickets@yourapp.com>",
      to: email,
      subject: `Your Ticket for ${eventName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Your Ticket is Confirmed!</h1>
          <p>Thank you for your purchase. Here are your ticket details:</p>
          <div style="border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin: 20px 0;">
            <h2>${eventName}</h2>
            <p><strong>Date:</strong> ${eventDate.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${eventDate.toLocaleTimeString()}</p>
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
          </div>
          <p>Please show this email or your ticket ID at the venue.</p>
          <p>Thank you for using our platform!</p>
        </div>
      `,
    });
    
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}