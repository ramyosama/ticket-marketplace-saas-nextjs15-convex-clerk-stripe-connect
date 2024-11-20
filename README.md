# Ticketr - Real-time Event Ticketing Platform

A modern, real-time event ticketing platform built with Next.js 14, Convex, Clerk, and Stripe Connect. Features a sophisticated queue system, real-time updates, and secure payment processing.

## Features

### For Event Attendees

- 🎫 Real-time ticket availability tracking
- ⚡ Smart queuing system with position updates
- 🕒 Time-limited ticket offers
- 📱 Mobile-friendly ticket management
- 🔒 Secure payment processing with Stripe
- 📲 Digital tickets with QR codes

### For Event Organizers

- 💰 Direct payments via Stripe Connect
- 📊 Real-time sales monitoring
- 🎯 Automated queue management
- 📈 Event analytics and tracking
- 🔄 Automatic ticket recycling
- 🎟️ Customizable ticket limits

### Technical Features

- 🚀 Real-time updates using Convex
- 👤 Authentication with Clerk
- 💳 Payment processing with Stripe Connect
- 🌐 Server-side and client-side rendering
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn
- Stripe Account
- Clerk Account
- Convex Account

### Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone [REPO_URL]

# Install dependencies
npm install

# Start the development server
npm run dev

# In a separate terminal, start Convex
npx convex dev
```

### Setting up Clerk

1. [Create a Clerk application by Clicking here!](https://go.clerk.com/34AwsuT)
2. Configure authentication providers
3. Set up redirect URLs
4. Add environment variables

### Setting up Convex

1. [Create a Convex account by Clicking here!](https://convex.dev/c/sonnysangha)
2. Create a new project
3. Install the Convex CLI:
   ```bash
   npm install convex
   ```
4. Initialize Convex in your project:
   ```bash
   npx convex init
   ```
5. Copy your deployment URL from the Convex dashboard and add it to your `.env.local`:
   ```bash
   NEXT_PUBLIC_CONVEX_URL=your_deployment_url
   ```
6. Start the Convex development server:
   ```bash
   npx convex dev
   ```

Note: Keep the Convex development server running while working on your project. It will sync your backend functions and database schema automatically.

### Setting up Stripe

1. Create a Stripe account
2. Enable Stripe Connect
3. Set up webhook endpoints
4. Configure payment settings

### Setting up Stripe Webhooks for Local Development

1. Install the Stripe CLI:

   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (using scoop)
   scoop install stripe

   # Linux
   curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
   echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
   sudo apt update
   sudo apt install stripe
   ```

2. Login to Stripe CLI:

   ```bash
   stripe login
   ```

3. Start webhook forwarding:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret that is displayed after running the listen command and add it to your `.env.local`:

   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

5. Keep the webhook forwarding running while testing payments locally. The CLI will forward all webhook events to your local endpoint.

Note: Make sure your webhook endpoint (`/api/webhooks/stripe`) is properly configured to handle incoming webhook events.

## Architecture

### Database Schema

- Events
- Tickets
- Waiting List
- Users

### Key Components

- Real-time queue management
- Rate limiting
- Automated offer expiration
- Payment processing
- User synchronization

## Usage

### Creating an Event

1. Sign up as an event organizer
2. Complete Stripe Connect onboarding
3. Create event with details and ticket quantity
4. Publish event

### Purchasing Tickets

1. Browse available events
2. Join queue for desired event
3. Receive ticket offer
4. Complete purchase within time limit
5. Access digital ticket with QR cod

## Join the worlds best developer course & community Zero to Full Stack Hero! 🚀

### Want to Master Modern Web Development?

This project was built as part of the [Zero to Full Stack Hero 2.0](https://www.papareact.com/course) course, taught by Sonny Sangha. Join thousands of developers and learn how to build projects like this and much more!

#### What You'll Get:

- 📚 Comprehensive Full Stack Development Training
- 🎯 50+ Real-World Projects
- 🤝 Access to the PAPAFAM Developer Community
- 🎓 Weekly Live Coaching Calls with Sonny
- 🤖 AI & SaaS Development Modules
- 💼 Career Guidance & Interview Prep

#### Course Features:

- Lifetime Access to All Content
- Live Coaching Sessions
- Private Discord Community
- AI Mastery Module
- SaaS Development Track
- And much more!

[Join Zero to Full Stack Hero Today!](https://www.papareact.com/course)

## Support

For support, email team@papareact.com

---

Built with ❤️ for the PAPAFAM
