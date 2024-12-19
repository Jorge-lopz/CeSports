declare const supabase: any;
declare const Swal: any;

// Create the database connection
var db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });

type ClassMap = {
	name: string;
	initials: string;
};

const teamRoulette = document.getElementById("teamRoulette");
const classRoulette = document.getElementById("classRoulette");
const numberOfSpins = Number(getComputedStyle(teamRoulette).getPropertyValue("--spin-amount").trim());
const rollButton = document.getElementById("rollButton");
let teamsArray = [];
let classesMap: ClassMap[] = [];
let classesArray = [];
let groups = {};

async function getAvailableGroups() {
	var { data, error } = await db.from(DB_TEAMS).select(DB_TEAM_GROUP);
	if (error) {
		console.error(error);
	} else {
		let group = data.reduce(
			(acc: any, item: any) => {
				if (item.group === "A") acc.A += 1;
				if (item.group === "B") acc.B += 1;
				return acc;
			},
			{ A: 0, B: 0 }
		);

		groups = { A: 8 - group.A, B: 8 - group.B };
	}
}

async function getAvailableTeams() {
	var { data, error } = await db.from(DB_TEAMS).select().is(DB_TEAM_CLASS, null);

	if (error) {
		console.error(error);
	} else {
		teamsArray = data.map((team: any) => team[DB_TEAM_NAME]);
	}
}

async function getAvailebleClasses() {
	var { data, error } = await db.from(DB_CLASSES).select().is(DB_CLASS_SELECTED, false);

	if (error) {
		console.error(error);
	} else {
		classesMap = data.map((clas: any) => ({
			name: clas[DB_CLASS_NAME],
			initials: clas[DB_CLASS_INITIALS],
		}));
		classesArray = classesMap.map((clas: any) => clas[DB_CLASS_INITIALS]);
	}
}

