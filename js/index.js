var addButton = document.getElementById("add");
var inputTask = document.getElementById("new-task");
var unfinishedTasks = document.getElementById("unfinished-tasks");
var finishedTasks = document.getElementById("finished-tasks");

function createNewElement(task, finished) {
  var listItem = document.createElement("li");
  var checkbox = document.createElement("button");
  listItem.className = "list-item"
  
  checkbox.className = "material-icons checkbox";
  //finished ? checkbox.innerHTML = "<i class='material-icons'>check_box</i>" : checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
  checkbox.innerHTML = finished ?  "<i class='material-icons'>check_box</i>" : "<i class='material-icons'>check_box_outline_blank</i>";
  
  var label = document.createElement("label");
  label.innerText = task;
  var input = document.createElement("input");
  input.type = "text";
  var editButton = document.createElement("button");
  editButton.className = "material-icons edit";
  editButton.innerHTML = "<i class='material-icons'>edit</i>";
  var deleteButton = document.createElement("button");
  deleteButton.className = "material-icons delete";
  deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

  listItem.appendChild(checkbox);
  listItem.appendChild(label);
  listItem.appendChild(input);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

function addTask() {
  if(inputTask.value.trim()) {
    var listItem = createNewElement(inputTask.value.trim(), false);
    //unfinishedTasks.appendChild(listItem);
    unfinishedTasks.insertBefore(listItem, unfinishedTasks.firstChild);
    bindTaskEvents(listItem, finishTask);
    inputTask.value = "";
  }
  save();
};

addButton.addEventListener("click", addTask);

function deleteTask() {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);
  save();
};

function editTask() {
  var editButton = this;
  var listItem = this.parentNode;
  var label = listItem.querySelector("label");
  var input = listItem.querySelector("input[type=text]");
  var containsClass = listItem.classList.contains("editMode");

  if(containsClass) {
    label.innerText = input.value;
    editButton.className = "materials-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>"
    save();
  } else {
    input.value = label.innerText;
    editButton.className = "materials-icons save";
    editButton.innerHTML = "<i class='material-icons'>save</i>";
  }

  listItem.classList.toggle("editMode");
};

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
    unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName("label")[0].innerText);
  }

  for (var i = 0; i < finishedTasks.children.length; i++) {
    finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName("label")[0].innerText);
  }

  localStorage.removeItem("todo");

  localStorage.setItem("todo", JSON.stringify({
    unfinishedTasks: unfinishedTasksArr,
    finishedTasks: finishedTasksArr
  }));
}

function load() {
  return JSON.parse(localStorage.getItem("todo"));
}

var data = load();

data.unfinishedTasks.forEach(item => {
  var listItem = createNewElement(item, false);
  unfinishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, finishTask);
  // console.log(listItem);
});

data.finishedTasks.forEach(item => {
  var listItem = createNewElement(item, true);
  finishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, unfinishTask);
});