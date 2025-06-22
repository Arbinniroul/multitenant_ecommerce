# Multi-Tenant Ecommerce Platform

A modern multi-tenant ecommerce solution built with:
- Next.js (App Router)
- Payload CMS (Headless CMS)
- MongoDB (Database)
- tRPC (Typesafe API layer)
- Stripe (Payments)

## Features

- 🏢 Multi-tenant architecture with shared infrastructure
- 🛒 Complete ecommerce functionality (products, cart, checkout)
- 💳 Stripe integration for payments
- 📱 Responsive design
- 🔐 Authentication and authorization
- 📊 Admin dashboard
- 🚀 Server-side rendering with Next.js
- 🧩 Modular architecture

## Prerequisites

- Node.js v18+
- MongoDB Atlas or local MongoDB instance
- Stripe account
- Payload Cloud account (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Server Configuration
PAYLOAD_SECRET=your_payload_secret_key
PAYLOAD_CONFIG_PATH=./src/payload/payload.config.ts

# Database
DATABASE_URI=mongodb://localhost:27017/multitenant-ecommerce
DATABASE_NAME=multitenant-ecommerce

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Multi-tenancy
PAYLOAD_SECRET=your_payload_secret
```
## The application is live at https://multitenant-ecommerce-git-main-orbnirrs-projects.vercel.app/
