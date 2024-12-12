import * as Schema from "./schema";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables for local development
if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

// Initialize Supabase client
export const supabase = createClient(`https://${Schema.DB}.supabase.co`, process.env.DB_ANON_KEY || "");

console.log(supabase);
