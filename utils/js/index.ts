declare const supabase: any;

// Create the database connection
const db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });

const roulette = document.getElementById("roulette");
const numberOfSpins = getComputedStyle(roulette).getPropertyValue("--spin-amount").trim();
const startButton = document.getElementById("startButton");
let teamsArray = [];

async function getUnselectedTeams() {
	let { data, error } = await db.from("teams").select().is("class", null);

	if (error) {
		console.error(error);
	} else {
		teamsArray = data.map((team: any) => team.team);
	}
}

function shuffleArray(array: string[], selected: string) {
	for (var i = array.length; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	array[0] = selected;
}

let teams: NodeListOf<HTMLElement>;

async function generateRoulette() {
	roulette.innerHTML = "";
	if (teamsArray.length == 0) return null;

	for (let i = 0; i < (Number(numberOfSpins) + 1) / teamsArray.length; i++) {
		teamsArray.forEach((item, index) => {
			if (index != 0) {
				let team = document.createElement("div");
				team.classList.add("roulette-team");
				team.appendChild(Object.assign(document.createElement("img"), { src: `./assets/teams/${item}.png` }));
				roulette.appendChild(team);
			}
		});

		teams = document.querySelectorAll(".roulette-team");
		teams.forEach((item: HTMLElement, index) => {
			item.style.marginTop = `calc(${index} * 75%)`;
		});
	}
}

startButton.addEventListener("click", () => {
	const numberOfSpins = Number(getComputedStyle(roulette).getPropertyValue("--spin-amount").trim());

	generateRoulette();

	// Start animation
	teams.forEach((item: HTMLElement, _) => {
		item.style.animation = `spin ${1.275}s forwards linear`;
	});

	// End animation
	setTimeout(() => {
		teams.forEach((item, _) => {
			(item as unknown as HTMLElement).style.animation = `end-spin ${2.25}s cubic-bezier(.14,.18,.73,1.32) forwards`;
		});
		let selectedTeam = teamsArray[(numberOfSpins % teamsArray.length) + 1];
		teamsArray.splice(numberOfSpins % teamsArray.length, 1);
		// Save the team-class-group combination into the database
		console.log(selectedTeam);
		shuffleArray(teamsArray, selectedTeam);
	}, 1275);
});

async function init() {
	await getUnselectedTeams();
	generateRoulette();
}

init();
