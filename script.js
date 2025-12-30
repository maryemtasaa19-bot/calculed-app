const noActivity = ["الرياضيات", "الرياضة"];

// عدد الفروض حسب المادة والمستوى
function getTestsCount(subject, level) {
  if (subject === "اللغة الفرنسية") return 4;
  if (subject === "الفيزياء") return 3;
  if (subject === "الرياضيات") return 3;

  if (subject === "الاجتماعيات") {
    if (level === "3") return 2;
    return 3;
  }

  return 2;
}

// المواد الأساسية حسب المستوى
const ccSubjects = {
  1: ["الرياضيات","اللغة العربية","اللغة الفرنسية","الاجتماعيات","العلوم","الفيزياء","التربية الإسلامية","الرياضة"],
  2: ["الرياضيات","اللغة العربية","اللغة الفرنسية","اللغة الإنجليزية","الاجتماعيات","العلوم","الفيزياء","التربية الإسلامية","الرياضة"],
  3: ["الرياضيات","اللغة العربية","اللغة الفرنسية","اللغة الإنجليزية","الفيزياء","علوم الحياة والأرض","الاجتماعيات","التربية الإسلامية"]
};

// المواد الفرعية
const optionalSubjectsList = [
  "التكنولوجيا",
  "المعلوميات",
  "التربية الموسيقية",
  "التربية التشكيلية",
  "التربية الأسرية",
  "ألمانية",
  "إسبانية",
  "إيطالية",
  "هولندية"
];

// المعاملات للامتحانات الجهوية
const regionalCoefs = {
  "اللغة العربية":3,
  "اللغة الفرنسية":3,
  "الرياضيات":3,
  "الفيزياء":1,
  "علوم الحياة والأرض":1,
  "الاجتماعيات":1,
  "التربية الإسلامية":1
};

// العناصر
const level = document.getElementById("level");
const term = document.getElementById("term");
const examType = document.getElementById("examType");
const subjectsDiv = document.getElementById("subjects");
const result = document.getElementById("result");

// قائمة المواد الفرعية المضافة
let addedOptionalSubjects = [];

// حالة الواجهة: "points" أو "optional"
let currentView = "points";

// زر إضافة مادة فرعية
const addBtn = document.createElement("button");
addBtn.textContent = "➕ إضافة مادة فرعية";
addBtn.onclick = showOptionalView;
subjectsDiv.parentNode.insertBefore(addBtn, subjectsDiv);

// زر رجوع
const backBtn = document.createElement("button");
backBtn.textContent = "↩️ رجوع لتعديل النقاط";
backBtn.onclick = () => {
  currentView = "points";
  refreshSubjects();
};
subjectsDiv.parentNode.insertBefore(backBtn, subjectsDiv);

// أي تغيير المستوى أو الدورة
level.onchange = term.onchange = () => {
  addedOptionalSubjects = [];
  refreshSubjects();
};

// تغيير نوع الامتحان
examType.onchange = refreshSubjects;

// تجديد عرض المواد حسب الحالة
function refreshSubjects() {
  subjectsDiv.innerHTML = "";
  result.textContent = "";

  if (!level.value || !term.value) return;

  // إظهار examType فقط في الثالثة
  if (level.value === "3") {
    examType.classList.remove("hidden");
  } else {
    examType.classList.add("hidden");
    examType.value = "cc";
  }

  if (currentView === "points") {
    loadSubjects();
  } else if (currentView === "optional") {
    loadOptionalSelection();
  }
}

// إنشاء مدخلات المواد الأساسية + الفرعية
function loadSubjects() {
  const type = examType.value || "cc";
  const levelValue = level.value;

  // المراقبة المستمرة
  if (type === "cc") {
    ccSubjects[levelValue].forEach(name => createSubjectInputs(name, levelValue));
    addedOptionalSubjects.forEach(name => createSubjectInputs(name, levelValue, true));
  }

  // الامتحان المحلي
  if (type === "local") {
    ccSubjects[levelValue].forEach(name => createSubjectInputs(name, levelValue));
    addedOptionalSubjects.forEach(name => createSubjectInputs(name, levelValue, true));
  }

  // الامتحان الجهوي
  if (type === "regional") {
    Object.keys(regionalCoefs).forEach(name => {
      const div = document.createElement("div");
      div.className = "subject";
      div.dataset.name = name;
      div.innerHTML = `<b>${name}</b><input type="number" placeholder="النقطة">`;
      subjectsDiv.appendChild(div);
    });
  }

  loadData(); // استعادة النقاط المحفوظة بعد إنشاء المدخلات
}

