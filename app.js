const PASSWORD = "1234";
let students = [];
let selectedStudent = null;

const API_URL = "👉填入你的Apps Script網址";

// 🔐 登入
function checkPassword() {
  const input = document.getElementById("pwd").value;
  if (input === PASSWORD) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadStudents();
    loadExamName();
  } else {
    alert("密碼錯誤");
  }
}

// 📥 載入學生資料（從 Google Sheets）
async function loadStudents() {
  const res = await fetch(API_URL + "?action=getStudents");
  students = await res.json();
}

// 🏷️ 設定考試名稱
function setExamName() {
  const name = document.getElementById("examName").value;
  localStorage.setItem("examName", name);
  document.getElementById("examName").disabled = true;
}

// 🔒 載入考試名稱
function loadExamName() {
  const name = localStorage.getItem("examName");
  if (name) {
    document.getElementById("examName").value = name;
    document.getElementById("examName").disabled = true;
  }
}

// 🔍 搜尋
function doSearch() {
  const keyword = document.getElementById("search").value;
  const results = students.filter(s =>
    s.name.includes(keyword) || s.dept.includes(keyword)
  );

  const list = document.getElementById("results");
  list.innerHTML = "";

  results.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.id} ${s.name} ${s.dept}`;
    li.onclick = () => selectStudent(s);
    list.appendChild(li);
  });
}

// 🎯 選擇學生
function selectStudent(student) {
  selectedStudent = student;
  document.getElementById("selected").innerText =
    `已選擇：${student.name}`;
}

// 📤 送出成績
async function submitScore() {
  const score = document.getElementById("score").value;
  const exam = localStorage.getItem("examName");

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "submit",
      id: selectedStudent.id,
      score: score,
      exam: exam
    })
  });

  alert("已送出");
}

// ✅ 全部完成
async function finishAll() {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "finish"
    })
  });

  alert("全部完成！");
}