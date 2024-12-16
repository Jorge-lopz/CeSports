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
const logosContainer = document.querySelector(".logos-container");
const score1 = document.getElementById("team-1-score");
let score1Text = "";
const score2 = document.getElementById("team-2-score");
let score2Text = "";
matches.forEach((match) => {
    match.addEventListener("click", () => {
        popup.classList.add("show");
        const elImages = logosContainer.querySelectorAll(".team-logo");
        const matchImages = match.querySelectorAll(".team-logo");
        const elNames = logosContainer.querySelectorAll(".team-name");
        const matchNames = match.querySelectorAll(".team-name");
        elImages.forEach((element, idx) => {
            var _a, _b, _c;
            const teamImage = (_a = matchImages[idx]) === null || _a === void 0 ? void 0 : _a.getAttribute("src").trim();
            const teamName = (_c = (_b = matchNames[idx]) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim();
            if (teamImage && teamName) {
                element.setAttribute("src", `${teamImage}`);
                elNames[idx].textContent = `${teamName}`;
            }
            else {
                console.error(`No se encontró texto para el índice ${idx}`);
            }
        });
    });
});
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
    login(prompt("Inserte contraseña:", "Contraseña"));
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
init();
initAdmin();
