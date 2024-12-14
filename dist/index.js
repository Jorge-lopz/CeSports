var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Create the database connection
const db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });
const roulette = document.getElementById("roulette");
const numberOfSpins = getComputedStyle(roulette).getPropertyValue("--spin-amount").trim();
const startButton = document.getElementById("startButton");
let teamsArray = [];
function getUnselectedTeams() {
    return __awaiter(this, void 0, void 0, function* () {
        let { data, error } = yield db.from("teams").select().is("class", null);
        if (error) {
            console.error(error);
        }
        else {
            teamsArray = data.map((team) => team.team);
        }
    });
}
function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
let teams;
function generateRoulette() {
    return __awaiter(this, void 0, void 0, function* () {
        roulette.innerHTML = "";
        if (teamsArray.length == 0)
            return null;
        for (let i = 0; i < (Number(numberOfSpins) + 1) / teamsArray.length; i++) {
            teamsArray.forEach((item, _) => {
                let team = document.createElement("div");
                team.classList.add("roulette-team");
                team.appendChild(Object.assign(document.createElement("img"), { src: `./assets/teams/${item}.png` }));
                roulette.appendChild(team);
            });
            teams = document.querySelectorAll(".roulette-team");
            teams.forEach((item, index) => {
                item.style.marginTop = `calc(${index} * 75%)`;
            });
        }
    });
}
startButton.addEventListener("click", () => {
    const numberOfSpins = Number(getComputedStyle(roulette).getPropertyValue("--spin-amount").trim());
    generateRoulette();
    // Start animation
    teams.forEach((item, _) => {
        item.style.animation = `spin ${1.275}s forwards linear`;
    });
    // End animation
    setTimeout(() => {
        teams.forEach((item, _) => {
            item.style.animation = `end-spin ${2.25}s cubic-bezier(.14,.18,.73,1.32) forwards`;
        });
        let selectedTeam = teamsArray[numberOfSpins % teamsArray.length];
        teamsArray.splice(numberOfSpins % teamsArray.length, 1);
        // TODO - Save the team-class-group combination into the database
        console.log(selectedTeam);
    }, 1275);
    shuffleArray(teamsArray);
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield getUnselectedTeams();
        generateRoulette();
    });
}
init();
