const revisionInput = document.querySelector("#revision-input");
const revisionWordCount = document.querySelector("#revision-word-count");
const noteTitleInput = document.querySelector("#note-title-input");
const noteInput = document.querySelector("#note-input");
const noteTags = document.querySelector("#note-tags");
const saveState = document.querySelector("#detail-save-state");
const saveNote = document.querySelector("#save-note");
const clearNote = document.querySelector("#clear-note");
const resubmitRevision = document.querySelector("#resubmit-revision");
const message = document.querySelector("#detail-message");
const recordType = document.body.dataset.recordType;
const storagePrefix = `${recordType}-review`;

let saveTimer;

const submittedAnswer = localStorage.getItem(`${recordType}-answer`);
const storedRevision = localStorage.getItem(`${storagePrefix}-revision`);
const storedTitle = localStorage.getItem(`${storagePrefix}-note-title`);
const storedNote = localStorage.getItem(`${storagePrefix}-note-content`);
const storedTags = localStorage.getItem(`${storagePrefix}-note-tags`);

if (storedRevision) {
  revisionInput.value = storedRevision;
} else if (submittedAnswer) {
  revisionInput.value = submittedAnswer;
}
if (storedTitle) noteTitleInput.value = storedTitle;
if (storedNote) noteInput.value = storedNote;
if (storedTags) noteTags.value = storedTags;

function countWords(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function updateWordCount() {
  revisionWordCount.textContent = countWords(revisionInput.value);
}

function saveContent() {
  localStorage.setItem(`${storagePrefix}-revision`, revisionInput.value);
  localStorage.setItem(`${storagePrefix}-note-title`, noteTitleInput.value);
  localStorage.setItem(`${storagePrefix}-note-content`, noteInput.value);
  localStorage.setItem(`${storagePrefix}-note-tags`, noteTags.value);
  saveState.textContent = "内容已保存";
}

function queueSave() {
  saveState.textContent = "正在保存…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveContent, 450);
}

function showMessage(text) {
  message.textContent = text;
  message.classList.add("is-visible");
  setTimeout(() => message.classList.remove("is-visible"), 1800);
}

[revisionInput, noteTitleInput, noteInput, noteTags].forEach((field) => {
  field.addEventListener("input", () => {
    if (field === revisionInput) updateWordCount();
    queueSave();
  });
});

saveNote.addEventListener("click", () => {
  saveContent();
  showMessage("笔记已保存");
});

clearNote.addEventListener("click", () => {
  noteInput.value = "";
  noteInput.focus();
  queueSave();
});

resubmitRevision.addEventListener("click", () => {
  saveContent();
  showMessage("修改稿已再次提交");
});

updateWordCount();
