import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

export const createSupabaseClient = (): SupabaseClient => {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
};
