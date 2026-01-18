import {
  showToast,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  doc,
  getDoc,
  // ref,
  // getDocs,
  // collection,
  // addDoc,
  // query,
  // where,
  // deleteDoc,
  // updateDoc,
  // orderBy,
} from "../firebase.js";

const userProfileDiv = document.querySelector("#User-Profile");
const logOutBtn = document.querySelector(".logout-btn");
const dashboardForm = document.querySelector(".dashboard-form");
const welcoming = document.querySelector(".welcoming");
const alertMain = document.querySelector(".alert-main");
window.addEventListener("load", () => {
  const {
    dashBoardName,
    dashBoardEmail,
    dashBoardPhoneNumber,
    dashBoardPassword,
    dashBoardTime,
  } = dashboardForm;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      logOutBtn.style.display = "block";
      const userDocRef = doc(db, "Users", user.uid);
      alertMain.style.display = "flex";
      alertMain.innerHTML = `<div class="spinner-grow text-light" role="status" ></div>`;

      getDoc(userDocRef)
        .then((data) => {
          alertMain.style.display = "none";
          alertMain.innerHTML = "";
          const {
            // signUpProfile,
            signUpName,
            signUpEmail,
            signUpPhoneNumber,
            signUpPassword,
            signedUpUserTime: { seconds, nanoseconds },
          } = data.data();
          const timestampInMilliseconds =
            seconds * 1000 + nanoseconds / 1000000;
          const date = new Date(timestampInMilliseconds);
          const readableDate = date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          });
          welcoming.innerHTML = `Welcome To ${signUpName}`;
          dashBoardName.value = signUpName;
          dashBoardEmail.value = signUpEmail;
          dashBoardPhoneNumber.value = signUpPhoneNumber;
          dashBoardPassword.value = signUpPassword;
          dashBoardTime.value = `${readableDate}`;
          userProfileDiv.textContent = data.data().signUpName.toUpperCase()[0];
        })
        .catch((error) => {
          alertMain.style.display = "none";
          alertMain.innerHTML = "";
          console.log(error);
        });
    } else {
      window.location.href = "/";
    }
  });
});

const resetLogOutButton = () => {
  logOutBtn.disabled = false;
  logOutBtn.innerHTML = `Log Out`;
  logOutBtn.style.opacity = "1";
  logOutBtn.style.cursor = "pointer";
};
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
      window.location.href = "../Login/login.html";
    })
    .catch((error) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      resetLogOutButton();
      const errorMessage = error.message;
      console.log(errorMessage);
      showToast(errorMessage, "#B00020", 2000);
    });
});
