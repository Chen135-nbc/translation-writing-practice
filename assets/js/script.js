const pageStack = document.querySelector(".page-stack");
const welcomePage = document.querySelector(".welcome-page");

function enterHomePage() {
  pageStack.classList.add("is-entering");
}

welcomePage.addEventListener("click", enterHomePage);

welcomePage.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    enterHomePage();
  }
});
