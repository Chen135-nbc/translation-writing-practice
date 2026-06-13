const defaultQueue = [
  {
    title: "reunite with their families",
    meta: "翻译 · 传统文化",
    prompt: "请使用 “reunite with their families” 完成一个与春节有关的英文句子。",
  },
  {
    title: "when used purposefully",
    meta: "写作 · 科技教育",
    prompt: "请使用 “when used purposefully” 表达数字工具可以提高学习效率。",
  },
  {
    title: "high-quality development",
    meta: "翻译 · 经济贸易",
    prompt: "请将“推动经济高质量发展”翻译成英文。",
  },
];

const storedQueue = JSON.parse(localStorage.getItem("note-review-queue") || "null");
const queue = storedQueue?.length ? storedQueue : defaultQueue;
const reviewCards = document.querySelector("#review-cards");
const questionText = document.querySelector("#question-text");
const conversation = document.querySelector("#conversation");
const answerForm = document.querySelector("#answer-form");
const practiceAnswer = document.querySelector("#practice-answer");
const nextQuestion = document.querySelector("#next-question");
const sessionProgress = document.querySelector("#session-progress");
const recordList = document.querySelector("#record-list");
const answeredCount = document.querySelector("#answered-count");
const correctCount = document.querySelector("#correct-count");
const sessionScore = document.querySelector("#session-score");
const sessionNote = document.querySelector("#session-note");
const saveSession = document.querySelector("#save-session");
const message = document.querySelector("#practice-message");

let currentIndex = 0;
let answered = 0;
let mastered = 0;
const records = [];

function renderQueue() {
  reviewCards.innerHTML = queue
    .map(
      (item, index) => `
        <article class="review-card ${index === currentIndex ? "is-active" : ""}" data-index="${index}">
          <small>${item.meta}</small>
          <strong>${item.title}</strong>
          <p>${item.prompt}</p>
        </article>
      `,
    )
    .join("");

  reviewCards.querySelectorAll(".review-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentIndex = Number(card.dataset.index);
      renderQuestion();
    });
  });
}

function renderQuestion() {
  questionText.textContent = queue[currentIndex].prompt;
  sessionProgress.textContent = `第 ${currentIndex + 1} / ${queue.length} 项`;
  renderQueue();
}

function appendMessage(role, text, feedback) {
  const item = document.createElement("article");
  item.className = `message ${role === "user" ? "user-message" : "ai-message"}`;
  item.innerHTML = `
    <span>${role === "user" ? "我" : "AI"}</span>
    <div><p>${text}</p>${feedback ? `<small>${feedback}</small>` : ""}</div>
  `;
  conversation.append(item);
  conversation.scrollTop = conversation.scrollHeight;
}

function updateRecord() {
  answeredCount.textContent = answered;
  correctCount.textContent = mastered;
  sessionScore.textContent = `${answered ? Math.round((mastered / answered) * 100) : 0} 分`;
  recordList.innerHTML = records
    .map(
      (record) => `
        <article class="record-item">
          <strong>${record.title}</strong>
          <span>${record.result} · ${record.answer}</span>
        </article>
      `,
    )
    .join("");
}

function showMessage(text) {
  message.textContent = text;
  message.classList.add("is-visible");
  setTimeout(() => message.classList.remove("is-visible"), 1800);
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = practiceAnswer.value.trim();
  if (!answer) return;

  const keyword = queue[currentIndex].title.toLowerCase();
  const isMastered = answer.toLowerCase().includes(keyword) || answer.length >= 35;
  const feedback = isMastered
    ? "表达完整，已经覆盖本条笔记的核心内容。"
    : "可以再补充完整语境，并尽量使用笔记中的核心表达。";

  appendMessage("user", answer);
  appendMessage("ai", isMastered ? "这一题掌握得不错。" : "这条表达还需要再巩固。", feedback);

  answered += 1;
  if (isMastered) mastered += 1;
  records.push({
    title: queue[currentIndex].title,
    answer,
    result: isMastered ? "已掌握" : "待巩固",
  });
  updateRecord();
  practiceAnswer.value = "";
  currentIndex = (currentIndex + 1) % queue.length;
  renderQuestion();
});

nextQuestion.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % queue.length;
  renderQuestion();
});

saveSession.addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("note-practice-history") || "[]");
  history.push({
    createdAt: new Date().toISOString(),
    answered,
    mastered,
    note: sessionNote.value.trim(),
    records,
  });
  localStorage.setItem("note-practice-history", JSON.stringify(history));
  showMessage("练习记录已保存");
});

renderQuestion();
updateRecord();
