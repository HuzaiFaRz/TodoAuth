import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  addDoc,
  getDocs,
} from "./firebase.js";
export const showToast = (massege, background) => {
  Toastify({
    text: `${massege}`,
    position: "center",
    duration: 2000,
    style: {
      background: `${background}`,
      color: "#fbfcf8",
      fontSize: "18px",
      letterSpacing: "2px",
    },
  }).showToast();
};

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

const getUserInfoFromDB = async () => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    querySnapshot.forEach((doc) => {
      const docID = doc.id;
      const { userProfile, userName, userEmail, userPassword, userUID } =
        doc.data();
      if (userNameDiv) {
        userNameDiv.textContent = `Hi! ${userName}`;
      }
      if (userProfiledDiv) {
        userProfiledDiv.setAttribute("src", `${userProfile}`);
      }
      const userSignedUpSecond = doc.data().time.seconds;
      const userSignedUpMilliSecond = doc.data().time.nanoseconds;
      const date = new Date(
        userSignedUpSecond * 1000 + userSignedUpMilliSecond / 1e6
      );
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
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
      if (logOutBtn) {
        logOutBtn.style.display = "none";
      }
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
      getUserInfoFromDB();
      if (logOutBtn) {
        logOutBtn.style.display = "block";
      }
    } else {
      if (userNameDiv) {
        userNameDiv.textContent = `Hi! User`;
      }
      if (userProfiledDiv) {
        userProfiledDiv.setAttribute("src", "Profile-Default.jpg");
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
        window.location.replace("Login/login.html");
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

const usersCollection = collection(db, "Users");

let randomlyNumber = `#${Math.round(Math.random() * 1000000)}`;
setInterval(() => {
  let randomlyNumber = `#${Math.round(Math.random() * 1000000)}`;
  document.body.style.backgroundColor = randomlyNumber;
}, 1001000);
