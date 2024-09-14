import {
  auth,
  createUserWithEmailAndPassword,
  db,
  collection,
  addDoc,
} from "../firebase.js";
const signUpForm = document.querySelector(".signup-form");
const signUpSubmitBtn = document.querySelector("#SignUpBtn");

const resetSignUpButton = () => {
  signUpSubmitBtn.innerHTML = `Sign Up`;
  signUpSubmitBtn.style.opacity = "1";
  signUpSubmitBtn.style.cursor = "pointer";
  signUpSubmitBtn.disabled = false;
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
const signUpFunctionility = () => {
  event.preventDefault();

  const signUpFormData = new FormData(signUpForm);
  const signUpUserInformaTion = {
    signUpName: signUpFormData.get("SignUpName"),
    signUpEmail: signUpFormData.get("SignUpEmail"),
    signUpPassword: signUpFormData.get("SignUpPassword"),
    signUpConfirmPassword: signUpFormData.get("SignUpConfirmPassword"),
  };

  if (
    !signUpUserInformaTion.signUpName ||
    !signUpUserInformaTion.signUpEmail ||
    !signUpUserInformaTion.signUpPassword ||
    !signUpUserInformaTion.signUpConfirmPassword
  ) {
    showToast("Fill All Field", "rgb(220, 53, 69)");
    resetSignUpButton();
    return;
  }
  if (
    signUpUserInformaTion.signUpPassword !==
    signUpUserInformaTion.signUpConfirmPassword
  ) {
    showToast("Password Does Not Match", "rgb(220, 53, 69)");
    resetSignUpButton();
    return;
  }
  signUpSubmitBtn.innerHTML = ` Sign Up <i class="spinner-border spinner-border-sm text-light" role="status"> </i>`;
  signUpSubmitBtn.style.opacity = "0.5";
  signUpSubmitBtn.style.cursor = "not-allowed";
  signUpSubmitBtn.disabled = true;
  createUserWithEmailAndPassword(
    auth,
    signUpUserInformaTion.signUpEmail,
    signUpUserInformaTion.signUpPassword
  )
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user.uid);

      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: user.uid,
          userName: signUpUserInformaTion.signUpName,
          userEmail: signUpUserInformaTion.signUpEmail,
        });
        showToast(
          `Document written with ID: ${docRef.id}`,
          "rgb( 25, 135, 84)"
        );
        console.log(docRef);
      } catch (error) {
        showToast(`Error adding document: ${error}`, "rgb(220, 53, 69)");
        console.log(error);
      }

      showToast("SignUp SuccessFully", "rgb( 25, 135, 84)");
      resetSignUpButton();
      signUpForm.reset();
      // window.location.replace("../Login/login.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "rgb(220, 53, 69)");
      resetSignUpButton();
      signUpForm.reset();
    });
};

signUpForm.addEventListener("submit", signUpFunctionility);
