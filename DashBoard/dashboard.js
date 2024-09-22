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
} from "../firebase.js";

const userProfileDiv = document.querySelector("#User-Profile");
const logOutBtn = document.querySelector(".logout-btn");
const dashboardForm = document.querySelector(".dashboard-form");
const welcoming = document.querySelector(".welcoming");
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
      console.log(this);
      const userDocRef = doc(db, "Users", user.uid);
      getDoc(userDocRef)
        .then((data) => {
          const {
            signUpProfile,
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
          dashBoardTime.value = `Created At: ${readableDate}`;
          userProfileDiv.setAttribute("src", `${signUpProfile}}`);
        })
        .catch((error) => {
          showToast(error, "#B00020");
          console.log(error);
        });
    } else {
      window.location.href = "/";
    }
  });
});

// console.log(auth.currentUser);

// getUserInfoFromDB(auth.currentUser.uid);

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
  signOut(auth)
    .then(() => {
      resetLogOutButton();
      showToast("Sign Out SuccessFully", "rgb( 25, 135, 84)");
      window.location.href = "../Login/login.html";
    })
    .catch((error) => {
      resetLogOutButton();
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "#B00020");
    });
});

const person = {
  name: "John",
  address: {
    city: "New York",
    zip: "10001",
  },
  contact: {
    phone: "123-456-7890",
    email: "john@example.com",
  },
};

// Nested destructuring
const {
  name,
  address: { city, zip },
  contact: { phone, email },
} = person;
