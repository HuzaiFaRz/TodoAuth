import {
  showToast,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  doc,
  getDoc,
  // ref,
  getDocs,
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "./firebase.js";

const logOutBtn = document.querySelector(".logout-btn");
const userNameDiv = document.querySelector("#User-Name");
const userProfileLink = document.querySelector(".User-Profile-Link");
const userProfileDiv = document.querySelector("#User-Profile");
const alertMain = document.querySelector(".alert-main");
const closeAlertBtn = document.querySelector("#closeAlertBtn");
const addTaskTextInput = document.querySelector("#AddTaskTextInput");
const addTaskBtn = document.querySelector("#AddTaskBtn");
const todoItems = document.querySelector(".todo-items");
// const taskExistDiv = document.querySelector(".task-exist-div");
const updateTaskBtn = document.querySelector("#UpdateTaskBtn");

updateTaskBtn.style.display = "none";

const resetLogOutButton = () => {
  logOutBtn.disabled = false;
  logOutBtn.innerHTML = `Log Out`;
  logOutBtn.style.opacity = "1";
  logOutBtn.style.cursor = "pointer";
};

const resetTodoAddButton = () => {
  addTaskBtn.disabled = false;
  addTaskBtn.innerHTML = `Add`;
  addTaskBtn.style.opacity = "1";
  addTaskBtn.style.cursor = "pointer";
};

const resetUpdateTaskButton = () => {
  updateTaskBtn.disabled = false;
  updateTaskBtn.innerHTML = `Update`;
  updateTaskBtn.style.opacity = "1";
  updateTaskBtn.style.cursor = "pointer";
  updateTaskBtn.style.display = "none";
};

const toDoFunctionility = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      userProfileLink.setAttribute("href", "./DashBoard/dashboard.html");
      getTodoFromDB(uid);
      if (!addTaskTextInput.value) {
        showToast("Write Task In Input", "#B00020", 2000);
        return;
      }
      const todoDescription = {
        todoText: addTaskTextInput.value,
        todoCreatedUserEmail: auth.currentUser.email,
        todoCreatedUserUID: uid,
        todoCreatedTime: serverTimestamp(),
        todoCompleted: false,
      };
      const todosCollection = collection(db, "Todos");
      addTaskBtn.innerHTML = `Adding`;
      addTaskBtn.style.opacity = "0.5";
      addTaskBtn.style.cursor = "not-allowed";
      addTaskBtn.disabled = true;
      addDoc(todosCollection, todoDescription)
        .then((snapShot) => {
          showToast("Task Added", "#198754", 2000);
          resetTodoAddButton();
          addTaskTextInput.value = "";
        })
        .catch((error) => {
          console.log(error);
          resetTodoAddButton();
        });
    } else {
      userProfileLink.setAttribute("href", "#");
      alertMain.style.display = "flex";
    }
  });
};

const getUserInfoFromDB = (uid) => {
  const userDocRef = doc(db, "Users", uid);
  alertMain.style.display = "flex";
  alertMain.innerHTML = `<div class="spinner-grow text-light" role="status" ></div>`;
  getDoc(userDocRef)
    .then((data) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      showToast(`Hi! ${data.data().signUpName}`, "black", 2000);
      userProfileDiv.textContent = data.data().signUpName.toUpperCase()[0];
    })
    .catch((error) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      console.log(error);
    });
};

