import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database.types.js";

const supabaseURL = process.env.SUPABASE_URL!;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseClient = createClient<Database>(
  supabaseURL,
  publishableKey,
);

export const supabaseAdmin = createClient<Database>(supabaseURL, serviceKey);
