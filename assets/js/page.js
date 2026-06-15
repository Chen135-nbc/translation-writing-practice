document.querySelectorAll(".level-tab, .topic-option").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.parentElement;
    group.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("is-selected", item === button);
    });
  });
});
