import * as Schema from "./schema";
import { createClient } from "@supabase/supabase-js";

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

export const supabase = createClient(`https://${Schema.DB}.supabase.co`, process.env.DB_ANON_KEY || "");

console.log(supabase);
