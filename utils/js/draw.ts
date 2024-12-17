declare const supabase: any;

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

async function getUnselectedTeams() {
	var { data, error } = await db.from(DB_TEAMS).select().is(DB_TEAM_CLASS, null);

	if (error) {
		console.error(error);
	} else {
		teamsArray = data.map((team: any) => team[DB_TEAM_NAME]);
	}
}

async function getUnselectedClasses() {
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

let teams: NodeListOf<HTMLElement>;
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

		teams = document.querySelectorAll(".roulette-team");
		teams.forEach((item: HTMLElement, index) => {
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

async function saveTeamsClass(teamName: string, classInitials: string): Promise<boolean> {
	var { _, error } = await db.from(DB_CLASSES).update({ selected: true }).eq(DB_CLASS_INITIALS, classInitials);
	if (error) {
		console.error(error);
		return false;
	}
	var { _, error } = await db.from(DB_TEAMS).update({ class: classInitials }).eq(DB_TEAM_NAME, teamName);
	if (error) {
		console.error(error);
		return false;
	}
	console.log("SAVED");
	getUnselectedTeams();
	getUnselectedClasses();
}

rollButton.addEventListener("click", () => {
	if (teamsArray.length == 1) {
		rollButton.classList.add("disabled");
		(teamRoulette as HTMLElement).style.opacity = "0";
		(classRoulette as HTMLElement).style.opacity = "0";
		console.log(teamsArray[0], " -> ", classesArray[0]);
		saveTeamsClass(teamsArray[0], classesArray[0]);
		setTimeout(() => {
			generateRoulettes();
			(teamRoulette as HTMLElement).style.opacity = "1";
			(classRoulette as HTMLElement).style.opacity = "1";
		}, 450);
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
		teams.forEach((item: HTMLElement, _) => {
			item.style.animation = `spin ${animationDuration}s forwards ease-in`;
		});
		classes.forEach((item: HTMLElement, _) => {
			item.style.animation = `spin ${animationDuration * 1.4}s forwards ease-in`;
		});

		let selectedTeam = teamsArray[numberOfSpins % teamsArray.length];
		let selectedClass = classesArray[numberOfSpins % classesArray.length];

		console.log(selectedTeam, " -> ", selectedClass);
		saveTeamsClass(selectedTeam, selectedClass);

		// End animation
		// TEAM ROULETTE
		let classRouletteDelay = 1.4;
		setTimeout(() => {
			teams.forEach((item, _) => {
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
	//rollButton.classList.add("disabled"); // TODO - Uncomment
	await getUnselectedTeams();
	await getUnselectedClasses();
	shuffleArray(teamsArray);
	shuffleArray(classesArray);
	generateRoulettes();
	console.log(teamsArray);
	console.log(classesArray);
}

initDraw();

const homeIcon = document.getElementById("home-icon");
var adminIcon = document.getElementById("admin-icon");

homeIcon.addEventListener("click", () => {
	window.location.href = "/";
});
adminIcon.addEventListener("click", () => {
	login(prompt("Inserte contraseña:", "iLUgJ3UMB35H")); // TODO -> Remove password
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
					initAdminDraw();
				}
			}
		}
	}
});
