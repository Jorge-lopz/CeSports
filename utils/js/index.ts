// Create the database connection
var db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });

const matches = document.querySelectorAll(".match");
const popupBg = document.querySelector(".match-pop-up-bg");
const popup = document.querySelector(".match-pop-up");

matches.forEach((match) => {
	match.addEventListener("click", () => {
		popup.classList.add("show");
	});
});

popupBg.addEventListener("click", () => {
	popup.classList.remove("show");
});

async function init() {}

async function initAdmin() {}

var adminIcon = document.getElementById("admin-icon");
adminIcon.addEventListener("click", () => {
	login(prompt("Inserte contraseña:", "Contraseña"));
	async function login(password: string) {
		let { data, err } = await db.rpc("check_admin_pass", { pass: password });
		if (err) {
			console.error(err);
		} else {
			console.log("Logging in");
			if (data) {
				console.log("Logged in");
				let { _, error } = await db.auth.signInWithPassword({
					email: "cesports@cesjuanpablosegundo.es",
					password: password,
				});
				if (error) {
					console.log("DB Authentication failed");
				} else {
					console.log("Acceso concedido");
					initAdmin();
				}
			}
		}
	}
});

init();
