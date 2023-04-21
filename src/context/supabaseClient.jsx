import { createClient } from "@supabase/supabase-js";

const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_API_KEY);