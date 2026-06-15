const form = document.querySelector("#question-form");
const typeInputs = document.querySelectorAll('input[name="type"]');
const levelInput = document.querySelector("#question-level");
const durationInput = document.querySelector("#question-duration");
const contentLabel = document.querySelector("#content-label");
const contentInput = document.querySelector("#question-content");
const referenceLabel = document.querySelector("#reference-label");
const referenceInput = document.querySelector("#question-reference");
const preview = document.querySelector("#configuration-preview");
const total = document.querySelector("#question-total");
const message = document.querySelector("#question-message");

function getQuestionBank() {
  try {
    return JSON.parse(localStorage.getItem("custom-question-bank")) || [];
  } catch {
    return [];
  }
}

function getSelectedType() {
  return document.querySelector('input[name="type"]:checked').value;
}

function updateFormMode() {
  const isTranslation = getSelectedType() === "translation";
  contentLabel.textContent = isTranslation ? "中文原文" : "写作要求";
  contentInput.placeholder = isTranslation
    ? "输入需要翻译的中文原文……"
    : "输入英文写作题目、Directions 或写作要求……";
  referenceLabel.textContent = isTranslation ? "参考译文" : "参考范文";
  referenceInput.placeholder = isTranslation
    ? "输入参考译文，可暂时留空……"
    : "输入参考范文，可暂时留空……";
  updatePreview();
}

function updatePreview() {
  const type = getSelectedType() === "translation" ? "翻译" : "写作";
  const level = levelInput.options[levelInput.selectedIndex].text;
  preview.textContent = `${type} · ${level} · ${durationInput.value || 0} 分钟`;
}

function updateTotal() {
  total.textContent = `已添加 ${getQuestionBank().length} 题`;
}

function showMessage(text) {
  message.textContent = text;
  message.classList.add("is-visible");
  setTimeout(() => message.classList.remove("is-visible"), 1800);
}

typeInputs.forEach((input) => input.addEventListener("change", updateFormMode));
levelInput.addEventListener("change", updatePreview);
durationInput.addEventListener("input", updatePreview);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const bank = getQuestionBank();
  const question = {
    id: crypto.randomUUID ? crypto.randomUUID() : `question-${Date.now()}`,
    type: data.get("type"),
    level: data.get("level"),
    title: data.get("title").trim(),
    topic: data.get("topic").trim(),
    content: data.get("content").trim(),
    reference: data.get("reference").trim(),
    durationMinutes: Number(data.get("duration")),
    score: Number(data.get("score")),
    difficulty: data.get("difficulty"),
    createdAt: new Date().toISOString(),
  };

  bank.push(question);
  localStorage.setItem("custom-question-bank", JSON.stringify(bank));
  form.reset();
  document.querySelector('input[name="type"][value="translation"]').checked = true;
  levelInput.value = "CET6";
  durationInput.value = "15";
  document.querySelector("#question-score").value = "100";
  document.querySelector("#question-difficulty").value = "intermediate";
  updateFormMode();
  updateTotal();
  showMessage("题目已添加到本地题库");
  document.querySelector("#question-title").focus();
});

updateFormMode();
updateTotal();
