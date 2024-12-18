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
    loadBrackets();
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
const score2 = document.getElementById("team-2-score");
const start = document.getElementById("start");
const btnWin1 = document.getElementById("win-team-1");
const btnWin2 = document.getElementById("win-team-2");
let teams = [];
let admin = false;
function getScore() {
    return __awaiter(this, void 0, void 0, function* () {
        if (popup.classList.contains("show")) { // TODO - 1400 Breakpoint
            let matchId = popup.getAttribute("data-match").split("-");
            var { data, error } = yield db
                .from(DB_MATCHES)
                .select(`${DB_MATCH_GOALS1}, ${DB_MATCH_GOALS2}`)
                .eq(DB_MATCH_GROUP, matchId[0])
                .eq(DB_MATCH_ROUND, matchId[1])
                .eq(DB_MATCH_INDEX, matchId[3]);
            if (error)
                console.log(error);
            else {
                score1.textContent = data[0].t1_goals || 0;
                score2.textContent = data[0].t2_goals || 0;
            }
        }
        else if (getWindowSize().width < 1200) { // TODO - 1400 Breakpoint
            const matches = tournament.querySelectorAll(".match");
            for (let i = 0; i < matches.length; i++) {
                let mobileMatchId = matches[i].id.split("-");
                var { data, error } = yield db
                    .from(DB_MATCHES)
                    .select(`${DB_MATCH_GOALS1}, ${DB_MATCH_GOALS2}`)
                    .eq(DB_MATCH_GROUP, mobileMatchId[0])
                    .eq(DB_MATCH_ROUND, mobileMatchId[1])
                    .eq(DB_MATCH_INDEX, mobileMatchId[3]);
                if (error)
                    console.log(error);
                else {
                    matches[i].querySelector("score").textContent = `${data[0].t1_goals || 0}:${data[0].t2_goals || 0}`;
                }
            }
        }
    });
}
function getVotes() {
    return __awaiter(this, void 0, void 0, function* () {
        let match = popup.getAttribute("data-match");
        if (popup.classList.contains("show")) {
            var { _, count, error } = yield db
                .from(DB_VOTES)
                .select('*', { count: 'exact', head: true })
                .eq(DB_VOTES_MATCH, match);
            if (error)
                console.log(error);
            else
                var totalVotes = count;
            if (totalVotes != 0) {
                var { _, count, error } = yield db
                    .from(DB_VOTES)
                    .select('*', { count: 'exact', head: true })
                    .eq(DB_VOTES_MATCH, match)
                    .eq(DB_VOTES_TEAM, 1);
                if (error)
                    console.log(error);
                else
                    var team1Votes = count;
                if (totalVotes != 0) {
                    let voted1 = Math.max(Math.round((team1Votes / totalVotes) * 100) - 1, 1);
                    let voted2 = Math.max(Math.round(100 - voted1), 1);
                    team1Vote.setAttribute("data-percentage", `${voted1}`);
                    team2Vote.setAttribute("data-percentage", `${voted2}`);
                    if (localStorage.getItem(`voted-${match}`) != null) {
                        team1Vote.style.width = `${Math.max(voted1, 7)}%`;
                        team2Vote.style.width = `${Math.max(voted2, 7)}%`;
                    }
                }
            }
        }
    });
}
function getState() {
    return __awaiter(this, void 0, void 0, function* () {
        if (popup.classList.contains("show")) {
            let matchId = popup.getAttribute("data-match").split("-");
            let { data, error } = yield db
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
                let stateColors = ["#ffffff20", "#34ac3a50", "#f2423650"];
                container.setAttribute("match-state", stateText[STATES.indexOf(data[0].state)]);
                container.style.setProperty("--state-color", stateColors[STATES.indexOf(data[0].state)]);
                // Update buttons after state update
                if (admin)
                    document.querySelector(".admin-buttons").style.display = "flex";
                if (admin && data[0].state != "set") {
                    start.style.opacity = "0";
                    start.style.pointerEvents = "none";
                }
                else {
                    start.style.opacity = "1";
                    start.style.pointerEvents = "all";
                }
                if (admin && data[0].state != "started" && data[0].round == 3) {
                    start.style.opacity = "1";
                    start.style.pointerEvents = "all";
                }
                if (admin && (data[0].state == "set" || (data[0].state != "started" && data[0].round == 3))) {
                    document.getElementById("win-team-1").style.opacity = "0";
                    document.getElementById("win-team-1").style.pointerEvents = "none";
                    document.getElementById("win-team-2").style.opacity = "0";
                    document.getElementById("win-team-2").style.pointerEvents = "none";
                }
                else {
                    document.getElementById("win-team-1").style.opacity = "1";
                    document.getElementById("win-team-1").style.pointerEvents = "all";
                    document.getElementById("win-team-2").style.opacity = "1";
                    document.getElementById("win-team-2").style.pointerEvents = "all";
                }
            }
        }
    });
}
function loadPopup(match) {
    return __awaiter(this, void 0, void 0, function* () {
        let matchId = match.id.split("-");
        var { data, error } = yield db
            .from(DB_MATCHES)
            .select(`${DB_MATCH_STATE}, ${DB_MATCH_ROUND}`)
            .eq(DB_MATCH_GROUP, matchId[0])
            .eq(DB_MATCH_ROUND, Number(matchId[1]))
            .eq(DB_MATCH_INDEX, Number(matchId[3]));
        if (error)
            console.log(error);
        else {
            if (data[0].state != null) {
                // Configure the popup to the right match
                popup.setAttribute("data-match", match.id);
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
                // Fill the popup data
                yield updatePopup();
                if (admin)
                    document.querySelector(".admin-buttons").style.display = "flex";
                if (admin && data[0].state != "set") {
                    start.style.opacity = "0";
                    start.style.pointerEvents = "none";
                }
                else {
                    start.style.opacity = "1";
                    start.style.pointerEvents = "all";
                }
                if (admin && data[0].state != "started" && data[0].round == 3) {
                    start.style.opacity = "1";
                    start.style.pointerEvents = "all";
                }
                if (admin && (data[0].state == "set" || (data[0].state != "started" && data[0].round == 3))) {
                    document.getElementById("win-team-1").style.opacity = "0";
                    document.getElementById("win-team-1").style.pointerEvents = "none";
                    document.getElementById("win-team-2").style.opacity = "0";
                    document.getElementById("win-team-2").style.pointerEvents = "none";
                }
                else {
                    document.getElementById("win-team-1").style.opacity = "1";
                    document.getElementById("win-team-1").style.pointerEvents = "all";
                    document.getElementById("win-team-2").style.opacity = "1";
                    document.getElementById("win-team-2").style.pointerEvents = "all";
                }
                getVotes();
                getState();
                getScore();
                // Finally show the popup
                popup.classList.add("show");
            }
        }
    });
}
function updatePopup() {
    return __awaiter(this, void 0, void 0, function* () {
        let matchJoined = popup.getAttribute("data-match");
        let matchId = matchJoined.split("-");
        let match = tournament.querySelector("#" + matchId.join("-"));
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
        // Remove the voted class from both teams
        if (document.getElementById(`team-1-bar`).classList.contains("voted")) {
            document.getElementById(`team-1-bar`).classList.remove("voted");
        }
        else if (document.getElementById(`team-2-bar`).classList.contains("voted"))
            document.getElementById(`team-2-bar`).classList.remove("voted");
        // See if the user already voted for this match
        if (localStorage.getItem(`voted-${matchJoined}`) != null) {
            // Add the voted class to the team that was voted, if any
            document.getElementById(`team-${localStorage.getItem(`voted-${matchJoined}`)}-bar`).classList.add("voted");
            separator.classList.add("disabled");
            separator.innerHTML = "";
        }
        else if (document.getElementById("separator").classList.contains("disabled")) {
            separator.innerHTML = "VOTA";
            separator.classList.remove("disabled");
        }
        // Reset the votes
        team1Vote.setAttribute("data-percentage", `50`);
        team1Vote.style.width = "50%";
        team2Vote.setAttribute("data-percentage", `50`);
        team2Vote.style.width = "50%";
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
    if (size.width < 1200)
        tournament = document.getElementById("tournament-mobile"); // TODO - 1400px
    else
        tournament = document.getElementById("tournament");
    getTournamentElements(); // Update tournament elements
    window.addEventListener("resize", () => {
        size = getWindowSize();
        // Same as CSS Breakpoint
        if (size.width < 1200)
            var temp = document.getElementById("tournament-mobile"); // TODO - 1400px
        else
            var temp = document.getElementById("tournament");
        if (temp != tournament) {
            tournament = document.getElementById("tournament");
            getTournamentElements(); // Update tournament elements
        }
    });
}
function getTeams() {
    return __awaiter(this, void 0, void 0, function* () {
        var { data, error } = yield db.from(DB_TEAMS).select(`${DB_TEAM_NAME}, ${DB_TEAM_CLASS}`);
        if (error)
            console.error(error);
        else
            return data;
    });
}
function loadMatch(match) {
    return __awaiter(this, void 0, void 0, function* () {
        let team1 = tournament.querySelector(`#${match[DB_MATCH_GROUP]}-${match[DB_MATCH_ROUND]}-${match[DB_MATCH_INDEX]}-team-1`);
        team1.querySelector(".team-logo").setAttribute("src", `./assets/teams/${match[DB_MATCH_TEAM1]}.png`); // TODO -> To PNG
        team1.querySelector(".team-name").textContent = `${teams.find((team) => team.name === match[DB_MATCH_TEAM1]).class}`;
        let team2 = tournament.querySelector(`#${match[DB_MATCH_GROUP]}-${match[DB_MATCH_ROUND]}-${match[DB_MATCH_INDEX]}-team-2`);
        team2.querySelector(".team-logo").setAttribute("src", `./assets/teams/${match[DB_MATCH_TEAM2]}.png`); // TODO -> To PNG
        team2.querySelector(".team-name").textContent = `${teams.find((team) => team.name === match[DB_MATCH_TEAM2]).class}`;
    });
}
function loadBrackets() {
    return __awaiter(this, void 0, void 0, function* () {
        teams = yield getTeams();
        var { data, error } = yield db
            .from(DB_MATCHES)
            .select(`${DB_MATCH_GROUP}, ${DB_MATCH_ROUND}, ${DB_MATCH_INDEX}, ${DB_MATCH_TEAM1}, ${DB_MATCH_TEAM2}, ${DB_MATCH_WINNER}`);
        if (error)
            console.error(error);
        else {
            if (error)
                console.error(error);
            for (let i = 0; i < data.length; i++) {
                let match = data[i];
                if (match[DB_MATCH_TEAM1] != null || match[DB_MATCH_TEAM2] != null)
                    loadMatch(match);
                if (match[DB_MATCH_WINNER] != null) {
                    let elMatch = tournament.querySelector(`#${match[DB_MATCH_GROUP]}-${match[DB_MATCH_ROUND]}-match-${match[DB_MATCH_INDEX]}`);
                    let loser = elMatch.querySelector(`#${match[DB_MATCH_GROUP]}-${match[DB_MATCH_ROUND]}-${match[DB_MATCH_INDEX]}-team-${match[DB_MATCH_WINNER] == 2 ? 1 : 2}`);
                    loser.classList.add("loser");
                    elMatch.querySelector(`#${match[DB_MATCH_GROUP]}-${match[DB_MATCH_ROUND]}-${match[DB_MATCH_INDEX]}-team-${match[DB_MATCH_WINNER]}`).classList.remove("loser");
                }
            }
        }
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        detectResize();
        loadBrackets();
        getTournamentElements();
        // Configure the vote update every 3 seconds
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            getScore();
            getVotes();
            getState();
            loadBrackets();
        }), 2000);
    });
}
function updateScore(scoreElement) {
    return __awaiter(this, void 0, void 0, function* () {
        let match = popup.getAttribute("data-match").split("-");
        if (scoreElement === score1) {
            var { _, error } = yield db
                .from(DB_MATCHES)
                .update({ t1_goals: Number(scoreElement.textContent) })
                .eq(DB_MATCH_GROUP, match[0])
                .eq(DB_MATCH_ROUND, Number(match[1]))
                .eq(DB_MATCH_INDEX, Number(match[3]));
        }
        else {
            var { _, error } = yield db
                .from(DB_MATCHES)
                .update({ t2_goals: Number(scoreElement.textContent) })
                .eq(DB_MATCH_GROUP, match[0])
                .eq(DB_MATCH_ROUND, Number(match[1]))
                .eq(DB_MATCH_INDEX, Number(match[3]));
        }
        if (error)
            console.error(error);
    });
}
function initAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        admin = true;
        // Prevent newline and non-number characters insertion on the score inputs on the popup
        function handleInput(scoreElement) {
            scoreElement.setAttribute("contenteditable", "true");
            scoreElement.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    scoreElement.blur();
                }
            });
            scoreElement.addEventListener("input", () => {
                let filteredText = scoreElement.textContent.replace(/[^0-9]/g, ""); // Keep only numbers
                if (scoreElement.textContent !== filteredText)
                    scoreElement.textContent = filteredText;
                // Max length = 3
                if (scoreElement.textContent.length > 3)
                    scoreElement.textContent = scoreElement.textContent.slice(0, 3);
            });
            scoreElement.addEventListener("blur", () => {
                updateScore(scoreElement);
            });
        }
        handleInput(score1);
        handleInput(score2);
        // Remove votes from the popup and add win buttons instead
        document.querySelector(".vote-bar").style.display = "none";
        document.querySelector(".admin-buttons").style.display = "flex";
    });
}
var adminIcon = document.getElementById("admin-icon");
adminIcon.addEventListener("click", () => {
    function login() {
        return __awaiter(this, void 0, void 0, function* () {
            var { value: password } = yield Swal.fire({
                input: "password",
                inputLabel: "Enter password:iLUgJ3UMB35H", // TODO - Remove password
                inputPlaceholder: "Password",
                inputAttributes: {
                    maxlength: "12",
                    autocapitalize: "off",
                    autocorrect: "off"
                }
            });
            if (password) {
                var { data, error } = yield db.rpc("check_admin_pass", { pass: password });
                if (error)
                    console.error(error);
                else {
                    if (data) {
                        console.log("Logged in");
                        adminIcon.style.opacity = "0.8";
                        adminIcon.style.pointerEvents = "none";
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
            }
        });
    }
    login();
});
function vote(team) {
    return __awaiter(this, void 0, void 0, function* () {
        let match = popup.getAttribute("data-match");
        var { _, _ } = yield db
            .from(DB_VOTES)
            .insert({ match: match, team: team });
        return true;
    });
}
team1Vote.addEventListener("click", () => {
    if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null)
        return;
    let voted = vote(1);
    if (voted) {
        localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "1");
        updatePopup();
        getVotes();
    }
});
team2Vote.addEventListener("click", () => {
    if (localStorage.getItem(`voted-${popup.getAttribute("data-match")}`) != null)
        return;
    let voted = vote(2);
    if (voted) {
        localStorage.setItem(`voted-${popup.getAttribute("data-match")}`, "2");
        updatePopup();
        getVotes();
    }
});
function setWinner(winner) {
    return __awaiter(this, void 0, void 0, function* () {
        let match = popup.getAttribute("data-match").split("-");
        var { _, error } = yield db
            .from(DB_MATCHES)
            .update({ winner: winner, state: "finished" })
            .eq(DB_MATCH_GROUP, match[0])
            .eq(DB_MATCH_ROUND, Number(match[1]))
            .eq(DB_MATCH_INDEX, Number(match[3]));
        if (error)
            console.log(error);
        popup.classList.remove("show");
    });
}
btnWin1.addEventListener(("click"), (e) => { setWinner(1); });
btnWin2.addEventListener(("click"), (e) => { setWinner(2); });
document.getElementById("github-icon").addEventListener("click", () => {
    window.open("https://github.com/Jorge-lopz/CeSports", "_github");
});
// Esc key press closes the popup
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (popup.classList.contains("show"))
            popup.classList.remove("show");
    }
});
init();
initAdmin();