const getTodoFromDB = async (uid) => {
  try {
    const queryTodo = query(
      collection(db, "Todos"),
      where("todoCreatedUserUID", "==", uid),
      orderBy("todoCreatedTime", "desc"),
    );

    const querySnapshot = await getDocs(queryTodo);

    todoItems.innerHTML = "";

    querySnapshot.forEach((data) => {
      const docData = data.data();
      const { todoText, todoCompleted } = docData;
      const todoDataShowing = `     
      <li class="task w-100 gap-1 py-2 px-3 border-bottom border-2 border-black">
        <span id="${todoText}" class="task-text w-100 fs-6 fw-medium text-dark">
          ${todoText}
        </span>
        <div class="todo-btns w-100 d-flex flex-wrap justify-content-evenly align-items-center py-2 px-2 gap-2 mt-3 w-100">
          <button id="${
            data.id
          }" class="task-edit-btn btn btn-outline-success fw-medium fs-6 rounded-4 px-4 py-2 border-1" title="Edit Task">
            Edit
          </button>
          <button id="${
            data.id
          }" class="task-delete-btn btn btn-outline-danger fw-medium fs-6 rounded-4 px-4 py-2 border-1" title="Delete Task">
            Delete
          </button>
          <div class="position-relative overflow-hidden">
            <button  class="task-complete-btn fw-medium fs-6 rounded-4 px-4 py-2 border-1 bi ${
              todoCompleted === true
                ? "bi-check-circle-fill"
                : "bi-exclamation-circle-fill"
            } btn ${
              todoCompleted === true ? "btn-success" : "btn btn-danger"
            }" title=${todoCompleted === true ? "Complete" : "InComplete"}>
          ${todoCompleted === true ? " Complete" : " InComplete"}
          </button>
          <input type="checkbox" class="task-complete-check-box position-absolute w-100 h-100 start-0 top-0 opacity-0" id="${
            data.id
          }" ${todoCompleted === true ? "checked" : ""} />
          </div>
        </div>
      </li>`;

      todoItems.innerHTML += todoDataShowing;

      const taskText = document.querySelectorAll(".task-text");
      const taskDeleteBtn = document.querySelectorAll(".task-delete-btn");
      const taskEditBtn = document.querySelectorAll(".task-edit-btn");
      const taskCompleteCheckBox = document.querySelectorAll(
        ".task-complete-check-box",
      );
      const taskCompleteBtn = document.querySelectorAll(".task-complete-btn");
      Array.from(taskDeleteBtn).forEach((taskDeleteBtnElem, index) => {
        taskDeleteBtnElem.addEventListener("click", function () {
          taskDeleteBtnElem.innerHTML = `Deleting`;
          taskEditBtn[index].disabled = true;
          taskDeleteBtnElem.style.opacity = "0.5";
          taskDeleteBtnElem.style.cursor = "not-allowed";
          taskDeleteBtnElem.disabled = true;
          deleteTodo(this.id);
        });
      });

      Array.from(taskEditBtn).forEach((taskEditBtnElem, index) => {
        taskEditBtnElem.addEventListener("click", function () {
          const currenttaskID = this.id;
          const currentTaskText = taskText[index].id;
          if (addTaskTextInput) {
            addTaskTextInput.value = currentTaskText;
            if (addTaskTextInput.value === currentTaskText) {
              taskEditBtnElem.innerHTML = "Editing";
              taskDeleteBtn[index].disabled = true;
              taskEditBtnElem.disabled = true;
              addTaskBtn.style.display = "none";
              updateTaskBtn.style.display = "block";
              updateTaskBtn.addEventListener("click", () => {
                updateTodo(currenttaskID, addTaskTextInput.value);
                updateTaskBtn.innerHTML = `Updating`;
                taskDeleteBtn[index].disabled = false;
                updateTaskBtn.style.opacity = "0.5";
                updateTaskBtn.style.cursor = "not-allowed";
                updateTaskBtn.disabled = true;
                taskEditBtnElem.disabled = false;
                taskEditBtnElem.innerHTML = `Edit`;
              });
            }
          }
        });
      });

      Array.from(taskCompleteCheckBox).forEach(
        (taskMarkedCheckboxElem, taskMarkedCheckboxIndex) => {
          taskMarkedCheckboxElem.addEventListener("click", function () {
            if (taskMarkedCheckboxElem.checked === true) {
              markedTodoCompleted(this.id);
              taskCompleteBtn[taskMarkedCheckboxIndex].textContent =
                ` Complete`;
              taskCompleteBtn[taskMarkedCheckboxIndex].classList.replace(
                "bi-exclamation-circle-fill",
                "bi-check-circle-fill",
              );
              taskCompleteBtn[taskMarkedCheckboxIndex].classList.replace(
                "btn-danger",
                "btn-success",
              );
            } else {
              markedTodoUnCompleted(this.id);
              taskCompleteBtn[taskMarkedCheckboxIndex].textContent =
                ` InComplete`;
              taskCompleteBtn[taskMarkedCheckboxIndex].classList.replace(
                "bi-check-circle-fill",
                "bi-exclamation-circle-fill",
              );
              taskCompleteBtn[taskMarkedCheckboxIndex].classList.replace(
                "btn-success",
                "btn-danger",
              );
            }
          });
        },
      );

      resetTodoAddButton();
    });
    if (querySnapshot.empty) {
      todoItems.innerHTML = `<h5 class="text-center w-100 fs-6">No Task Has Been Added</h5>`;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteTodo = async (deletedTodoID) => {
  try {
    const docRef = doc(db, "Todos", deletedTodoID);
    await deleteDoc(docRef);
    getTodoFromDB(auth.currentUser.uid);
    showToast("Task Deleted SuccessFully", "#B00020", 2000);
    addTaskTextInput.value = "";
  } catch (error) {
    console.log(error);
  }
};

const updateTodo = async (editTodoID, editTodoText) => {
  try {
    const docRef = doc(db, "Todos", editTodoID);
    await updateDoc(docRef, {
      todoText: editTodoText,
      editingTime: serverTimestamp(),
    });
    addTaskBtn.style.display = "block";
    resetUpdateTaskButton();
    getTodoFromDB(auth.currentUser.uid);
    showToast("Task Updated Successfully", "#198754", 2000);
    addTaskTextInput.value = "";
  } catch (error) {
    console.log(error);
  }
};

const markedTodoCompleted = async (completedTodoID) => {
  try {
    const docRef = doc(db, "Todos", completedTodoID);
    await updateDoc(docRef, {
      todoCompleted: true,
    });
    showToast("Task Marked As Complete", "#198754", 2000);
  } catch (error) {
    console.log(error);
  }
};

const markedTodoUnCompleted = async (unCompleteTodoID) => {
  try {
    const docRef = doc(db, "Todos", unCompleteTodoID);
    await updateDoc(docRef, {
      todoCompleted: false,
    });
    showToast("Task Marked As InComplete", "#B00020", 2000);
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    alertMain.style.display = "flex";
    if (user) {
      const uid = user.uid;
      getTodoFromDB(uid);
      alertMain.style.display = "none";
      getUserInfoFromDB(uid);
      logOutBtn.style.display = "block";
    } else {
      userNameDiv.textContent = `Hi! User`;
      userProfileDiv.textContent = 'Hi';
      logOutBtn.style.display = "none";
      alertMain.style.display = "flex";
    }
  });
});

addTaskBtn.addEventListener("click", toDoFunctionility);

logOutBtn.addEventListener("click", () => {
  logOutBtn.innerHTML = ` Log Out <i class="spinner-border spinner-border-sm text-light" role="status"></i>`;
  logOutBtn.style.opacity = "0.5";
  logOutBtn.style.cursor = "not-allowed";
  logOutBtn.disabled = true;
  alertMain.style.display = "flex";
  alertMain.innerHTML = `<div class="spinner-grow text-light" role="status" ></div>`;

  signOut(auth)
    .then(() => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      resetLogOutButton();
      showToast("Sign Out SuccessFully", "#198754", 2000);
      window.location.href = "Login/login.html";
    })
    .catch((error) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      resetLogOutButton();
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
    });
});

userProfileLink.addEventListener("click", toDoFunctionility);

closeAlertBtn.addEventListener("click", () => {
  alertMain.style.display = "none";
});
