**1. TEXT2POTAI – AI Recipe Generator & Meal Assistant**

TEXT2POTAI is an AI-powered recipe recommender that transforms any food description or ingredient list into a complete recipe using OpenAI. Users receive **3 free recipe generations**, and can **upgrade to Pro** using IntaSend Payments for unlimited access.

This project is built for real-world scalability using Supabase, Vercel, OpenAI, and IntaSend.

**2. Tech Stack**

2.1 Frontend

HTML

CSS

JavaScript

2.2 Backend

Supabase Postgres Database

Supabase Authentication

Supabase Row Level Security (RLS)

Supabase Edge Functions (TypeScript + Deno)

2.3 AI

OpenAI API for intelligent recipe generation

2.4 Payments

IntaSend API (Checkout + Callback Verification)

2.5 Hosting

Vercel (Frontend)

Supabase (Backend)

**3. Live Deployment**

Component	URL
Frontend (Vercel)	https://text-2-potai-project.vercel.app/

Backend	Supabase (Database + Edge Functions)
4. How the System Works

User opens the frontend (Vercel).

Frontend communicates with Supabase for:

Authentication

Favorites

Usage tracking

For AI recipes:

Frontend → get-recipes → OpenAI → return response

For upgrades:

Frontend → create-checkout → IntaSend checkout

After payment:

IntaSend → payment-callback → Supabase updates user as PRO

**5. Supabase Edge Functions**
**5.1 get-recipes**

Purpose:
Generate recipes using OpenAI.

Performs:

Receives user text prompt

Sends prompt to OpenAI

Returns recipe

Logs usage

Enforces free-tier limit (3 free recipes)

**5.2 create-checkout**

Purpose:
Generate an IntaSend checkout link for Pro upgrade.

Performs:

Creates payment session using IntaSend

Sends user a checkout URL

Includes metadata (e.g., user_id) for callback use

**5.3 payment-callback**

Purpose:
Automatically upgrade user after successful payment.

Performs:

Receives callback from IntaSend

Verifies payment status = COMPLETED

Updates Supabase user record:

payment_status = "PRO"

pro_expiry_date assigned

Enables unlimited recipe generation

This ensures secure, automated user upgrades.

**6. Database Security (RLS Policies)**

Supabase Row Level Security ensures users can only access their own data.

6.1 recipes Table

Public SELECT allowed

INSERT restricted to Edge Functions

Supports browsing and AI-generated recipes

6.2 favorites Table

RLS policy:
```
auth.uid() = user_id
```


Users can only manage their own favorites.

6.3 users Table

RLS policy:
```
auth.uid() = id
```

Protects personal user data and payment status.

**7. System Architecture**
```
flowchart TD
    U[👤 User] --> F[🌐 Vercel Frontend]

    F --> DB[🗄️ Supabase Database]
    F --> GR[⚡ get-recipes (Edge Function)]
    GR --> AI[🤖 OpenAI API]

    F --> CO[💳 create-checkout (Edge Function)]
    CO --> PAY[IntaSend Checkout Page]

    PAY --> CB[🔁 payment-callback (Edge Function)]
    CB --> DB

    DB --> TBL[📂 Users, Recipes, Favorites]

    U -->|3 Free Recipes| F
    U -->|Upgrade to PRO| PAY
```
**9. Project Structure**
```
TEXT2POTAI
├── index.html                     
├── style.css                      
├── app.js                         
│
├── supabase/
│   └── functions/
│       ├── get-recipes/
│       │   └── index.ts          
│       ├── create-checkout/
│       │   └── index.ts          
│       └── payment-callback/
│           └── index.ts          
│
└── README.md
```
11. Features
    
9.1 Completed

AI-powered recipe generator

Free-tier limit (3 recipes)

Favorites system

IntaSend payment integration

Automatic payment callback → Pro upgrade

Vercel + Supabase deployment

9.2 In Progress

Pro dashboard

AI-generated images

Weekly meal planner

Enhanced UI/UX

**10. Developer**

Kipkoech Laban

Creator of TEXT2POTAI – building the future of AI-powered cooking.


