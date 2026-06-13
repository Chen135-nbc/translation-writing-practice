const filterState = {
  type: "all",
  level: "all",
  topic: "all",
  search: "",
};

const notes = [...document.querySelectorAll(".archive-note")];
const resultCount = document.querySelector("#result-count");
const emptyResult = document.querySelector("#empty-result");
const searchInput = document.querySelector("#note-search");
const topicOptions = document.querySelector("#topic-options");
const customTopicInput = document.querySelector("#custom-topic-input");
const addCustomTopic = document.querySelector("#add-custom-topic");
const reviewList = document.querySelector("#review-list");
const reviewTotal = document.querySelector("#review-total");
const reviewTarget = document.querySelector("#review-target");
const progressBar = document.querySelector("#review-progress-bar");
const startReview = document.querySelector("#start-review");
const message = document.querySelector("#note-message");

function applyFilters() {
  let visible = 0;

  notes.forEach((note) => {
    const text = note.textContent.toLowerCase();
    const matches =
      (filterState.type === "all" || note.dataset.type === filterState.type) &&
      (filterState.level === "all" || note.dataset.level === filterState.level) &&
      (filterState.topic === "all" || note.dataset.topic === filterState.topic) &&
      (!filterState.search || text.includes(filterState.search));

    note.hidden = !matches;
    if (matches) visible += 1;
  });

  resultCount.textContent = `${visible} 条笔记`;
  emptyResult.hidden = visible !== 0;
}

function selectFilter(group, button) {
  group.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("is-selected", item === button);
  });
  filterState[group.dataset.filter] = button.dataset.value;
}

function updateReviewTotal() {
  const total = reviewList.children.length;
  reviewTotal.textContent = `${total} 项`;
  reviewTarget.textContent = total;
}

function showMessage(text) {
  message.textContent = text;
  message.classList.add("is-visible");
  setTimeout(() => message.classList.remove("is-visible"), 1800);
}

document.querySelectorAll(".filter-options").forEach((group) => {
  group.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => selectFilter(group, button));
  });
});

document.querySelector("#apply-filters").addEventListener("click", () => {
  filterState.search = searchInput.value.trim().toLowerCase();
  applyFilters();
});

searchInput.addEventListener("input", () => {
  filterState.search = searchInput.value.trim().toLowerCase();
  applyFilters();
});

document.querySelector("#reset-filters").addEventListener("click", () => {
  filterState.type = "all";
  filterState.level = "all";
  filterState.topic = "all";
  filterState.search = "";
  customTopicInput.value = "";
  searchInput.value = "";
  document.querySelectorAll(".filter-options").forEach((group) => {
    group.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.value === "all");
    });
  });
  applyFilters();
});

function createCustomTopic() {
  const value = customTopicInput.value.trim();
  if (!value) return;

  const existing = [...topicOptions.querySelectorAll("button")].find(
    (button) => button.dataset.value === value,
  );
  const button = existing || document.createElement("button");

  if (!existing) {
    button.type = "button";
    button.dataset.value = value;
    button.textContent = value;
    button.addEventListener("click", () => {
      selectFilter(topicOptions, button);
      applyFilters();
    });
    topicOptions.append(button);
  }

  selectFilter(topicOptions, button);
  customTopicInput.value = "";
  applyFilters();
}

addCustomTopic.addEventListener("click", createCustomTopic);

customTopicInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    createCustomTopic();
  }
});

document.querySelectorAll("[data-review]").forEach((button) => {
  button.addEventListener("click", () => {
    const note = button.closest(".archive-note");
    const item = document.createElement("article");
    item.innerHTML = `
      <span>${String(reviewList.children.length + 1).padStart(2, "0")}</span>
      <div><strong>${note.querySelector("h3").textContent}</strong><small>${note.querySelector("header span").textContent}</small></div>
    `;
    reviewList.append(item);
    updateReviewTotal();
    button.textContent = "已加入";
    button.disabled = true;
    showMessage("已加入今日复习");
  });
});

startReview.addEventListener("click", () => {
  const total = reviewList.children.length;
  if (!total) {
    showMessage("请先加入需要复习的笔记");
    return;
  }
  const queue = [...reviewList.querySelectorAll("article")].map((item) => {
    const title = item.querySelector("strong").textContent;
    const meta = item.querySelector("small").textContent;
    return {
      title,
      meta,
      prompt: `请围绕“${title}”完成一个英文表达，并说明它适合使用的语境。`,
    };
  });
  localStorage.setItem("note-review-queue", JSON.stringify(queue));
  window.location.href = "./note-practice.html";
});

applyFilters();
updateReviewTotal();
