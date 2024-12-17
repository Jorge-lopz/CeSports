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
const matches = document.querySelectorAll(".match");
const popupBg = document.querySelector(".match-pop-up-bg");
const popup = document.querySelector(".match-pop-up");
const container = document.querySelector(".container");
const logosContainer = document.querySelector(".logos-container");
const elNames = logosContainer.querySelectorAll(".team-name");
const elImages = logosContainer.querySelectorAll(".team-logo");
const team1Vote = document.getElementById("team-1-bar");
const separator = document.getElementById("separator");
const team2Vote = document.getElementById("team-2-bar");
const score1 = document.getElementById("team-1-score");
let score1Text = "";
const score2 = document.getElementById("team-2-score");
let score2Text = "";
matches.forEach((match) => {
    match.addEventListener("click", () => {
        popup.setAttribute("data-match", match.id);
        updatePopup();
        // Finally show the popup
        popup.classList.add("show");
    });
});
function updatePopup() {
    return __awaiter(this, void 0, void 0, function* () {
        let matchId = popup.getAttribute("data-match");
        let match = document.getElementById(matchId);
        // Remove the voted class from both teams
        if (document.getElementById(`team-1-bar`).classList.contains("voted")) {
            document.getElementById(`team-1-bar`).classList.remove("voted");
        }
        else if (document.getElementById(`team-2-bar`).classList.contains("voted"))
            document.getElementById(`team-2-bar`).classList.remove("voted");
        // See if the user already voted for this match
        if (localStorage.getItem(`voted-${matchId}`) != null) {
            // Add the voted class to the team that was voted, if any
            document.getElementById(`team-${localStorage.getItem(`voted-${matchId}`)}-bar`).classList.add("voted");
            separator.classList.add("disabled");
            separator.innerHTML = "";
        }
        else if (document.getElementById("separator").classList.contains("disabled")) {
            separator.innerHTML = "VOTA";
            separator.classList.remove("disabled");
        }
        // Update the logos on the popup
        const matchImages = match.querySelectorAll(".team-logo");
        const matchNames = match.querySelectorAll(".team-name");
        elImages.forEach((element, idx) => {
            var _a, _b, _c;
            let teamImage = (_a = matchImages[idx]) === null || _a === void 0 ? void 0 : _a.getAttribute("src").trim();
            let teamName = (_c = (_b = matchNames[idx]) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim();
            element.setAttribute("src", `${teamImage}`);
            elNames[idx].textContent = `${teamName}`;
        });
        // Update based on the db
        let { dbMatch, error } = yield db.from(DB_MATCHES).select();
        let state;
        if (error) {
            console.error(error);
        }
        else {
            // TODO - Update the score based on DB and data properties on the match HTML element (on realtime)
            // TODO - Update the match state based on DB and data properties on the match HTML element (on realtime)
            let stateText = ["Programado", "En juego", "Finalizado"];
            let stateColors = ["#ffffff20", "#34ac3a35", "#ffd9035"];
            container.style.setProperty("--match-state", stateText[STATES.indexOf(state)]);
            container.style.setProperty("--state-color", stateColors[STATES.indexOf(state)]);
        }
    });
}
popupBg.addEventListener("click", () => {
    popup.classList.remove("show");
});
function init() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function initAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        score1.setAttribute("content-editable", "true");
        score2.setAttribute("content-editable", "true");
        score1.addEventListener("change", () => {
            if (/^\d+$/.test(score1.textContent.trim())) {
                score1Text = score1.textContent.trim();
            }
            else {
                score1.textContent = score1Text;
            }
        });
        score2.addEventListener("input", () => {
            score2.setAttribute("content-editable", "false");
        });
    });
}
var adminIcon = document.getElementById("admin-icon");
adminIcon.addEventListener("click", () => {
    login(prompt("Inserte contraseña:", "iLUgJ3UMB35H")); // TODO - Remove password
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
                        initAdmin();
                    }
                }
            }
        });
    }
});
function vote() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO - Use the data info on match to see if it has started (based on DB and realtime)
        let match = popup.getAttribute("data-match").split("-");
        var { matchId, error } = yield db
            .from(DB_MATCHES)
            .select(DB_MATCH_ID)
            .eq(DB_MATCH_GROUP, match[0])
            .eq(DB_MATCH_ROUND, match[1])
            .eq(DB_MATCH_INDEX, match[3]);
        console.log(matchId); // TODO - Make the database contain the team order
        if (error)
            return false;
        var { teamId, error } = yield db.from(DB_MATCHES).select(`team${match[3]}`).eq(DB_MATCH_ID, matchId);
        if (error)
            return false;
        var { data, error } = yield db.from(DB_VOTES).insert({
            match: matchId,
            team: teamId,
        });
        if (error)
            return false;
        console.log(data.status == 201);
        return data.status == 201;
    });
}
team1Vote.addEventListener("click", () => {
    if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null)
        return;
    let voted = vote();
    if (voted) {
        localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "1");
        updatePopup();
    }
});
team2Vote.addEventListener("click", () => {
    if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null)
        return;
    let voted = vote();
    if (voted) {
        localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "2");
        updatePopup();
    }
});
init();
initAdmin();
