const body = document.body;
const themeBtn = document.getElementById("themeBtn");
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const clearAll = document.getElementById("clearAll");

body.classList.add("light");


themeBtn.addEventListener("click", () => {
  const isLight = body.classList.toggle("dark");
  body.classList.toggle("light", !isLight);
  themeBtn.textContent = isLight ? "☀️" : "🌙";
});


function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text").innerText,
      completed: li.querySelector(".task-text").classList.contains("completed")
    });
  });
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  tasks.forEach(task => createTask(task.text, task.completed));
}

loadTasks();

/* CREATE TASK */
function createTask(text, completed = false) {
  const li = document.createElement("li");

  li.innerHTML = `
    <div class="task-left">
      <span class="check">✔️</span>
      <span class="task-text">${text}</span>
    </div>
    <span class="delete">🗑️</span>
  `;

  const taskText = li.querySelector(".task-text");

  if (completed) taskText.classList.add("completed");

  li.querySelector(".check").addEventListener("click", () => {
    taskText.classList.toggle("completed");
    saveTasks();
  });

  li.querySelector(".delete").addEventListener("click", () => {
    li.style.opacity = "0";
    li.style.transform = "translateX(-20px)";
    setTimeout(() => {
      li.remove();
      saveTasks();
    }, 200);
  });

  list.appendChild(li);
  saveTasks();
}


addBtn.addEventListener("click", () => {
  if (input.value.trim() !== "") {
    createTask(input.value.trim());
    input.value = "";
  }
});


input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    createTask(input.value.trim());
    input.value = "";
  }
});


filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");

    const type = btn.dataset.filter;
    const items = document.querySelectorAll("li");

    items.forEach(li => {
      const isComplete = li.querySelector(".task-text").classList.contains("completed");

      if (type === "all") li.style.display = "flex";
      if (type === "pending") li.style.display = isComplete ? "none" : "flex";
      if (type === "completed") li.style.display = isComplete ? "flex" : "none";
    });
  });
});


clearAll.addEventListener("click", () => {
  list.innerHTML = "";
  saveTasks();
});
