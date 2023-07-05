import * as model from "./model.js";
import { userView } from "./view.js";
import { payBills } from "./payBills.js";
import { sendMoney } from "./sendMoneyView.js";
import { confirmationInterface } from "./confirmationModal.js";
import { logInOut } from "./logInOut.js";
import "core-js/stable";

class Controller {
  logIn(e) {
    //if the user has not entered both username and password
    if (!logInOut.logInUsername.value && !logInOut.logInPassword.value) return;

    //continues here if user entered username and password

    //gets the user requested from the bank
    const userAccount = model.wavelBank.findUser(
      logInOut.logInUsername.value,
      logInOut.logInPassword.value
    );

    //if the returned info is an actual user store it in the state and log in
    if (typeof userAccount !== "string") {
      //push the account into the state
      model.AppState.getState.push(userAccount);

      //remove the log in interface
      logInOut.logInUsername.value = "";
      logInOut.logInPassword.value = "";
      logInOut.logInError.textContent = "";
      logInOut.logInSection.classList.remove("show-interface");

      //update the UI to show the users account information
      userView.updateUI();

      //show the transactions page
      userView.showTransactions();
    } else {
      //show the error message returned
      logInOut.showLogInError(userAccount);
    }
  }

  logOut() {
    model.AppState.getState.pop();
    //send the state to the view
    logInOut.logInSection.classList.add("show-interface");
  }
}

export const cont = new Controller();
