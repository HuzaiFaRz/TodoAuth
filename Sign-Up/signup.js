import { auth, createUserWithEmailAndPassword } from "../firebase.js";
const signUpForm = document.querySelector(".signup-form");
const { signUpEmail, signUpPassword, signUpBtn } = signUpForm;
const signUpFunctionility = () => {
  event.preventDefault();
  signUpBtn.textContent = "Loading....";
  signUpBtn.style.opacity = "0.4";
  signUpBtn.style.cursor = "default";
  createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      showToast("SignUp SuccessFully", "rgb(0, 128, 0,0.5)");
      signUpBtn.textContent = "SignUp";
      signUpBtn.style.opacity = "1";
      signUpBtn.style.cursor = "pointer";
      signUpForm.reset();
      window.location.replace("http://127.0.0.1:5500/Login/login.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "rgb(255, 0, 0,0.5)");
      signUpBtn.textContent = "SignUp";
      signUpBtn.style.opacity = "1";
      signUpBtn.style.cursor = "pointer";
      signUpForm.reset();
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



signUpForm.addEventListener("submit", signUpFunctionility);
