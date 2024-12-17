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
let tournament = document.getElementById("tournament");
// Tournament elements
let matches;
function getTournamentElements() {
    matches = tournament.querySelectorAll(".match");
    matches.forEach((match) => {
        match.addEventListener("click", () => loadPopup(match));
    });
}
// Popup elements
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
function loadPopup(match) {
    return __awaiter(this, void 0, void 0, function* () {
        let matchId = match.id.split("-");
        var { data, error } = yield db
            .from(DB_MATCHES)
            .select(DB_MATCH_STATE)
            .eq(DB_MATCH_GROUP, matchId[0])
            .eq(DB_MATCH_ROUND, Number(matchId[1]))
            .eq(DB_MATCH_INDEX, Number(matchId[3]));
        if (error) {
            console.log(error);
        }
        else {
            if (data[0].state != null) {
                // Configure the popup to the  right match
                popup.setAttribute("data-match", match.id);
                // Fill the popup data
                yield updatePopup();
                // Finally show the popup
                popup.classList.add("show");
            }
        }
        popup.classList.add("show"); // TODO - Remove
    });
}
function updatePopup() {
    return __awaiter(this, void 0, void 0, function* () {
        let matchId = popup.getAttribute("data-match").split("-");
        let match = document.getElementById(matchId.join("-"));
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
        let { state, error } = yield db
            .from(DB_MATCHES)
            .select(DB_MATCH_STATE)
            .eq(DB_MATCH_GROUP, matchId[0])
            .eq(DB_MATCH_ROUND, matchId[1])
            .eq(DB_MATCH_INDEX, matchId[3]);
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
const getWindowSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
});
function detectResize() {
    let size = getWindowSize();
    if (size.width < 1400)
        tournament = document.getElementById("tournament-mobile");
    else
        tournament = document.getElementById("tournament");
    getTournamentElements(); // Update tournament elements
    window.addEventListener("resize", () => {
        size = getWindowSize();
        // Same as CSS Breakpoint
        if (size.width < 1400)
            tournament = document.getElementById("tournament-mobile");
        else
            tournament = document.getElementById("tournament");
        getTournamentElements(); // Update tournament elements
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        detectResize();
    });
}
function initAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        // Prevent newline and non-number characters insertion on the score inputs on the popup
        function handleInput(scoreElement) {
            scoreElement.setAttribute("contenteditable", "true");
            scoreElement.addEventListener("keydown", (e) => {
                if (e.key === "Enter")
                    e.preventDefault();
            });
            scoreElement.addEventListener("input", () => {
                let filteredText = scoreElement.textContent.replace(/[^0-9]/g, ""); // Keep only numbers
                if (scoreElement.textContent !== filteredText)
                    scoreElement.textContent = filteredText;
                if (scoreElement.textContent.length > 3)
                    scoreElement.textContent = scoreElement.textContent.slice(0, 3); // Max length = 3
            });
        }
        handleInput(score1);
        handleInput(score2);
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
