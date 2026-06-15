const answerInput = document.querySelector("#answer-input");
const draftInput = document.querySelector("#draft-input");
const wordCount = document.querySelector("#word-count");
const saveState = document.querySelector("#save-state");
const timerDisplay = document.querySelector("#timer-display");
const timerToggle = document.querySelector("#timer-toggle");
const draftMode = document.querySelector("#draft-mode");
const draftCard = document.querySelector(".draft-card");
const clearDraft = document.querySelector("#clear-draft");
const submitAnswer = document.querySelector("#submit-answer");
const submitMessage = document.querySelector("#submit-message");
const practiceBody = document.body;
const answerKey = practiceBody.dataset.answerKey;
const draftKey = practiceBody.dataset.draftKey;
const submitUrl = practiceBody.dataset.submitUrl;

let elapsedSeconds = 0;
let timerRunning = true;
let saveTimer;

answerInput.value = localStorage.getItem(answerKey) || "";
draftInput.value = localStorage.getItem(draftKey) || "";

function countWords(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function updateWordCount() {
  wordCount.textContent = countWords(answerInput.value);
}

function queueSave() {
  saveState.textContent = "正在保存…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(answerKey, answerInput.value);
    localStorage.setItem(draftKey, draftInput.value);
    saveState.textContent = "草稿已保存";
  }, 450);
}

function renderTimer() {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timerDisplay.dateTime = `PT${minutes}M${seconds}S`;
}

setInterval(() => {
  if (timerRunning) {
    elapsedSeconds += 1;
    renderTimer();
  }
}, 1000);

answerInput.addEventListener("input", () => {
  updateWordCount();
  queueSave();
});

draftInput.addEventListener("input", queueSave);

timerToggle.addEventListener("click", () => {
  timerRunning = !timerRunning;
  timerToggle.textContent = timerRunning ? "暂停" : "继续";
});

draftMode.addEventListener("change", () => {
  draftCard.classList.toggle("is-handwriting", draftMode.checked);
});

clearDraft.addEventListener("click", () => {
  draftInput.value = "";
  localStorage.removeItem(draftKey);
  draftInput.focus();
});

submitAnswer.addEventListener("click", () => {
  localStorage.setItem(answerKey, answerInput.value);
  saveState.textContent = "译文已提交";
  submitMessage.classList.add("is-visible");
  setTimeout(() => {
    window.location.href = submitUrl;
  }, 500);
});

updateWordCount();
renderTimer();
