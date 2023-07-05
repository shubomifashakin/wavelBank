import { cont } from "./controller";

class LogAction {
  logInSection = document.querySelector(".log-in");
  logInUsername = document.querySelector(".log-in-username");
  logInPassword = document.querySelector(".log-in-password");
  logInError = document.querySelector(".log-in-error");
  logInBtn = document.querySelector(".log-in-btn");

  logOutBtn = document.querySelector(".log-out-btn");

  constructor() {
    //when the user clicks the logIn button
    this.logInBtn.addEventListener("click", function (e) {
      e.preventDefault();
      cont.logIn(e);
    });

    //when the user clicks the log out button
    this.logOutBtn.addEventListener("click", function () {
      cont.logOut();
    });
  }

  //shows the log in error
  showLogInError(error) {
    this.logInError.textContent = error;
    this.logInError.classList.add("show-error");
  }
}

export const logInOut = new LogAction();
