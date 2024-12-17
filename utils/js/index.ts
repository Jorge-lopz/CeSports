// Create the database connection
var db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });

const matches = document.querySelectorAll(".match");
const popupBg = document.querySelector(".match-pop-up-bg");
const popup = document.querySelector(".match-pop-up");
const container = document.querySelector(".container");
const logosContainer = document.querySelector(".logos-container");
const elNames = logosContainer.querySelectorAll(".team-name");
const elImages = logosContainer.querySelectorAll(".team-logo");
const team1Vote = document.getElementById("team-1-bar");
const separator = document.getElementById("separator");
const team2Vote = document.getElementById("team-2-bar");
const score1 = document.getElementById("team-1-score");
let score1Text = "";
const score2 = document.getElementById("team-2-score");
let score2Text = "";

matches.forEach((match) => {
	match.addEventListener("click", () => loadPopup(match));
});

async function loadPopup(match: Element) {
	// TODO volver a poner
	// let matchId = match.id.split("-");
	// var { state, error } = await db
	// 	.from(DB_MATCHES)
	// 	.select(DB_MATCH_STATE)
	// 	.eq(DB_MATCH_GROUP, matchId[0])
	// 	.eq(DB_MATCH_ROUND, Number(matchId[1]))
	// 	.eq(DB_MATCH_INDEX, Number(matchId[3]));
	// if (error) {
	// 	console.log("Ha habido un error:" + error);
	// } else {
	// 	console.log("El estado es:" + state);
	// 	if (state != null) {
	// 		// Configure the popup to the  right match
	// 		popup.setAttribute("data-match", match.id);
	// 		// Fill the popup data
	// 		await updatePopup();
	// 		// Finally show the popup
	// 		popup.classList.add("show");
	// 	}
	// }

	popup.classList.add("show");
}

async function updatePopup() {
	let matchId = popup.getAttribute("data-match").split("-");
	let match = document.getElementById(matchId.join("-"));
	// Remove the voted class from both teams
	if (document.getElementById(`team-1-bar`).classList.contains("voted")) {
		document.getElementById(`team-1-bar`).classList.remove("voted");
	} else if (document.getElementById(`team-2-bar`).classList.contains("voted"))
		document.getElementById(`team-2-bar`).classList.remove("voted");
	// See if the user already voted for this match
	if (localStorage.getItem(`voted-${matchId}`) != null) {
		// Add the voted class to the team that was voted, if any
		document.getElementById(`team-${localStorage.getItem(`voted-${matchId}`)}-bar`).classList.add("voted");
		separator.classList.add("disabled");
		separator.innerHTML = "";
	} else if (document.getElementById("separator").classList.contains("disabled")) {
		separator.innerHTML = "VOTA";
		separator.classList.remove("disabled");
	}

	// Update the logos on the popup
	const matchImages = match.querySelectorAll(".team-logo");
	const matchNames = match.querySelectorAll(".team-name");
	elImages.forEach((element, idx) => {
		let teamImage = matchImages[idx]?.getAttribute("src").trim();
		let teamName = matchNames[idx]?.textContent?.trim();

		element.setAttribute("src", `${teamImage}`);
		elNames[idx].textContent = `${teamName}`;
	});

	// Update based on the db

	let { state, error } = await db
		.from(DB_MATCHES)
		.select(DB_MATCH_STATE)
		.eq(DB_MATCH_GROUP, matchId[0])
		.eq(DB_MATCH_ROUND, matchId[1])
		.eq(DB_MATCH_INDEX, matchId[3]);
	if (error) {
		console.error(error);
	} else {
		// TODO - Update the score based on DB and data properties on the match HTML element (on realtime)
		// TODO - Update the match state based on DB and data properties on the match HTML element (on realtime)
		let stateText = ["Programado", "En juego", "Finalizado"];
		let stateColors = ["#ffffff20", "#34ac3a35", "#ffd9035"];
		(container as HTMLElement).style.setProperty("--match-state", stateText[STATES.indexOf(state)]);
		(container as HTMLElement).style.setProperty("--state-color", stateColors[STATES.indexOf(state)]);
	}
}

popupBg.addEventListener("click", () => {
	popup.classList.remove("show");
});

async function init() {}

async function initAdmin() {
	score1.setAttribute("content-editable", "true");
	score2.setAttribute("content-editable", "true");


	score1.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault(); // Evita que se inserte un salto de línea
		}
	});
	score1.addEventListener("input", () => {
		const filteredText = score1.textContent.replace(/[^0-9]/g, "");
		if (score1.textContent !== filteredText) {
		  score1.textContent = filteredText;

		}
	});
	
	score2.addEventListener("input", () => {
		const filteredText = score2.textContent.replace(/[^0-9]/g, "");
		if (score2.textContent !== filteredText) {
		  score2.textContent = filteredText;
		}
	  });
}

var adminIcon = document.getElementById("admin-icon");
adminIcon.addEventListener("click", () => {
	login(prompt("Inserte contraseña:", "iLUgJ3UMB35H")); // TODO - Remove password
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

async function vote() {
	// TODO - Use the data info on match to see if it has started (based on DB and realtime)
	let match = popup.getAttribute("data-match").split("-");
	var { matchId, error } = await db
		.from(DB_MATCHES)
		.select(DB_MATCH_ID)
		.eq(DB_MATCH_GROUP, match[0])
		.eq(DB_MATCH_ROUND, match[1])
		.eq(DB_MATCH_INDEX, match[3]);
	console.log(matchId); // TODO - Make the database contain the team order
	if (error) return false;
	var { teamId, error } = await db.from(DB_MATCHES).select(`team${match[3]}`).eq(DB_MATCH_ID, matchId);
	if (error) return false;
	var { data, error } = await db.from(DB_VOTES).insert({
		match: matchId,
		team: teamId,
	});
	if (error) return false;
	console.log(data.status == 201);
	return data.status == 201;
}

team1Vote.addEventListener("click", () => {
	if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null) return;
	let voted = vote();
	if (voted) {
		localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "1");
		updatePopup();
	}
});
team2Vote.addEventListener("click", () => {
	if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null) return;
	let voted = vote();
	if (voted) {
		localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "2");
		updatePopup();
	}
});

init();
initAdmin();
