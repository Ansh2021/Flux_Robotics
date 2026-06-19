import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database.types.js";

const supabaseURL = process.env.SUPABASE_URL!;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient<Database>(supabaseURL, publishableKey);
