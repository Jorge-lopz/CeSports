// Create the database connection
var db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });

const matches = document.querySelectorAll(".match");
const popupBg = document.querySelector(".match-pop-up-bg");
const popup = document.querySelector(".match-pop-up");
const logosContainer = document.querySelector(".logos-container");
const score1 = document.getElementById("team-1-score");
let score1Text = "";
const score2 = document.getElementById("team-2-score");
let score2Text = "";

matches.forEach((match) => {
	match.addEventListener("click", () => {
		popup.classList.add("show");


		const elImages = logosContainer.querySelectorAll(".team-logo");
		const matchImages = match.querySelectorAll(".team-logo");
		const elNames = logosContainer.querySelectorAll(".team-name");
		const matchNames = match.querySelectorAll(".team-name");
		elImages.forEach((element, idx) => {
		  const teamImage = matchImages[idx]?.getAttribute("src").trim();
		  const teamName = matchNames[idx]?.textContent?.trim();


		  if (teamImage && teamName) {
			element.setAttribute("src", `${teamImage}`);
			elNames[idx].textContent = `${teamName}`;
		  } else {
			console.error(`No se encontró texto para el índice ${idx}`);
		  }
		});

	});
});

popupBg.addEventListener("click", () => {
	popup.classList.remove("show");
});

async function init() {}

async function initAdmin() {
	score1.setAttribute("content-editable", "true");
	score2.setAttribute("content-editable", "true");

	score1.addEventListener("change", () => {
		if (/^\d+$/.test(score1.textContent.trim())) {
			score1Text = score1.textContent.trim();
			} else {
				score1.textContent = score1Text;
			}

	});
	score2.addEventListener("input", () => {
		score2.setAttribute("content-editable", "false");
	});
}

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
initAdmin();
