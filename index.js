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
} from "./firebase.js";

const logOutBtn = document.querySelector(".logout-btn");
const userNameDiv = document.querySelector("#User-Name");
const userProfiledDiv = document.querySelector("#User-Profile");
const alertMain = document.querySelector(".alert-main");
const closeAlertBtn = document.querySelector("#closeAlertBtn");
const passwordIcons = document.querySelectorAll(".password-icon");
const passwordInputs = document.querySelectorAll("#password-input");
const addTaskTextInput = document.querySelector("#AddTaskTextInput");
const addTaskBtn = document.querySelector("#AddTaskBtn");
const todoItems = document.querySelector(".todo-items");
const taskExistDiv = document.querySelector(".task-exist-div");
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
  updateTaskBtn.innerHTML = `Edit`;
  updateTaskBtn.style.opacity = "1";
  updateTaskBtn.style.cursor = "pointer";
  updateTaskBtn.style.display = "none";
};

const toDoFunctionility = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getTodoFromDB(auth.currentUser.uid);
      const uid = user.uid;
      if (addTaskTextInput) {
        if (!addTaskTextInput.value) {
          showToast("Write Task In Input", "#B00020");
          return;
        }
      }

      const todoDescription = {
        todoText: addTaskTextInput.value,
        todoCreatedUserEmail: auth.currentUser.email,
        todoCreatedUserUID: auth.currentUser.uid,
        todoCreatedTime: new Date(),
        todoCompleted: false,
      };

      const todosCollection = collection(db, "Todos");
      addTaskBtn.innerHTML = ` <span class="fs-6 d-flex align-items-center justify-content-center gap-2">Loading  <i class="spinner-border spinner-border-sm text-primary" role="status"></i><span/>`;
      addTaskBtn.style.opacity = "0.5";
      addTaskBtn.style.cursor = "not-allowed";
      addTaskBtn.disabled = true;

      addDoc(todosCollection, todoDescription)
        .then((snapShot) => {
          console.log("TASK HAS BEEN ADD DB");
          showToast("Task Added", "rgb( 25, 135, 84)");
          resetTodoAddButton();
          if (addTaskTextInput) {
            addTaskTextInput.value = "";
          }
        })
        .catch((error) => {
          console.log(error);
          resetTodoAddButton();
        });
    } else {
      if (alertMain) {
        alertMain.style.display = "flex";
      }
    }
  });
};
const getUserInfoFromDB = (uid) => {
  const userDocRef = doc(db, "Users", uid);
  getDoc(userDocRef)
    .then((data) => {
      if (userNameDiv) {
        userNameDiv.textContent = `Hi! ${data.data().signUpName}`;
      }
      if (userProfiledDiv) {
        userProfiledDiv.setAttribute("src", `${data.data().signUpProfile}}`);
      }
    })
    .catch((error) => {
      showToast(error, "#B00020");
    });
};

