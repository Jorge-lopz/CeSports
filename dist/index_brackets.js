var _a, _b;
const teams = [
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
function teamCart(team) {
    const teamCart = document.createElement("div");
    teamCart.classList.add("team");
    teamCart.appendChild(Object.assign(document.createElement("p"), { innerText: team }));
    teamCart.appendChild(Object.assign(document.createElement("img"), { src: `./assets/teams/${team}.png` }));
    return teamCart;
}
const elTeams = document.getElementById("teams");
teams.forEach((team) => {
    elTeams === null || elTeams === void 0 ? void 0 : elTeams.appendChild(teamCart(team));
});
// TODO - Create a collection to fll with db retrieved data programatically
(_a = document.getElementById("group-a")) === null || _a === void 0 ? void 0 : _a.childNodes.forEach((match, index) => {
    match.childNodes.forEach((team, teamIndex) => {
        team.innerText = teams[(index + 1) * teamIndex];
    });
});
(_b = document.getElementById("group-b")) === null || _b === void 0 ? void 0 : _b.childNodes.forEach((match, index) => {
    match.childNodes.forEach((team, teamIndex) => {
        team.innerText = teams[(index + 1) * teamIndex + 1];
    });
});
