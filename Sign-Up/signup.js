import {
  showToast,
  auth,
  createUserWithEmailAndPassword,
  db,
  storage,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../firebase.js";

const signUpForm = document.querySelector(".signup-form");
const signUpSubmitBtn = document.querySelector("#SignUpBtn");
// const usersCollection = collection(db, "Users");
const resetSignUpButton = () => {
  signUpSubmitBtn.innerHTML = `Sign Up`;
  signUpSubmitBtn.style.opacity = "1";
  signUpSubmitBtn.style.cursor = "pointer";
  signUpSubmitBtn.disabled = false;
};
const signUpFunctionility = async () => {
  event.preventDefault();
  const signUpFormData = new FormData(signUpForm);
  const signUpUserInformaTion = {
    signUpName: signUpFormData.get("SignUpName"),
    signUpEmail: signUpFormData.get("SignUpEmail"),
    signUpPhoneNumber: signUpFormData.get("SignUpPhoneNumber"),
    signUpPassword: signUpFormData.get("SignUpPassword"),
    signUpConfirmPassword: signUpFormData.get("SignUpConfirmPassword"),
    signUpProfile: signUpFormData.get("SignUpProfile"),
    signedUpUserTime: new Date(),
  };
  if (
    !signUpUserInformaTion.signUpName ||
    !signUpUserInformaTion.signUpEmail ||
    !signUpUserInformaTion.signUpPhoneNumber ||
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
      const userRef = ref(storage, `User/${userCredential.user.uid}`);
      uploadBytes(userRef, signUpUserInformaTion.signUpProfile)
        .then((a) => {
          console.log(a);
          getDownloadURL(userRef)
            .then((URL) => {
              signUpUserInformaTion.signUpProfile = URL;
              const userDocRef = doc(db, "User", userCredential.user.uid);
              setDoc(userDocRef, signUpUserInformaTion)
                .then((b) => {
                  showToast("SignUp SuccessFully", "rgb( 25, 135, 84)");
                  signUpForm.reset();
                  resetSignUpButton();
                  window.location.href = "../Login/login.html";
                })
                .catch((error) => {
                  showToast(error, "#B00020");
                });
            })
            .catch((error) => {
              showToast(error, "#B00020");
            });
        })
        .catch((error) => {
          showToast(error, "#B00020");
        });
    })
    .catch((error) => {
      showToast(error.message, "#B00020");
      resetSignUpButton();
    });
};

signUpForm.addEventListener("submit", signUpFunctionility);