const getTodoFromDB = async (uid) => {
  try {
    const queryTodo = query(
      collection(db, "Todos"),
      where("todoCreatedUserUID", "==", uid)
    );

    const querySnapshot = await getDocs(queryTodo);

    if (todoItems) {
      todoItems.innerHTML = "";
    }

    querySnapshot.forEach((doc) => {
      const docData = doc.data();

      const { todoText } = docData;
      const todoDataShowing = ` <li  class="task w-100 gap-1 px-3 py-2 border-bottom border-2 border-black">
      <span id = "${todoText}" class="task-text fs-6 fw-medium text-dark"> ${todoText}</span>
      <div class="todo-btns w-100 d-flex flex-wrap justify-content-evenly align-items-center py-2 px-2" >
      <button id = ${doc.id}  class="task-edit-btn btn btn-outline-success fw-medium fs-5 rounded-4 px-5 py-2 border-1">Edit</button>
      <button id = ${doc.id}   class="task-delete-btn btn btn-outline-danger fw-medium fs-5 rounded-4 px-5 py-2 border-1"> Delete</div> </button></li>`;

      if (todoItems) {
        todoItems.innerHTML += todoDataShowing;
      }

      const taskDeleteBtn = document.querySelectorAll(".task-delete-btn");
      const taskEditBtn = document.querySelectorAll(".task-edit-btn");
      const taskText = document.querySelectorAll(".task-text");
      Array.from(taskDeleteBtn).forEach((taskDeleteBtnElem) => {
        taskDeleteBtnElem.addEventListener("click", function () {
          taskDeleteBtnElem.innerHTML = ` <span class="fs-6 d-flex align-items-center justify-content-center gap-2">Loading  <i class="spinner-border spinner-border-sm text-primary" role="status"></i><span/>`;
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
              taskEditBtnElem.disabled = true;
              addTaskBtn.style.display = "none";
              updateTaskBtn.style.display = "block";
              updateTaskBtn.addEventListener("click", () => {
                updateTodo(currenttaskID, addTaskTextInput.value);
                updateTaskBtn.innerHTML = ` <span class="fs-6 d-flex align-items-center justify-content-center gap-2">Loading  <i class="spinner-border spinner-border-sm text-primary" role="status"></i><span/>`;
                updateTaskBtn.style.opacity = "0.5";
                updateTaskBtn.style.cursor = "not-allowed";
                updateTaskBtn.disabled = true;
                taskEditBtnElem.innerHTML = "Edit";
                taskEditBtnElem.disabled = false;
                taskEditBtnElem.innerHTML = `Edit`;
              });
            }
          }
        });
      });

      resetTodoAddButton();
    });
    if (querySnapshot.empty) {
      if (todoItems) {
        todoItems.innerHTML = `<h5 class="text-center w-100 fs-5">No Task Has Been Added</h5>`;
      }
    }
  } catch (error) {
    showToast(error, "#B00020");
  }
};

const deleteTodo = async (deletedTodoID) => {
  try {
    const docRef = doc(db, "Todos", deletedTodoID);
    await deleteDoc(docRef);
    getTodoFromDB(auth.currentUser.uid);
    showToast("Task Deleted SuccessFully", "rgb( 25, 135, 84)");
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

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getTodoFromDB(auth.currentUser.uid);

      if (alertMain) {
        alertMain.style.display = "none";
      }
      getUserInfoFromDB(user.uid);
      if (logOutBtn) {
        logOutBtn.style.display = "block";
      }
    } else {
      if (userNameDiv) {
        userNameDiv.textContent = `Hi! User`;
      }
      if (userProfiledDiv) {
        userProfiledDiv.setAttribute("src", "Images/Profile-Default.jpg");
      }
      if (logOutBtn) {
        logOutBtn.style.display = "none";
      }
      if (alertMain) {
        alertMain.style.display = "flex";
      }
    }
  });
});

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", toDoFunctionility);
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", () => {
    logOutBtn.innerHTML = ` Log Out <i class="spinner-border spinner-border-sm text-light" role="status"></i>`;
    logOutBtn.style.opacity = "0.5";
    logOutBtn.style.cursor = "not-allowed";
    logOutBtn.disabled = true;
    signOut(auth)
      .then(() => {
        resetLogOutButton();
        showToast("Sign Out SuccessFully", "rgb( 25, 135, 84)");
        window.location.href = "Login/login.html";
      })
      .catch((error) => {
        resetLogOutButton();
        const errorCode = error.code;
        const errorMessage = error.message;
        showToast(errorMessage, "#B00020");
      });
  });
}

if (passwordIcons) {
  Array.from(passwordIcons).forEach((passwordIconElem, passwordIconIndex) => {
    passwordIconElem.addEventListener("click", () => {
      passwordIconElem.classList.toggle("password-icon-active");
      if (passwordIconElem.classList.contains("password-icon-active")) {
        passwordIconElem.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
        passwordInputs[passwordIconIndex].setAttribute("type", "text");
      } else {
        passwordIconElem.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
        passwordInputs[passwordIconIndex].setAttribute("type", "password");
      }
    });
  });
}

if (closeAlertBtn) {
  closeAlertBtn.addEventListener("click", () => {
    alertMain.style.display = "none";
  });
}
// let randomlyNumber = `#${Math.round(Math.random() * 1000000)}`;
// setInterval(() => {
//   let randomlyNumber = `#${Math.round(Math.random() * 1000000)}`;
//   document.body.style.backgroundColor = randomlyNumber;
// }, 1001000);