// إنشاء مدخلات مادة واحدة
function createSubjectInputs(name, levelValue, isOptional=false) {
  const div = document.createElement("div");
  div.className = "subject";
  div.dataset.name = name;

  let html = `<b>${name}${isOptional ? " (فرعية)" : ""}</b>`;
  const tests = getTestsCount(name, levelValue);
  for (let i = 1; i <= tests; i++) {
    html += `<input type="number" placeholder="فرض ${i}">`;
  }

  if (!noActivity.includes(name)) {
    html += `<input type="number" placeholder="الأنشطة">`;
  }

  div.innerHTML = html;
  subjectsDiv.appendChild(div);
}

// عرض واجهة اختيار المواد الفرعية
function loadOptionalSelection() {
  const div = document.createElement("div");
  div.className = "optional-selection";

  let html = "<b>اختر المواد الفرعية التي تريد إضافتها:</b><br><br>";
  optionalSubjectsList.forEach(sub => {
    const checked = addedOptionalSubjects.includes(sub) ? "checked" : "";
    html += `<label><input type="checkbox" value="${sub}" ${checked}> ${sub}</label><br>`;
  });

  html += `<br><button id="okOptional">✅ موافق</button>`;
  div.innerHTML = html;
  subjectsDiv.appendChild(div);

  document.getElementById("okOptional").onclick = () => {
    // تحديث المواد الفرعية المضافة
    const checkboxes = div.querySelectorAll("input[type=checkbox]");
    addedOptionalSubjects = [];
    checkboxes.forEach(cb => { if(cb.checked) addedOptionalSubjects.push(cb.value); });

    // العودة لواجهة النقاط
    currentView = "points";
    refreshSubjects();
    saveData(); // حفظ تلقائي بعد اختيار المواد الفرعية
  };
}

// إظهار واجهة اختيار المواد الفرعية
function showOptionalView() {
  currentView = "optional";
  refreshSubjects();
}

// الحساب
document.getElementById("calc").onclick = () => {
  let sum = 0, coefSum = 0;

  document.querySelectorAll(".subject").forEach(div => {
    const name = div.dataset.name;
    const inputs = div.querySelectorAll("input");
    let s = 0;
    inputs.forEach(i => s += Number(i.value || 0));

    let avg = s / inputs.length;
    let coef = (examType.value === "regional") ? (regionalCoefs[name] || 1) : 1;

    sum += avg * coef;
    coefSum += coef;
  });

  if (coefSum === 0) {
    result.textContent = "⚠️ أدخل النقط أولاً";
    return;
  }

  result.textContent = "المعدل: " + (sum / coefSum).toFixed(2);

  saveData(); // حفظ تلقائي بعد الحساب
};

// 🔹 الحفظ المحلي: حفظ واسترجاع البيانات
function saveData() {
  const data = {
    level: level.value,
    term: term.value,
    examType: examType.value,
    addedOptionalSubjects,
    subjects: []
  };

  document.querySelectorAll(".subject").forEach(div => {
    const name = div.dataset.name;
    const inputs = Array.from(div.querySelectorAll("input")).map(i => i.value);
    data.subjects.push({name, inputs});
  });

  localStorage.setItem("schoolData", JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("schoolData"));
  if (!data) return;

  level.value = data.level;
  term.value = data.term;
  examType.value = data.examType || "cc";
  addedOptionalSubjects = data.addedOptionalSubjects || [];

  // تعبئة النقاط
  if(data.subjects){
    data.subjects.forEach(sub => {
      const div = document.querySelector(`.subject[data-name="${sub.name}"]`);
      if(div){
        const inputs = div.querySelectorAll("input");
        inputs.forEach((i, idx) => {
          i.value = sub.inputs[idx] || "";
        });
      }
    });
  }
}

// حفظ تلقائي عند إدخال أي نقطة
subjectsDiv.addEventListener("input", saveData);

// استعادة البيانات عند تحميل الصفحة
window.addEventListener("load", loadData);
