import {
  showToast,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  storage,
  doc,
  getDoc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
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

const resetLogOutButton = () => {
  logOutBtn.innerHTML = `Log Out`;
  logOutBtn.style.opacity = "1";
  logOutBtn.style.cursor = "pointer";
};

const toDoFunctionility = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;

      if (addTaskTextInput) {
        if (!addTaskTextInput.value) {
          showToast("Write Task In Input", "#B00020");
          return;
        }
      }
      if (todoItems) {
        todoItems.innerHTML += ` <li  class="task w-100 gap-1 px-3 py-2 border-bottom border-2 border-black">
  <span class="task-text fs-6 fw-medium text-dark"> ${addTaskTextInput.value}</span> 
  <div class="todo-btns w-100 d-flex flex-wrap justify-content-evenly align-items-center py-2 px-2" >
  <div class="task-edit btn btn-outline-success fw-medium fs-5 rounded-4 px-5 py-2 border-1">Edit</div>
  <div class="task-delete btn btn-outline-danger fw-medium fs-5 rounded-4 px-5 py-2 border-1"> Delete</div> </div></li>`;
      }
      showToast("Task Added", "rgb( 25, 135, 84)");
      if (addTaskTextInput) {
        addTaskTextInput.value = "";
      }
    } else {
      if (alertMain) {
        alertMain.style.display = "flex";
      }
    }
  });
};

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
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

const getUserInfoFromDB = (uid) => {
  const userDocRef = doc(db, "User", uid);
  getDoc(userDocRef).then((data) => {
    if (userNameDiv) {
      userNameDiv.textContent = `Hi! ${data.data().signUpName}`;
    }
    if (userProfiledDiv) {
      userProfiledDiv.setAttribute("src", `${data.data().signUpProfile}}`);
    }
  });
};
