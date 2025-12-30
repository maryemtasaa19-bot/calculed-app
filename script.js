// ================== DATA ==================
const STORAGE_KEY = "idadi_data";

const baseSubjects = {
  "1": ["اللغة العربية", "اللغة الفرنسية", "الرياضيات", "الفيزياء", "الاجتماعيات", "التربية الإسلامية", "الرياضة"],
  "2": ["اللغة العربية", "اللغة الفرنسية", "الرياضيات", "الفيزياء", "الاجتماعيات", "التربية الإسلامية", "الرياضة"],
  "3": ["اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "الرياضيات", "الفيزياء", "علوم الحياة والأرض", "الاجتماعيات", "التربية الإسلامية", "الرياضة"]
};

const optionalSubjects = [
  "المعلوميات",
  "التكنولوجيا",
  "التربية الموسيقية",
  "التربية التشكيلية",
  "التربية الأسرية",
  "اللغة الألمانية",
  "اللغة الإسبانية",
  "اللغة الإيطالية",
  "اللغة الهولندية"
];

// ================== HELPERS ==================
function getNumberOfTests(subject) {
  if (subject === "الرياضيات") return 3;
  if (subject === "الفيزياء") return 3;
  if (subject === "اللغة الفرنسية") return 4;
  if (subject === "الرياضة") return 3;
  return 2;
}

function hasActivities(subject) {
  return subject !== "الرياضة" && subject !== "الرياضيات";
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// ================== STATE ==================
let appData = loadData();
let selectedLevel = null;
let selectedTerm = null;
let subjects = [];

// ================== UI LOGIC ==================
function startApp(level, term) {
  selectedLevel = level;
  selectedTerm = term;
  subjects = [...baseSubjects[level]];

  if (appData.optional) {
    subjects.push(...appData.optional);
  }

  renderSubjects();
}

function openOptionalSubjects() {
  const container = document.getElementById("content");
  container.innerHTML = "<h3>اختر المواد الفرعية</h3>";

  optionalSubjects.forEach(sub => {
    container.innerHTML += `
      <label>
        <input type="checkbox" value="${sub}" ${appData.optional?.includes(sub) ? "checked" : ""}>
        ${sub}
      </label><br>
    `;
  });

  container.innerHTML += `
    <button onclick="saveOptional()">OK</button>
    <button onclick="renderSubjects()">رجوع</button>
  `;
}

function saveOptional() {
  const checked = [...document.querySelectorAll("input[type=checkbox]:checked")].map(i => i.value);
  appData.optional = checked;
  saveData(appData);
  startApp(selectedLevel, selectedTerm);
}

function renderSubjects() {
  const container = document.getElementById("content");
  container.innerHTML = "";

  subjects.forEach(sub => {
    container.innerHTML += `<h4>${sub}</h4>`;

    const tests = getNumberOfTests(sub);
    for (let i = 1; i <= tests; i++) {
      container.innerHTML += `<input type="number" placeholder="فرض ${i}" id="${sub}_t${i}"><br>`;
    }

    if (hasActivities(sub)) {
      container.innerHTML += `<input type="number" placeholder="الأنشطة" id="${sub}_act"><br>`;
    }

    container.innerHTML += "<hr>";
  });

  container.innerHTML += `
    <button onclick="calculate()">حساب المعدل</button>
    <button onclick="openOptionalSubjects()">إضافة مواد فرعية</button>
    <h3 id="result"></h3>
  `;
}

function calculate() {
  let total = 0;
  let count = 0;

  subjects.forEach(sub => {
    let sum = 0;
    let n = getNumberOfTests(sub);

    for (let i = 1; i <= n; i++) {
      sum += Number(document.getElementById(`${sub}_t${i}`)?.value || 0);
    }

    if (hasActivities(sub)) {
      sum += Number(document.getElementById(`${sub}_act`)?.value || 0);
      n += 1;
    }

    const avg = sum / n;
    total += avg;
    count++;
  });

  const finalAvg = (total / count).toFixed(2);
  document.getElementById("result").innerText = "المعدل: " + finalAvg;
}
