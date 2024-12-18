// Create the database connection
var db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });

let tournament: HTMLElement = document.getElementById("tournament");

// Tournament elements
let matches: NodeListOf<HTMLElement>;
function getTournamentElements() {
	matches = tournament.querySelectorAll(".match");
	matches.forEach((match) => {
		match.addEventListener("click", () => loadPopup(match));
	});
	loadBrackets();
}

// Popup elements
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
const start = document.getElementById("start");

let teams = [];
let admin = false;

async function getVotes() {
	let match = popup.getAttribute("data-match")
	if (popup.classList.contains("show")) {
		var { _, count, error } = await db
		.from(DB_VOTES)
		.select('*', { count: 'exact', head: true })
		.eq(DB_VOTES_MATCH, match);
		if (error) console.log(error);
		else var totalVotes = count;
		if (totalVotes != 0) {
			var { _, count,  error } = await db
			.from(DB_VOTES)
			.select('*', { count: 'exact', head: true })
			.eq(DB_VOTES_MATCH, match)
			.eq(DB_VOTES_TEAM, 1);
			if (error) console.log(error);
			else var team1Votes = count;
			if (totalVotes != 0) {
				let voted1 = Math.max(((team1Votes / totalVotes) * 100) - 1, 1)
				let voted2 = Math.max(((totalVotes - team1Votes) / totalVotes) * 100, 1)
				team1Vote.setAttribute("data-percentage", `${voted1}`);
				team2Vote.setAttribute("data-percentage", `${voted2}`);
				if (localStorage.getItem(`voted-${match}`) != null) {
					team1Vote.style.width = `${Math.max(voted1, 7)}%`;
					team2Vote.style.width = `${Math.max(voted2, 7)}%`;
				}
			}
		}
	}
}

async function getState() {
	if (popup.classList.contains("show")) {
		let matchId = popup.getAttribute("data-match").split("-");
		let { data, error } = await db
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
			(container as HTMLElement).style.setProperty("--match-state", stateText[STATES.indexOf(data[0].state)]);
			(container as HTMLElement).style.setProperty("--state-color", stateColors[STATES.indexOf(data[0].state)]);
		}
	}
}

async function loadPopup(match: Element) {
	let matchId = match.id.split("-");
	var { data, error } = await db
		.from(DB_MATCHES)
		.select(DB_MATCH_STATE)
		.eq(DB_MATCH_GROUP, matchId[0])
		.eq(DB_MATCH_ROUND, Number(matchId[1]))
		.eq(DB_MATCH_INDEX, Number(matchId[3]));
	if (error) {
		console.log(error);
	} else {
		if (data[0].state != null) {
			// Configure the popup to the right match
			popup.setAttribute("data-match", match.id);
			// Fill the popup data
			await updatePopup();
			if (admin && data[0].state != "set") {
				start.style.opacity = "0";
				start.style.pointerEvents = "none";
			} else {
				start.style.opacity = "1";
				start.style.pointerEvents = "all";
			}
			getState();
			getVotes();
			// Finally show the popup
			popup.classList.add("show");
		}
	}
}

async function updatePopup() {
	let matchJoined = popup.getAttribute("data-match");
	let matchId = matchJoined.split("-");
	let match = document.getElementById(matchId.join("-"));
	// Remove the voted class from both teams
	if (document.getElementById(`team-1-bar`).classList.contains("voted")) {
		document.getElementById(`team-1-bar`).classList.remove("voted");
	} else if (document.getElementById(`team-2-bar`).classList.contains("voted"))
		document.getElementById(`team-2-bar`).classList.remove("voted");
	// See if the user already voted for this match
	if (localStorage.getItem(`voted-${matchJoined}`) != null) {
		// Add the voted class to the team that was voted, if any
		document.getElementById(`team-${localStorage.getItem(`voted-${matchJoined}`)}-bar`).classList.add("voted");
		separator.classList.add("disabled");
		separator.innerHTML = "";
	} else if (document.getElementById("separator").classList.contains("disabled")) {
		separator.innerHTML = "VOTA";
		separator.classList.remove("disabled");
	}

	// Reset the votes
	team1Vote.setAttribute("data-percentage", `50`);
	team1Vote.style.width = "50%";
	team2Vote.setAttribute("data-percentage", `50`);
	team2Vote.style.width = "50%";

	// Update the logos on the popup
	const matchImages = match.querySelectorAll(".team-logo");
	const matchNames = match.querySelectorAll(".team-name");
	elImages.forEach((element, idx) => {
		let teamImage = matchImages[idx]?.getAttribute("src").trim();
		let teamName = matchNames[idx]?.textContent?.trim();

		element.setAttribute("src", `${teamImage}`);
		elNames[idx].textContent = `${teamName}`;
	});
}

