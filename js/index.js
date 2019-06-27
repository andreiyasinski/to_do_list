var addButton = document.getElementById("add");
var prioritySelector = document.getElementById("select");
var inputTask = document.getElementById("new-task");
var description = document.getElementById("description");
var unfinishedTasks = document.getElementById("unfinished-tasks");
var finishedTasks = document.getElementById("finished-tasks");
var addForm = document.getElementById("add-form");

var editFormText = document.getElementById("edit-form-text");
var editFormSelect = document.getElementById("edit-form-select");
var editFormDescription = document.getElementById("edit-form-description");
var editFormSave = document.getElementById("edit-form-save");

var editingTask;

function createNewElement(task, isFinished, priorityValue, descriptionText) {
  var listItem = document.createElement("li");
  var checkbox = document.createElement("button");
  listItem.className = "list-item"
  
  checkbox.className = "material-icons checkbox";
  //finished ? checkbox.innerHTML = "<i class='material-icons'>check_box</i>" : checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
  checkbox.innerHTML = isFinished ?  "<i class='material-icons'>check_box</i>" : "<i class='material-icons'>check_box_outline_blank</i>";
  
  var label = document.createElement("label");
  label.innerText = task;
  // var input = document.createElement("input");
  // input.type = "text";
  var textarea = document.createElement("textarea");
  textarea.innerText = descriptionText;
  textarea.id = "taskDesc";
  textarea.rows = "5";
  textarea.style.display = "none";
  var priority = document.createElement("div");
  priority.className = "priority";
  priority.style.background = priorityValue;
  var editButton = document.createElement("button");
  editButton.className = "material-icons edit";
  editButton.innerHTML = "<i class='material-icons'>edit</i>";
  var deleteButton = document.createElement("button");
  deleteButton.className = "material-icons delete";
  deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

  listItem.appendChild(checkbox);
  listItem.appendChild(label);
  // listItem.appendChild(input);
  listItem.appendChild(textarea);
  listItem.appendChild(priority);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

function addTask(e) {
  e.preventDefault();
  if(inputTask.value.trim()) {
    var color = prioritySelector.value;
    var listItem = createNewElement(inputTask.value.trim(), false, color, description.value);
    //unfinishedTasks.appendChild(listItem);
    unfinishedTasks.insertBefore(listItem, unfinishedTasks.firstChild);
    bindTaskEvents(listItem, finishTask);
    inputTask.value = "";
    description.value = "";
  }
  save();
};

addForm.addEventListener("submit", addTask);

function deleteTask() {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);
  save();
};

function editTask() {
  //var editButton = this;
  showEditForm("block");
  editingTask = this.parentNode;
  var listItem = this.parentNode;
  var label = listItem.querySelector("label");

  var textarea = listItem.querySelector("textarea");
  var priority = listItem.querySelector(".priority");

  //var input = listItem.querySelector("input[type=text]");
  //var containsClass = listItem.classList.contains("editMode");

  editFormText.value = label.innerText;
  editFormDescription.value = textarea.value;

  // for (let i = 0; i < editFormSelect.children.length; i++) {
  //   if(editFormSelect.children[i].value == priority.style.background) {
  //     editFormSelect.children[i].selected = true;
  //   }
  // }

  editFormSelect.value = priority.style.background;
  
  // if(containsClass) {
  //   label.innerText = input.value;
  //   editButton.className = "materials-icons edit";
  //   editButton.innerHTML = "<i class='material-icons'>edit</i>"
  //   save();
  // } else {
  //   input.value = label.innerText;
  //   editButton.className = "materials-icons save";
  //   editButton.innerHTML = "<i class='material-icons'>save</i>";
  // }

  // listItem.classList.toggle("editMode");
};

function showEditForm(state) {
  document.getElementById("edit-form-wrapper").style.display = state;
}

function saveTask(e) {
  e.preventDefault();
  if(editingTask) {
    var label = editingTask.querySelector("label");
    var textarea = editingTask.querySelector("textarea");
    var priority = editingTask.querySelector(".priority");
    label.innerText = editFormText.value;
    textarea.value = editFormDescription.value;
    priority.style.background = editFormSelect.value;
    showEditForm("none");
    save();
  }
}

editFormSave.addEventListener("click", saveTask)

function finishTask() {
  var listItem = this.parentNode;
  var checkbox = listItem.querySelector("button.checkbox");
  checkbox.className = "material-icons checkbox";
  checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
  //finishedTasks.appendChild(listItem);
  checkbox.removeEventListener('click', finishTask)
  finishedTasks.insertBefore(listItem, finishedTasks.firstChild);
  bindTaskEvents(listItem, unfinishTask);
  save();
};

function unfinishTask() {
  var listItem = this.parentNode;
  var checkbox = listItem.querySelector("button.checkbox");
  checkbox.className = "material-icons checkbox";
  checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
  checkbox.removeEventListener('click', unfinishTask)
  unfinishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, finishTask);
  save();
};

function bindTaskEvents(listItem, checkboxEvent) {
  var checkbox = listItem.querySelector("button.checkbox")
  var editButton = listItem.querySelector("button.edit")
  var deleteButton = listItem.querySelector("button.delete");

  checkbox.addEventListener("click", checkboxEvent);
  editButton.addEventListener("click", editTask);
  deleteButton.addEventListener("click", deleteTask);

  // checkbox.onclick = checkboxEvent;
  // editButton.onclick = editTask;
  // deleteButton.onclick = deleteTask;
};

function save() {
  var unfinishedTasksArr = [];
  var finishedTasksArr = [];

  for (var i = 0; i < unfinishedTasks.children.length; i++) {
    unfinishedTasksArr.push(
      {
        label: unfinishedTasks.children[i].getElementsByTagName("label")[0].innerText,
        color: unfinishedTasks.children[i].getElementsByClassName("priority")[0].style.background,
        isFinished: false,
        taskDesc: unfinishedTasks.children[i].getElementsByTagName("textarea")[0].value
      }
    );
  }

  for (var i = 0; i < finishedTasks.children.length; i++) {
    finishedTasksArr.push(
      {
        label: finishedTasks.children[i].getElementsByTagName("label")[0].innerText,
        color: finishedTasks.children[i].getElementsByClassName("priority")[0].style.background,
        isFinished: true,
        taskDesc: finishedTasks.children[i].getElementsByTagName("textarea")[0].value
      }
    );
  }

  localStorage.removeItem("todo");

  localStorage.setItem("todo", JSON.stringify({
    unfinishedItems: unfinishedTasksArr,
    finishedItems: finishedTasksArr
  }));
}

function load() {
  return JSON.parse(localStorage.getItem("todo"));
}

var data = load();

data.unfinishedItems.forEach(item => {
  var listItem = createNewElement(item.label, item.isFinished, item.color, item.taskDesc);
  unfinishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, finishTask);
  // console.log(listItem);
});

data.finishedItems.forEach(item => {
  var listItem = createNewElement(item.label, item.isFinished, item.color, item.taskDesc);
  finishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, unfinishTask);
});