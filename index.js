import {
  showToast,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  doc,
  getDoc,
  ref,
  getDocs,
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  orderBy,
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

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

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
        showToast("Write Task In Input", "#B00020");
        return;
      }

      const todoDescription = {
        todoText: addTaskTextInput.value,
        todoCreatedUserEmail: auth.currentUser.email,
        todoCreatedUserUID: uid,
        todoCreatedTime: new Date(),
        todoCompleted: "No",
      };

      const todosCollection = collection(db, "Todos");
      addTaskBtn.innerHTML = ` <span class="fs-6 d-flex align-items-center justify-content-center gap-2">Loading  <i class="spinner-border spinner-border-sm text-primary" role="status"></i><span/>`;
      addTaskBtn.style.opacity = "0.5";
      addTaskBtn.style.cursor = "not-allowed";
      addTaskBtn.disabled = true;

      addDoc(todosCollection, todoDescription)
        .then((snapShot) => {
          showToast("Task Added", "rgb( 25, 135, 84)");
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
      userNameDiv.textContent = `Hi! ${data.data().signUpName}`;
      userProfileDiv.setAttribute("src", `${data.data().signUpProfile}}`);
    })
    .catch((error) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      showToast(error, "#B00020");
    });
};

const getTodoFromDB = async (uid) => {
  try {
    const queryTodo = query(
      collection(db, "Todos"),
      where("todoCreatedUserUID", "==", uid),
      orderBy("todoCreatedTime", "desc")
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
        <div class="todo-btns w-100 d-flex flex-wrap justify-content-evenly align-items-center py-2 px-2 gap-3 mt-3">
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

          <div>   
               <input type="checkbox" class="taskMarkedCheckbox" id="${
                 data.id
               }" ${todoCompleted === "Yes" ? "checked" : ""} />
             <span class="${
               todoCompleted === "Yes"
                 ? "bi bi-check-circle-fill"
                 : "bi bi-exclamation-circle-fill"
             } taskMarkedCheckboxBtn btn ${
        todoCompleted === "Yes" ? "btn-success" : "btn-danger"
      }  fs-6"> ${todoCompleted === "Yes" ? " Completed" : " InCompleted"}
              </span>

            </div>

  
        </div>
      </li>`;

      todoItems.innerHTML += todoDataShowing;

      const taskText = document.querySelectorAll(".task-text");
      const taskDeleteBtn = document.querySelectorAll(".task-delete-btn");
      const taskEditBtn = document.querySelectorAll(".task-edit-btn");
      const taskMarkedCheckbox = document.querySelectorAll(
        ".taskMarkedCheckbox"
      );
      const taskMarkedCheckboxBtn = document.querySelectorAll(
        ".taskMarkedCheckboxBtn"
      );
      // const taskMarkedCheckboxIcon = document.querySelectorAll(
      //   "#taskMarkedCheckboxIcon"
      // );
      Array.from(taskDeleteBtn).forEach((taskDeleteBtnElem) => {
        taskDeleteBtnElem.addEventListener("click", function () {
          taskDeleteBtnElem.innerHTML = ` <span class="fs-6 d-flex align-items-center justify-content-center gap-2">Loading  <i class="spinner-border spinner-border-sm text-danger" role="status"></i><span/>`;
          taskDeleteBtnElem.style.opacity = "0.5";
          taskDeleteBtnElem.style.cursor = "not-allowed";
          taskDeleteBtnElem.disabled = true;
          deleteTodo(this.id);
        });
      });

      Array.from(taskEditBtn).forEach((taskEditBtnElem,index) => {
        taskEditBtnElem.addEventListener("click", function () {
          const currenttaskID = this.id;
          const currentTaskText = taskText[index].id;

          if (addTaskTextInput) {
            addTaskTextInput.value = currentTaskText;
            if (addTaskTextInput.value === currentTaskText) {
              taskEditBtnElem.innerHTML = "Editing";
              taskEditBtnElem.disabled = true;
              addTaskBtn.style.display = "none";
              updateTaskBtn.style.display = "block";
              updateTaskBtn.addEventListener("click", () => {
                updateTodo(currenttaskID, addTaskTextInput.value);
                updateTaskBtn.innerHTML = ` <span class="fs-6 d-flex align-items-center justify-content-center gap-2">Loading  <i class="spinner-border spinner-border-sm text-primary" role="status"></i><span/>`;
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

      Array.from(taskMarkedCheckbox).forEach(
        (taskMarkedCheckboxElem, taskMarkedCheckboxIndex) => {
          taskMarkedCheckboxElem.addEventListener("click", function () {
            if (taskMarkedCheckboxElem.checked === true) {
              markedTodoCompleted(this.id);
              taskMarkedCheckboxBtn[taskMarkedCheckboxIndex].textContent =
                " Completed";
              taskMarkedCheckboxBtn[taskMarkedCheckboxIndex].classList.replace(
                "btn-danger",
                "btn-success"
              );

              taskMarkedCheckboxBtn[taskMarkedCheckboxIndex].classList.replace(
                "bi-exclamation-circle-fill",
                "bi-check-circle-fill"
              );
            } else {
              markedTodoUnCompleted(this.id);
              taskMarkedCheckboxBtn[taskMarkedCheckboxIndex].textContent =
                " InCompleted ";
              taskMarkedCheckboxBtn[taskMarkedCheckboxIndex].classList.replace(
                "btn-success",
                "btn-danger"
              );
              taskMarkedCheckboxBtn[taskMarkedCheckboxIndex].classList.replace(
                "bi-check-circle-fill",
                "bi-exclamation-circle-fill"
              );
            }
          });
        }
      );

      resetTodoAddButton();
    });
    if (querySnapshot.empty) {
      todoItems.innerHTML = `<h5 class="text-center w-100 fs-5">No Task Has Been Added</h5>`;
    }
  } catch (error) {
    showToast(error, "#B00020");
    console.log(error);
  }
};

const deleteTodo = async (deletedTodoID) => {
  try {
    const docRef = doc(db, "Todos", deletedTodoID);
    await deleteDoc(docRef);
    getTodoFromDB(auth.currentUser.uid);
    showToast("Task Deleted SuccessFully", "#B00020");
    addTaskTextInput.value = "";
  } catch (error) {
    showToast(error, "#B00020");
  }
};

const updateTodo = async (editTodoID, editTodoText) => {
  try {
    const docRef = doc(db, "Todos", editTodoID);
    await updateDoc(docRef, {
      todoText: editTodoText,
      editingTime: new Date(),
    });
    addTaskBtn.style.display = "block";
    resetUpdateTaskButton();
    getTodoFromDB(auth.currentUser.uid);
    showToast("Task Updated Successfully", "rgb(25, 135, 84)");
    addTaskTextInput.value = "";
  } catch (error) {
    showToast(error, "#B00020");
    console.log(error);
  }
};

const markedTodoCompleted = async (completedTodoID) => {
  try {
    const docRef = doc(db, "Todos", completedTodoID);
    await updateDoc(docRef, {
      todoCompleted: "Yes",
    });
    showToast("Task Marked As Completed", "rgb(25, 135, 84)");
  } catch (error) {
    showToast(error, "#B00020");
    console.log(error);
  }
};
const markedTodoUnCompleted = async (unCompleteTodoID) => {
  try {
    const docRef = doc(db, "Todos", unCompleteTodoID);
    await updateDoc(docRef, {
      todoCompleted: "No",
    });
    showToast("Task Marked As InCompleted", "#B00020");
  } catch (error) {
    showToast(error, "#B00020");
    console.log(error);
  }
};

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      getTodoFromDB(uid);
      alertMain.style.display = "none";
      getUserInfoFromDB(uid);
      logOutBtn.style.display = "block";
    } else {
      userNameDiv.textContent = `Hi! User`;
      userProfileDiv.setAttribute("src", "Images/Profile-Default.jpg");
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
      showToast("Sign Out SuccessFully", "rgb( 25, 135, 84)");
      window.location.href = "Login/login.html";
    })
    .catch((error) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      resetLogOutButton();
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "#B00020");
    });
});

userProfileLink.addEventListener("click", toDoFunctionility);

closeAlertBtn.addEventListener("click", () => {
  alertMain.style.display = "none";
});

// let randomlyNumber = `#${Math.round(Math.random() * 1000000)}`;
// setInterval(() => {
//   let randomlyNumber = `#${Math.round(Math.random() * 1000000)}`;
//   document.body.style.backgroundColor = randomlyNumber;
// }, 1001000);
