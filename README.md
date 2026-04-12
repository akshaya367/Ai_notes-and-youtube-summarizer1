# Nexus AI - Premium Customer Support Platform

A production-ready, AI-powered customer support application built with Next.js (App Router), Supabase, and OpenAI.

## 🚀 Features
- **3D Animated Background:** High-performance React Three Fiber mesh gradient.
- **AI Chat System:** Context-aware responses with streaming and typing animations.
- **Support Dashboard:** Manage conversations, analytics, and history.
- **Admin Panel:** Global configuration, AI tone selector, and Knowledge Base management.
- **Secure Auth:** Supabase integration with JWT and RLS already architected.
- **Premium Design:** Glassmorphism UI with Inter & Outfit typography.

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **AI Engine:** OpenAI GPT-4 API
- **Styling:** Vanilla CSS (Modern CSS Variables & Glassmorphism)
- **3D Engine:** Three.js (@react-three/fiber)
- **Icons:** Lucide-React

## 📋 Setup Instructions

### 1. Database Setup
Run the SQL found in `supabase_schema.sql` (or see below) in your Supabase SQL Editor.

### 2. Environment Variables
Create a `.env.local` file in the root and add:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Local Development
```bash
npm install
npm run dev -- -p 3001
```

## 🔐 Security Configuration
- **RLS:** Row Level Security is architected to ensure users can only see their own chats.
- **Input Sanitization:** React components prevent XSS.
- **Secure Sessions:** Handled via Supabase middleware.

## 📁 File Structure
- `/app`: App Router pages and layouts.
- `/components`: UI libraries, Chat, and 3D scenes.
- `/lib`: Supabase and OpenAI core logic.
- `/types`: Shared TypeScript definitions.

## 🚢 Deployment
Ready for Vercel:
1. Connect GitHub repository.
2. Add environment variables.
3. Deploy.