popupBg.addEventListener("click", () => {
	popup.classList.remove("show");
});

const getWindowSize = () => ({
	width: window.innerWidth,
	height: window.innerHeight,
});

function detectResize() {
	let size = getWindowSize();
	if (size.width < 1200) tournament = document.getElementById("tournament-mobile");// TODO - 1400px
	else tournament = document.getElementById("tournament");
	getTournamentElements(); // Update tournament elements

	window.addEventListener("resize", () => {
		size = getWindowSize();
		// Same as CSS Breakpoint
		if (size.width < 1200) var temp = document.getElementById("tournament-mobile"); // TODO - 1400px
		else var temp = document.getElementById("tournament");
		if (temp != tournament) {
			tournament = document.getElementById("tournament");
			getTournamentElements(); // Update tournament elements
		}
	});
}

async function getTeams() {
	var { data, error } = await db.from(DB_TEAMS).select(`${DB_TEAM_NAME}, ${DB_TEAM_CLASS}`);
	if (error) console.error(error);
	else return data;
}

async function loadMatch(match: any) {
	let team1 = tournament.querySelector(`#${match[DB_MATCH_GROUP]}-${match[DB_MATCH_ROUND]}-${match[DB_MATCH_INDEX]}-team-1`);
	team1.querySelector(".team-logo").setAttribute("src", `./assets/teams/${match[DB_MATCH_TEAM1]}.svg`); // TODO -> To PNG
	team1.querySelector(".team-name").textContent = `${teams.find((team: any) => team.name === match[DB_MATCH_TEAM1]).class}`;
	let team2 = tournament.querySelector(`#${match[DB_MATCH_GROUP]}-${match[DB_MATCH_ROUND]}-${match[DB_MATCH_INDEX]}-team-2`);
	team2.querySelector(".team-logo").setAttribute("src", `./assets/teams/${match[DB_MATCH_TEAM2]}.svg`); // TODO -> To PNG
	team2.querySelector(".team-name").textContent = `${teams.find((team: any) => team.name === match[DB_MATCH_TEAM2]).class}`;
}

async function loadBrackets() {
	teams = await getTeams();
	var { data, error } = await db
		.from(DB_MATCHES)
		.select(`${DB_MATCH_GROUP}, ${DB_MATCH_ROUND}, ${DB_MATCH_INDEX}, ${DB_MATCH_TEAM1}, ${DB_MATCH_TEAM2}`);
	if (error) console.error(error);
	else {
		if (error) console.error(error);
		for (let i = 0; i < data.length; i++) {
			let match = data[i];
			if (match[DB_MATCH_TEAM1] != null || match[DB_MATCH_TEAM2] != null) loadMatch(match);
		}
	}
}

async function init() {
	detectResize();
	loadBrackets();
	getTournamentElements();
	// Configure the vote update every 3 seconds
	setInterval(async () => {
		getVotes();
		getState();
	}, 3000);
}

async function initAdmin() {
	admin = true;
	// Prevent newline and non-number characters insertion on the score inputs on the popup
	function handleInput(scoreElement: any) {
		scoreElement.setAttribute("contenteditable", "true");
		scoreElement.addEventListener("keydown", (e: any) => {
			if (e.key === "Enter") e.preventDefault();
		});
		scoreElement.addEventListener("input", () => {
			let filteredText = scoreElement.textContent.replace(/[^0-9]/g, ""); // Keep only numbers
			if (scoreElement.textContent !== filteredText) scoreElement.textContent = filteredText;
			if (scoreElement.textContent.length > 3) scoreElement.textContent = scoreElement.textContent.slice(0, 3); // Max length = 3
		});
	}
	handleInput(score1);
	handleInput(score2);

	// Remove votes from the popup and add win buttons instead
	(document.querySelector(".vote-bar") as HTMLElement).style.display = "none";
	(document.querySelector(".admin-buttons") as HTMLElement).style.display = "flex";
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

async function vote(team: number) {
	// TODO - Use the data info on match to see if it has started (based on DBe)
	let match = popup.getAttribute("data-match");
	var { data, error } = await db
	.from(DB_VOTES)
	return true
}

team1Vote.addEventListener("click", () => {
	if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null) return;
	let voted = vote(1);
	if (voted) {
		localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "1");
		updatePopup();
	}
});
team2Vote.addEventListener("click", () => {
	if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null) return;
	let voted = vote(2);
	if (voted) {
		localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "2");
		updatePopup();
	}
});

document.getElementById("github-icon").addEventListener("click", () => {
	window.open("https://github.com/Jorge-lopz/CeSports", "_github");
});

init();
//initAdmin();
