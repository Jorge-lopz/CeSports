declare const supabase: any;

const db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, {
	db: {
		schema: "public",
	},
});

(async () => {
	const { data, error } = await db.from("teams").select();

	if (error) {
		console.error(error);
	} else {
		console.log(data);
	}
})();
