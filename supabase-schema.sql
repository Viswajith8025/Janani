-- Run this SQL in your Supabase SQL Editor to create the bookings table
-- and set up the necessary Row Level Security (RLS) policies.

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "bookingRef" TEXT UNIQUE NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  "countryCode" TEXT,
  "checkIn" TEXT,
  "checkOut" TEXT,
  "packageId" TEXT,
  "packageName" TEXT,
  "totalGuests" JSONB,
  "specialRequests" TEXT,
  source TEXT,
  status TEXT DEFAULT 'pending_payment',
  "razorpayOrderId" TEXT,
  "paymentId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (bypasses RLS anyway, but good practice)
-- Allow anon/authenticated to insert bookings (since public users can book)
CREATE POLICY "Anyone can insert bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated admins to view/update all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (true);
