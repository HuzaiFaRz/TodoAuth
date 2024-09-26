import { showToast, auth, signInWithEmailAndPassword } from "../firebase.js";
const logInForm = document.querySelector(".login-form");
const logInSubmitBtn = document.querySelector("#LogInBtn");
const alertMain = document.querySelector(".alert-main");
const resetLoginButton = () => {
  logInSubmitBtn.innerHTML = `Log In`;
  logInSubmitBtn.style.opacity = "1";
  logInSubmitBtn.style.cursor = "pointer";
  logInSubmitBtn.disabled = false;
};

const logInFunctionility = () => {
  event.preventDefault();

  const logInFormData = new FormData(logInForm);
  const logInUserInformaTion = {
    logInEmail: logInFormData.get("LogInEmail"),
    logInPassword: logInFormData.get("LogInPassword"),
  };

  logInSubmitBtn.innerHTML = `Log In <i class="spinner-border spinner-border-sm text-light" role="status"> </i>`;
  logInSubmitBtn.style.opacity = "0.5";
  logInSubmitBtn.style.cursor = "not-allowed";
  logInSubmitBtn.disabled = true;
  if (!logInUserInformaTion.logInEmail || !logInUserInformaTion.logInPassword) {
    showToast("Fill All Field", "#B00020", 2000);
    resetLoginButton();
    return;
  }

  logInSubmitBtn.innerHTML = `Log In <i class="spinner-border spinner-border-sm text-light" role="status"> </i>`;
  logInSubmitBtn.style.opacity = "0.5";
  logInSubmitBtn.style.cursor = "not-allowed";
  alertMain.style.display = "flex";
  alertMain.innerHTML = `<div class="spinner-grow text-light" role="status" style="width: 3rem; height: 3rem; z-index:9999;" ></div>`;

  signInWithEmailAndPassword(
    auth,
    logInUserInformaTion.logInEmail,
    logInUserInformaTion.logInPassword
  )
    .then((userCredential) => {
      const user = userCredential.user;
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      showToast("Log In SuccessFully", "#198754", 2000);
      resetLoginButton();
      logInForm.reset();
      window.location.href = "../index.html";
    })
    .catch((error) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "#B00020", 2000);
      resetLoginButton();
    });
};

logInForm.addEventListener("submit", logInFunctionility);

const passwordsIconsFunctionility = () => {
  const passwordInput = document.querySelector("#password-input");
  const passwordShowHide = () =>
    (passwordInput.type =
      passwordInput.type === "password" ? "text" : "password");

  const passwordIcon = document.querySelector(".password-icon");
  passwordIcon.addEventListener("click", passwordShowHide);
};
passwordsIconsFunctionility();
