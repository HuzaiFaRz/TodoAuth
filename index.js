import { auth, signOut, onAuthStateChanged } from "./firebase.js";
const logOutBtn = document.querySelector(".logout-btn");
const userEmail = document.querySelector(".userEmail");
const userCheck = document.querySelector(".alert-main");

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (userCheck) {
        userCheck.style.display = "none";
      }
      if (userEmail) {
        userEmail.textContent = `Hi! ${user.email}`;
      }
      const uid = user.uid;
    } else {
      userCheck.style.display = "flex";
    }
  });
});

const resetLogOutButton = () => {
  logOutBtn.innerHTML = `Log Out`;
  logOutBtn.style.opacity = "1";
  logOutBtn.style.cursor = "pointer";
};

const showToast = (massege, background) => {
  Toastify({
    text: `${massege}`,
    position: "center",
    duration: 3000,
    style: {
      background: `${background}`,
      color: "#fbfcf8",
      fontSize: "18px",
    },
  }).showToast();
};

const passwordIcon = document.querySelectorAll(".password-icon");
const floatingPassword = document.querySelectorAll("#floatingPassword");

if (logOutBtn) {
  logOutBtn.addEventListener("click", () => {
    logOutBtn.innerHTML = ` Log Out <i class="spinner-border spinner-border-sm text-light" role="status"></i>`;
    logOutBtn.style.opacity = "0.5";
    logOutBtn.style.cursor = "not-allowed";
    signOut(auth)
      .then(() => {
        resetLogOutButton();
        showToast("Sign Out SuccessFully", "rgb(0, 128, 0,0.5)");
        window.location.replace("http://127.0.0.1:5500/Login/login.html");
      })
      .catch((error) => {
        resetLogOutButton();
        const errorCode = error.code;
        const errorMessage = error.message;
        showToast(errorMessage, "rgb(255, 0, 0,0.5)");
      });
  });
}
if (passwordIcon) {
  Array.from(passwordIcon).forEach((passwordIconElem, passwordIconIndex) => {
    passwordIconElem.addEventListener("click", () => {
      passwordIconElem.classList.toggle("password-icon-active");
      if (passwordIconElem.classList.contains("password-icon-active")) {
        passwordIconElem.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
        floatingPassword[passwordIconIndex].setAttribute("type", "text");
      } else {
        passwordIconElem.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
        floatingPassword[passwordIconIndex].setAttribute("type", "password");
      }
    });
  });
}
