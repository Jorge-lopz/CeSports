declare const supabase: any;

// Create the database connection
const db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });

const teamRoulette = document.getElementById("teamRoulette");
const classRoulette = document.getElementById("classRoulette");
const numberOfSpins = Number(getComputedStyle(teamRoulette).getPropertyValue("--spin-amount").trim());
const rollButton = document.getElementById("rollButton");
let teamsArray = [];

async function getUnselectedTeams() {
	let { data, error } = await db.from("teams").select().is("class", null);

	if (error) {
		console.error(error);
	} else {
		teamsArray = data.map((team: any) => team.team);
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

async function generateRoulette() {
	teamRoulette.innerHTML = "";
	if (teamsArray.length == 0) return null;

	for (let i = 0; i < (Number(numberOfSpins) + 1) / teamsArray.length; i++) {
		teamsArray.forEach((item, _) => {
			let team = document.createElement("div");
			team.classList.add("roulette-team");
			let img = Object.assign(document.createElement("img"), { src: `./assets/teams/${item}.svg` });
			img.width = 250;
			team.appendChild(img);
			teamRoulette.appendChild(team);
		});

		teams = document.querySelectorAll(".roulette-team");
		teams.forEach((item: HTMLElement, index) => {
			item.style.marginTop = `calc(${index} * -100%)`;
		});
	}
}

rollButton.addEventListener("click", () => {
	rollButton.classList.add("disabled");
	(teamRoulette as HTMLElement).style.opacity = "0";
	setTimeout(() => {
		generateRoulette();
		(teamRoulette as HTMLElement).style.opacity = "1";

		// Start animation
		teams.forEach((item: HTMLElement, _) => {
			item.style.animation = `spin ${2.3}s forwards ease-in`;
		});

		let selectedTeam = teamsArray[numberOfSpins % teamsArray.length];
		console.log(selectedTeam);
		// TODO - Save the team-class-group combination into the database

		// End animation
		setTimeout(() => {
			teams.forEach((item, _) => {
				(item as unknown as HTMLElement).style.animation = `end-spin ${1.7}s cubic-bezier(.14,.18,.73,1.32) forwards`;
			});
			teamsArray.splice(numberOfSpins % teamsArray.length, 1);
			setTimeout(() => {
				rollButton.classList.remove("disabled");
				shuffleArray(teamsArray);
			}, 2000);
		}, 2300);
	}, 450);
});

async function init() {
	await getUnselectedTeams();
	console.log(teamsArray);
	generateRoulette();
}

init();
