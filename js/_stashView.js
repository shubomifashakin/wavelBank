import { userView } from "./_view";
import { confirmationInterface } from "./_confirmationModal";
import { AppState } from "./_model";

class StashView {
  interfaceName = "Stash";
  stashInterface = document.querySelector(".stash-interface");
  stashActionInput = document.querySelector(".stash-action-input");
  stashMenu = document.querySelector(".stash-amount-menu");
  stashAmountInput = document.querySelector(".stash-amount-input");
  saveToStashBtn = document.querySelector(".stash-btn");

  constructor() {
    userView.mainElement.addEventListener(
      "click",
      this.stashViewEventHandler.bind(this)
    );
  }

  stashViewEventHandler() {
    //if the main Element is clicked but it is not the stashInterface active do not do anything
    if (this.interfaceName !== "Stash") return;

    //if the dropdown is clicked, show the stash Menu
    if (
      this.stashActionInput.value === "Deposit" ||
      this.stashActionInput.value === "Withdrawal"
    ) {
      this.stashMenu.classList.add("show-interface");
    }

    this.saveToStashBtn.addEventListener(
      "click",
      this.saveToStashCb.bind(this)
    );
  }

  saveToStashCb() {
    //if the user tries to deposit to the stash and amount typed is less than or the same as account balance
    if (
      this.stashActionInput.value === "Deposit" &&
      this.stashAmountInput.value > 100 &&
      this.stashAmountInput.value <= AppState.getState[0].accountBalance
    ) {
      //set pendingStashCredit to the money we want to send to the stash
      AppState.getState[0].setPendingStashCredit = this.stashAmountInput.value;

      //show the confirmation interface
      confirmationInterface.confirmationModal.classList.add("show-interface");
    }
    //if the user tries to withdraw from the stash and the amount requested is less than or the same as available amount in stash
    else if (
      this.stashActionInput.value === "Withdrawal" &&
      this.stashAmountInput.value > 100 &&
      this.stashAmountInput.value <= AppState.getState[0].getStashBalance
    ) {
      //set pendingStashDebit to the money we want to withdraw from the stash
      AppState.getState[0].setPendingStashDebit = -this.stashAmountInput.value;

      //show the confirmation interface
      confirmationInterface.confirmationModal.classList.add("show-interface");
    }
  }
}

export const Stash = new StashView();
