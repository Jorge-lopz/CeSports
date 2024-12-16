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
