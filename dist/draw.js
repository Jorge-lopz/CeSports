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
const teamRoulette = document.getElementById("teamRoulette");
const classRoulette = document.getElementById("classRoulette");
const numberOfSpins = Number(getComputedStyle(teamRoulette).getPropertyValue("--spin-amount").trim());
const rollButton = document.getElementById("rollButton");
let teamsArray = [];
let classesArray = ["DAM 1", "DAM 2", "EDI 1", "EDI 2", "TSEAS 1", "TSEAS 2"];
var admin = false;
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
let classes;
function generateRoulettes() {
    return __awaiter(this, void 0, void 0, function* () {
        // TEAMS ROULETTE
        teamRoulette.innerHTML = "";
        if (teamsArray.length == 0)
            return null;
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
            teams.forEach((item, index) => {
                item.style.marginTop = `calc(${index} * -150%)`;
            });
        }
        // CLASSES ROULETTE
        classRoulette.innerHTML = "";
        if (classesArray.length == 0)
            return null;
        for (let i = 0; i < (Number(numberOfSpins) + 1) / classesArray.length; i++) {
            classesArray.forEach((item, _) => {
                let clas = document.createElement("div");
                clas.classList.add("roulette-class");
                let p = Object.assign(document.createElement("p"), { innerText: item });
                p.style.userSelect = "none";
                p.style.fontSize = "50px";
                clas.appendChild(p);
                classRoulette.appendChild(clas);
            });
            classes = document.querySelectorAll(".roulette-class");
            classes.forEach((item, index) => {
                item.style.marginTop = `calc(${index} * -150%)`;
            });
        }
    });
}
rollButton.addEventListener("click", () => {
    if (teamsArray.length == 1) {
        rollButton.classList.add("disabled");
        teamRoulette.style.opacity = "0";
        classRoulette.style.opacity = "0";
        setTimeout(() => {
            generateRoulettes();
            teamRoulette.style.opacity = "1";
            classRoulette.style.opacity = "1";
        }, 450);
        return;
    }
    setTimeout(() => {
        rollButton.checked = false;
        rollButton.classList.add("disabled");
    }, 380);
    teamRoulette.style.opacity = "0";
    classRoulette.style.opacity = "0";
    setTimeout(() => {
        generateRoulettes();
        teamRoulette.style.opacity = "1";
        classRoulette.style.opacity = "1";
        let animationDuration = 2.3;
        // Start animation
        teams.forEach((item, _) => {
            item.style.animation = `spin ${animationDuration}s forwards ease-in`;
        });
        classes.forEach((item, _) => {
            item.style.animation = `spin ${animationDuration * 1.4}s forwards ease-in`;
        });
        let selectedTeam = teamsArray[numberOfSpins % teamsArray.length];
        let selectedClass = classesArray[numberOfSpins % classesArray.length];
        console.log(selectedTeam, " -> ", selectedClass);
        // TODO - Save the team-class-group combination into the database
        // End animation
        // TEAM ROULETTE
        let classRouletteDelay = 1.4;
        setTimeout(() => {
            teams.forEach((item, _) => {
                item.style.animation = `end-spin ${1.7}s cubic-bezier(.14,.18,.73,1.32) forwards`;
            });
            teamsArray.splice(numberOfSpins % teamsArray.length, 1);
            setTimeout(() => {
                shuffleArray(teamsArray);
            }, 2000);
        }, animationDuration * 1000);
        // CLASS ROULETTE
        setTimeout(() => {
            classes.forEach((item, _) => {
                item.style.animation = `end-spin ${1.7 * classRouletteDelay}s cubic-bezier(.14,.18,.73,1.32) forwards`;
            });
            classesArray.splice(numberOfSpins % classesArray.length, 1);
            setTimeout(() => {
                shuffleArray(classesArray);
                rollButton.classList.remove("disabled");
            }, 2000 * classRouletteDelay);
        }, animationDuration * 1000 * classRouletteDelay);
    }, 450);
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        rollButton.classList.add("disabled");
        yield getUnselectedTeams();
        shuffleArray(teamsArray);
        shuffleArray(classesArray);
        console.log(teamsArray);
        console.log(classesArray);
        generateRoulettes();
    });
}
init();
const homeIcon = document.getElementById("home-icon");
const adminIcon = document.getElementById("admin-icon");
homeIcon.addEventListener("click", () => {
    window.location.href = "/index.html";
});
adminIcon.addEventListener("click", () => {
    /* TODO poner contraseña */
    if (prompt("Estás intentando entrar al modo admin, inserte contraseña:", "contraseña") == "hola") {
        console.log("Acceso concedido");
        rollButton.classList.remove("disabled");
    }
});
