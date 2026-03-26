const PASSWORD = "1234";
let students = [];
let selectedStudent = null;

const API_URL = "https://script.google.com/macros/s/AKfycbxTO6LSPXO8Dac1WrYb9P5xnBMFgee0FwHTEiXeR7G1jsbo1C60TdxWfX5pzeFCY7ue/exec";

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
async function submitScore() {
  if (!selectedStudent) return alert("請先選擇學生");
  
  const score = document.getElementById("score").value;
  const exam = localStorage.getItem("examName");

  try {
    // 使用 text/plain 可以繞過一些 CORS 的複雜限制
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        action: "submit",
        id: selectedStudent.id,
        score: score,
        exam: exam
      })
    });

    alert("已送出：" + selectedStudent.name);
    // 送出後清空輸入框，方便下一個學生
    document.getElementById("score").value = "";
  } catch (err) {
    console.error(err);
    alert("送出失敗");
  }
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