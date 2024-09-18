import {
  auth,
  createUserWithEmailAndPassword,
  db,
  collection,
  addDoc,
  getDocs,
} from "../firebase.js";

import { showToast } from "../index.js";

const signUpForm = document.querySelector(".signup-form");
const signUpSubmitBtn = document.querySelector("#SignUpBtn");
const usersCollection = collection(db, "Users");
const resetSignUpButton = () => {
  signUpSubmitBtn.innerHTML = `Sign Up`;
  signUpSubmitBtn.style.opacity = "1";
  signUpSubmitBtn.style.cursor = "pointer";
  signUpSubmitBtn.disabled = false;
};
const signUpFormData = new FormData(signUpForm);
const signUpFunctionility = () => {
  event.preventDefault();
  const signUpUserInformaTion = {
    signUpName: signUpFormData.get("SignUpName"),
    signUpEmail: signUpFormData.get("SignUpEmail"),
    signUpPassword: signUpFormData.get("SignUpPassword"),
    signUpConfirmPassword: signUpFormData.get("SignUpConfirmPassword"),
    signUpProfile: signUpFormData.get("SignUpProfile"),
    signedUpUserTime: new Date(),
  };
  if (
    !signUpUserInformaTion.signUpName ||
    !signUpUserInformaTion.signUpEmail ||
    !signUpUserInformaTion.signUpPassword ||
    !signUpUserInformaTion.signUpConfirmPassword
  ) {
    showToast("Fill All Field", "#B00020");
    resetSignUpButton();
    return;
  } else if (
    !signUpUserInformaTion.signUpProfile ||
    !signUpUserInformaTion.signUpProfile.name
  ) {
    showToast("Upload Profile Photo", "#B00020");
    resetSignUpButton();
    return;
  }
  if (
    signUpUserInformaTion.signUpPassword !==
    signUpUserInformaTion.signUpConfirmPassword
  ) {
    showToast("Password Does Not Match", "#B00020");
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
    .then((userCredential) => {
      const user = userCredential.user;
      const addUserInfoToDB = async () => {
        try {
          const docRef = await addDoc(usersCollection, {
            userProfile: signUpUserInformaTion.signUpProfile.name,
            userName: signUpUserInformaTion.signUpName,
            userEmail: user.email,
            userPassword: signUpUserInformaTion.signUpPassword,
            userUID: user.uid,
            time: new Date(),
          });
        } catch (error) {
          showToast(error.message, "#B00020");
        }
      };
      addUserInfoToDB();
      showToast("SignUp SuccessFully", "rgb( 25, 135, 84)");
      resetSignUpButton();
      signUpForm.reset();
      window.location.replace("../Login/login.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showToast(errorMessage, "#B00020");
      resetSignUpButton();
    });
};

signUpForm.addEventListener("submit", signUpFunctionility);
