import { createClient } from "@supabase/supabase-js";

// Client-side Supabase (uses anon key — safe to expose)
export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for client components
let _supabase: ReturnType<typeof createClient> | null = null;
export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

// Convenient export for client components
export const supabase = {
  auth: {
    signInWithPassword: (creds: { email: string; password: string }) =>
      getSupabase().auth.signInWithPassword(creds),
    signUp: (creds: { email: string; password: string }) =>
      getSupabase().auth.signUp(creds),
    signOut: () => getSupabase().auth.signOut(),
    getUser: () => getSupabase().auth.getUser(),
    resetPasswordForEmail: (email: string) =>
      getSupabase().auth.resetPasswordForEmail(email),
  },
  from: (table: string) => getSupabase().from(table),
};

// Type exports
export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  business_name?: string;
  business_type?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "accepted" | "rejected" | "delivered";
  payment_method: "stripe" | "invoice";
  stripe_payment_intent?: string;
  admin_note?: string;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  unit_size: string;
  price: number;
  quantity: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};
