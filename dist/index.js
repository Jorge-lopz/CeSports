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
matches.forEach((match) => {
    match.addEventListener("click", () => {
        popup.classList.add("show");
    });
});
popupBg.addEventListener("click", () => {
    popup.classList.remove("show");
});
function init() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function initAdmin() {
    return __awaiter(this, void 0, void 0, function* () { });
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
