import { auth, signOut, onAuthStateChanged } from "./firebase.js";

const logOutBtn = document.querySelector(".logout-btn");

// URL for the index page

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(uid);
    } else {
      // User is signed out
      // ...
      window.location.href = "http://127.0.0.1:5500/signup.html";
    }
  });
});

logOutBtn.addEventListener("click", () => {
  logOutBtn.textContent = "Loading....";
  logOutBtn.style.opacity = "0.4";
  logOutBtn.style.cursor = "default";
  signOut(auth)
    .then(() => {
      logOutBtn.textContent = "Log Out";
      logOutBtn.style.opacity = "1";
      logOutBtn.style.cursor = "pointer";
      showToast("Sign Out SuccessFully", "rgb(0, 128, 0,0.5)");
      window.location.replace("http://127.0.0.1:5500/Login/login.html");
    })
    .catch((error) => {
      logOutBtn.textContent = "Log Out";
      logOutBtn.style.opacity = "1";
      logOutBtn.style.cursor = "pointer";
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "rgb(255, 0, 0,0.5)");
    });
});
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
