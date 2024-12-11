"use strict";
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
