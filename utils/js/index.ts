import { supabase } from "./db";

console.log(supabase);

const teams: Array<string> = [
	"AC Milan",
	"Arsenal",
	"Atlético Madrid",
	"Bayer Leverkusen",
	"Bayern Munich",
	"Borussia Dortmund",
	"Chelsea",
	"Barcelona",
	"Inter Milan",
	"Juventus",
	"Liverpool",
	"Manchester City",
	"Manchester United",
	"Paris Saint-Germain",
	"Real Madrid",
	"Tottenham Hotspur",
];

function teamCart(team: string) {
	const teamCart = document.createElement("div");
	teamCart.classList.add("team");

	teamCart.appendChild(Object.assign(document.createElement("p"), { innerText: team }));
	teamCart.appendChild(Object.assign(document.createElement("img"), { src: `./assets/teams/${team}.png` }));

	return teamCart;
}

const elTeams = document.getElementById("teams");

teams.forEach((team) => {
	elTeams?.appendChild(teamCart(team));
});

// TODO - Create a collection to fll with db retrieved data programatically
document.getElementById("group-a")?.childNodes.forEach((match, index) => {
	(match as HTMLDivElement).childNodes.forEach((team, teamIndex) => {
		(team as HTMLDivElement).innerText = teams[(index + 1) * teamIndex];
	});
});
document.getElementById("group-b")?.childNodes.forEach((match, index) => {
	(match as HTMLDivElement).childNodes.forEach((team, teamIndex) => {
		(team as HTMLDivElement).innerText = teams[(index + 1) * teamIndex + 1];
	});
});