function shuffleArray(array: string[]) {
	for (var i = array.length - 1; i >= 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

let teamsDraw: NodeListOf<HTMLElement>;
let classes: NodeListOf<HTMLElement>;

async function generateRoulettes() {
	// TEAMS ROULETTE
	teamRoulette.innerHTML = "";
	if (teamsArray.length == 0) return null;

	for (let i = 0; i < (Number(numberOfSpins) + 1) / teamsArray.length; i++) {
		teamsArray.forEach((item, _) => {
			let team = document.createElement("div");
			team.classList.add("roulette-team");
			let img = Object.assign(document.createElement("img"), { src: `../assets/teams/${item}.svg` });
			img.width = 250;
			img.draggable = false;
			team.appendChild(img);
			teamRoulette.appendChild(team);
		});

		teamsDraw = document.querySelectorAll(".roulette-team");
		teamsDraw.forEach((item: HTMLElement, index) => {
			item.style.marginTop = `calc(${index} * -150%)`;
		});
	}
	// CLASSES ROULETTE
	classRoulette.innerHTML = "";
	if (classesArray.length == 0) return null;

	for (let i = 0; i < (Number(numberOfSpins) + 1) / classesArray.length; i++) {
		classesArray.forEach((item, _) => {
			let clas = document.createElement("div");
			clas.classList.add("roulette-class");
			let p = Object.assign(document.createElement("p"), { innerText: classesMap.find((row) => row.initials == item)?.name });
			p.style.userSelect = "none";
			p.style.fontSize = "clamp(2rem, 3vw, 2.2rem)";
			clas.appendChild(p);
			classRoulette.appendChild(clas);
		});

		classes = document.querySelectorAll(".roulette-class");
		classes.forEach((item: HTMLElement, index) => {
			item.style.marginTop = `calc(${index} * -150%)`;
		});
	}
}

async function saveTeamsClass(teamName: string, classInitials: string) {
	let group = groups["A"] > 0 && groups["B"] > 0 ? (Math.random() < 0.5 ? "A" : "B") : groups["A"] > 0 ? "A" : groups["B"] > 0 ? "B" : null;
	console.log(teamName, " -> ", classInitials, "[", group, "]");
	var { _, error } = await db.from(DB_CLASSES).update({ selected: true }).eq(DB_CLASS_INITIALS, classInitials);
	if (error) console.error(error);

	var { _, error } = await db.from(DB_TEAMS).update({ class: classInitials, group: group }).eq(DB_TEAM_NAME, teamName);
	if (error) console.error(error);

	// Save the selected class-team on an available initial position
	var { data, error } = await db
		.from(DB_MATCHES)
		.select(`${DB_MATCH_INDEX}, ${DB_MATCH_TEAM1}, ${DB_MATCH_TEAM2}`)
		.or(`${DB_MATCH_TEAM1}.is.null,${DB_MATCH_TEAM2}.is.null`)
		.eq(DB_MATCH_GROUP, group)
		.eq(DB_MATCH_ROUND, 1);
	if (error) console.error(error);
	else {
		let match = data[Math.floor(Math.random() * data.length)];
		let index = match[DB_MATCH_INDEX];
		let team = match[DB_MATCH_TEAM1] === null ? 1 : 2;
		if (team == 1) {
			var { _, error } = await db
				.from(DB_MATCHES)
				.update({ team1: teamName })
				.eq(DB_MATCH_GROUP, group)
				.eq(DB_MATCH_ROUND, 1)
				.eq(DB_MATCH_INDEX, index);
		} else {
			var { _, error } = await db
				.from(DB_MATCHES)
				.update({ team2: teamName })
				.eq(DB_MATCH_GROUP, group)
				.eq(DB_MATCH_ROUND, 1)
				.eq(DB_MATCH_INDEX, index);
			if (error) console.error(error);
		}
	}
	getAvailableGroups();
	getAvailableTeams();
	getAvailebleClasses();
}

async function setInitialMatchesState() {
	var { _, error } = await db.from(DB_MATCHES).update({ state: "set" }).eq(DB_MATCH_ROUND, 1).neq('"group"', "FINAL");
	if (error) console.error(error);
}

rollButton.addEventListener("click", () => {
	if (teamsArray.length == 1) {
		rollButton.classList.add("disabled");
		(teamRoulette as HTMLElement).style.opacity = "0";
		(classRoulette as HTMLElement).style.opacity = "0";
		saveTeamsClass(teamsArray[0], classesArray[0]);
		setTimeout(() => {
			generateRoulettes();
			(teamRoulette as HTMLElement).style.opacity = "1";
			(classRoulette as HTMLElement).style.opacity = "1";
		}, 450);
		setInitialMatchesState();
		return;
	}
	setTimeout(() => {
		(rollButton as HTMLInputElement).checked = false;
		rollButton.classList.add("disabled");
	}, 380);
	(teamRoulette as HTMLElement).style.opacity = "0";
	(classRoulette as HTMLElement).style.opacity = "0";
	setTimeout(() => {
		generateRoulettes();
		(teamRoulette as HTMLElement).style.opacity = "1";
		(classRoulette as HTMLElement).style.opacity = "1";

		let animationDuration = 2.3;

		// Start animation
		teamsDraw.forEach((item: HTMLElement, _) => {
			item.style.animation = `spin ${animationDuration}s forwards ease-in`;
		});
		classes.forEach((item: HTMLElement, _) => {
			item.style.animation = `spin ${animationDuration * 1.4}s forwards ease-in`;
		});

		let selectedTeam = teamsArray[numberOfSpins % teamsArray.length];
		let selectedClass = classesArray[numberOfSpins % classesArray.length];

		saveTeamsClass(selectedTeam, selectedClass);

		// End animation
		// TEAM ROULETTE
		let classRouletteDelay = 1.4;
		setTimeout(() => {
			teamsDraw.forEach((item, _) => {
				(item as unknown as HTMLElement).style.animation = `end-spin ${1.7}s cubic-bezier(.14,.18,.73,1.32) forwards`;
			});
			shuffleArray(teamsArray);
		}, animationDuration * 1000);
		// CLASS ROULETTE
		setTimeout(() => {
			classes.forEach((item, _) => {
				(item as unknown as HTMLElement).style.animation = `end-spin ${1.7 * classRouletteDelay}s cubic-bezier(.14,.18,.73,1.32) forwards`;
			});
			shuffleArray(classesArray);
			setTimeout(() => {
				rollButton.classList.remove("disabled");
			}, 2000 * classRouletteDelay);
		}, animationDuration * 1000 * classRouletteDelay);
	}, 450);
});

async function initAdminDraw() {
	rollButton.classList.remove("disabled");
}

async function initDraw() {
	rollButton.classList.add("disabled");
	await getAvailableGroups();
	await getAvailableTeams();
	await getAvailebleClasses();
	shuffleArray(teamsArray);
	shuffleArray(classesArray);
	generateRoulettes();
}

initDraw();

document.getElementById("home-icon").addEventListener("click", () => {
	window.location.href = "/";
});
document.getElementById("admin-icon").addEventListener("click", () => {
	async function login() {
		var { value: password } = await Swal.fire({
			input: "password",
			inputLabel: "Enter password:",
			inputPlaceholder: "Password",
			inputAttributes: {
				maxlength: "12",
				autocapitalize: "off",
				autocorrect: "off",
			},
		});
		if (password) {
			var { data, error } = await db.rpc("check_admin_pass", { pass: password });
			if (error) console.error(error);
			else {
				if (data) {
					console.log("Admin?");
					document.getElementById("admin-icon").style.opacity = "0.8";
					document.getElementById("admin-icon").style.pointerEvents = "none";
					let { _, error } = await db.auth.signInWithPassword({
						email: "cesports@cesjuanpablosegundo.es",
						password: password,
					});
					if (error) {
						console.log("DB Authentication failed");
					} else {
						console.log("Acceso concedido");
						initAdminDraw();
					}
				}
			}
		}
	}
	login();
});
