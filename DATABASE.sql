-- NEXUS AI SUPPORT DATABASE SCHEMA
-- Execute this in your Supabase SQL Editor

-- 1. KNOWLEDGE BASE (FAQs & Docs)
create table knowledge_base (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  category text default 'General',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CHATS (Conversations)
create table chats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'New Conversation',
  status text not null default 'Active' check (status in ('Active', 'Answered', 'Escalated', 'Resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. MESSAGES (Individual message logs)
create table messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE ROW LEVEL SECURITY
alter table knowledge_base enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;

-- POLICIES

-- Knowledge Base: Everyone can read, only Admins can write
create policy "Knowledge base is readable by everyone" on knowledge_base for select using (true);
-- Note: You can add admin-specific UID checks here if needed

-- Chats: Users can only see and manage their own chats
create policy "Users can view their own chats" on chats for select using (auth.uid() = user_id);
create policy "Users can create their own chats" on chats for insert with check (auth.uid() = user_id);
create policy "Users can delete their own chats" on chats for delete using (auth.uid() = user_id);

-- Messages: Users can see messages in their own chats
create policy "Users can view messages in their chats" on messages 
for select using (
  exists (
    select 1 from chats where chats.id = messages.chat_id and chats.user_id = auth.uid()
  )
);

create policy "Users can send messages to their chats" on messages 
for insert with check (
  exists (
    select 1 from chats where chats.id = messages.chat_id and chats.user_id = auth.uid()
  )
);
