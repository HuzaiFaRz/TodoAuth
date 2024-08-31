import { auth, signInWithEmailAndPassword } from "../firebase.js";

const logInForm = document.querySelector(".login-form");
const { logInEmail, logInPassword, logInBtn } = logInForm;
const logInFunctionility = () => {
  event.preventDefault();
  logInBtn.textContent = "Loading....";
  logInBtn.style.opacity = "0.4";
  logInBtn.style.cursor = "default";
  signInWithEmailAndPassword(auth, logInEmail.value, logInPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      showToast("SignUp SuccessFully", "rgb(0, 128, 0,0.5)");
      logInBtn.textContent = "SignUp";
      logInBtn.style.opacity = "1";
      logInBtn.style.cursor = "pointer";
      logInForm.reset();
      window.location.replace("http://127.0.0.1:5500");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "rgb(255, 0, 0,0.5)");
      logInBtn.textContent = "SignUp";
      logInBtn.style.opacity = "1";
      logInBtn.style.cursor = "pointer";
      logInForm.reset();
    });
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
logInForm.addEventListener("submit", logInFunctionility);
