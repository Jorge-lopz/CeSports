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
var db = supabase.createClient(`https://${DB}.supabase.co`, DB_ANON_KEY, { db: { schema: "public" } });
const teamRoulette = document.getElementById("teamRoulette");
const classRoulette = document.getElementById("classRoulette");
const numberOfSpins = Number(getComputedStyle(teamRoulette).getPropertyValue("--spin-amount").trim());
const rollButton = document.getElementById("rollButton");
let teamsArray = [];
let classesMap = [];
let classesArray = [];
function getUnselectedTeams() {
    return __awaiter(this, void 0, void 0, function* () {
        var { data, error } = yield db.from(DB_TEAMS).select().is(DB_TEAM_CLASS, null);
        if (error) {
            console.error(error);
        }
        else {
            teamsArray = data.map((team) => team[DB_TEAM_NAME]);
        }
    });
}
function getUnselectedClasses() {
    return __awaiter(this, void 0, void 0, function* () {
        var { data, error } = yield db.from(DB_CLASSES).select().is(DB_CLASS_SELECTED, false);
        if (error) {
            console.error(error);
        }
        else {
            classesMap = data.map((clas) => ({
                name: clas[DB_CLASS_NAME],
                initials: clas[DB_CLASS_INITIALS],
            }));
            classesArray = classesMap.map((clas) => clas[DB_CLASS_INITIALS]);
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
                var _a;
                let clas = document.createElement("div");
                clas.classList.add("roulette-class");
                let p = Object.assign(document.createElement("p"), { innerText: (_a = classesMap.find((row) => row.initials == item)) === null || _a === void 0 ? void 0 : _a.name });
                p.style.userSelect = "none";
                p.style.fontSize = "clamp(2rem, 3vw, 2.2rem)";
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
function saveTeamsClass(teamName, classInitials) {
    return __awaiter(this, void 0, void 0, function* () {
        var { _, error } = yield db.from(DB_CLASSES).update({ selected: true }).eq(DB_CLASS_INITIALS, classInitials);
        if (error) {
            console.error(error);
            return false;
        }
        var { _, error } = yield db.from(DB_TEAMS).update({ class: classInitials }).eq(DB_TEAM_NAME, teamName);
        if (error) {
            console.error(error);
            return false;
        }
        return true;
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
        let saved = saveTeamsClass(selectedTeam, selectedClass);
        if (saved) {
            getUnselectedTeams();
            getUnselectedClasses();
        }
        // End animation
        // TEAM ROULETTE
        let classRouletteDelay = 1.4;
        setTimeout(() => {
            teams.forEach((item, _) => {
                item.style.animation = `end-spin ${1.7}s cubic-bezier(.14,.18,.73,1.32) forwards`;
            });
            shuffleArray(teamsArray);
        }, animationDuration * 1000);
        // CLASS ROULETTE
        setTimeout(() => {
            classes.forEach((item, _) => {
                item.style.animation = `end-spin ${1.7 * classRouletteDelay}s cubic-bezier(.14,.18,.73,1.32) forwards`;
            });
            shuffleArray(classesArray);
            setTimeout(() => {
                rollButton.classList.remove("disabled");
            }, 2000 * classRouletteDelay);
        }, animationDuration * 1000 * classRouletteDelay);
    }, 450);
});
function initAdminDraw() {
    return __awaiter(this, void 0, void 0, function* () {
        rollButton.classList.remove("disabled");
    });
}
function initDraw() {
    return __awaiter(this, void 0, void 0, function* () {
        //rollButton.classList.add("disabled"); // TODO - Uncomment
        yield getUnselectedTeams();
        yield getUnselectedClasses();
        shuffleArray(teamsArray);
        shuffleArray(classesArray);
        generateRoulettes();
        console.log(teamsArray);
        console.log(classesArray);
    });
}
initDraw();
const homeIcon = document.getElementById("home-icon");
var adminIcon = document.getElementById("admin-icon");
homeIcon.addEventListener("click", () => {
    window.location.href = "/";
});
adminIcon.addEventListener("click", () => {
    login(prompt("Inserte contraseña:", "iLUgJ3UMB35H")); // TODO -> Remove password
    function login(password) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data, err } = yield db.rpc("check_admin_pass", { pass: password });
            if (err) {
                console.error(err);
            }
            else {
                console.log("Logging in");
                if (data) {
                    console.log("Logged in");
                    let { _, error } = yield db.auth.signInWithPassword({
                        email: "cesports@cesjuanpablosegundo.es",
                        password: password,
                    });
                    if (error) {
                        console.log("DB Authentication failed");
                    }
                    else {
                        console.log("Acceso concedido");
                        initAdminDraw();
                    }
                }
            }
        });
    }
});
