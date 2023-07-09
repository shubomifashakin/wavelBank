import { sendMoney } from "./_sendMoneyView";
import { userView } from "./_view";
import { everyBank } from "./_model";
import { AppState } from "./_model";

class ConfirmationModal {
  confirmationModal = document.querySelector(".confirmation-interface");
  confirmationInput = document.querySelector(".confirmation-screen");
  receiverNamesConfirmation = document.querySelector(".confirm-receiver");
  successModal = document.querySelector(".transfer-success-modal");
  successModalReceiver = document.querySelector(".transfer-success-receiver");
  successModalAmount = document.querySelector(".transfer-success-amount");

  constructor() {
    //handling clicks in the confirmation modal
    this.confirmationModal.addEventListener(
      "click",
      this.confirmationModalEventHandler.bind(this)
    );
  }

  //handles all click events in the confirmation modal
  confirmationModalEventHandler(e) {
    //if a digit is clicked and the confirmation input screen text is less than 7
    if (
      e.target.classList.contains("confirm-digit") &&
      this.confirmationInput.value.length < 7
    ) {
      //add the number to the input field
      this.confirmationInput.value += e.target.value;
    }
    //if delete button was clicked
    else if (e.target.classList.contains("confirm-delete")) {
      //delete the last digit
      this.deleteConfirmationText();
    }
    //if the cancel button was clicked
    else if (e.target.classList.contains("confirm-cancel")) {
      this.removeConfirmationModal();
      AppState.clearReceiverDetails();
    }
    //if the confirm send button was clicked and the user has entered the correct pin to send money
    else if (
      e.target.classList.contains("confirm-btn") &&
      this.confirmationInput.value === AppState.getState[0].getPassword &&
      AppState.getReceiverDetails.reciverAccount[0]
    ) {
      //debit the user
      AppState.getState[0].newDebit(
        AppState.getReceiverDetails.outgoingAmount[0],
        userView.currentDate,
        AppState.getReceiverDetails.reciverAccount[0].getFullName,
        AppState.getReceiverDetails.receiverNote
      );

      //find the receiving user and credit the user
      everyBank
        .findAccount(
          document.querySelector(".listOfBanksInput").value,
          AppState.getReceiverDetails.reciverAccount[0].accountNumber
        )
        .newCredit(
          AppState.getReceiverDetails.outgoingAmount[0],
          userView.currentDate,
          AppState.getState[0].getFullName,
          AppState.getReceiverDetails.receiverNote
        );

      //remove the confirmation modal
      this.removeConfirmationModal();

      //show a success modal to indicate the transfer was successful
      this.showAndRemoveSuccessModal.bind(this)();

      //clear the sending state
      AppState.clearReceiverDetails();

      //update the ui
      userView.updateUI();
    }
    // the confirm button is clicked, the user wants to save to stash, and the correct password was entered
    else if (
      e.target.classList.contains("confirm-btn") &&
      this.confirmationInput.value === AppState.getState[0].getPassword &&
      AppState.getState[0].getPendingStashCredit
    ) {
      //push the money into the stash
      AppState.getState[0].getStash.push(
        AppState.getState[0].getPendingStashCredit
      );

      //debit the user
      AppState.getState[0].newDebit(
        AppState.getState[0].getPendingStashCredit,
        userView.currentDate,
        AppState.getState[0].getFullName,
        "Stash Deposit"
      );

      //update the ui
      userView.updateUI();

      //remove the confirmation modal
      this.removeConfirmationModal();

      //show success modal
      this.showAndRemoveSuccessModal(
        AppState.getState[0],
        AppState.getState[0].getPendingStashCredit
      );

      //clear the pending stash credit
      AppState.getState[0].setPendingStashCredit = 0;
    }
    //if the user wants to withdraw from stash, the confirm button is clicked and the correct password was entered
    else if (
      e.target.classList.contains("confirm-btn") &&
      this.confirmationInput.value === AppState.getState[0].getPassword &&
      AppState.getState[0].getPendingStashDebit
    ) {
      //push the money into the stash
      AppState.getState[0].getStash.push(
        AppState.getState[0].getPendingStashDebit
      );

      //credit the user
      AppState.getState[0].newCredit(
        -AppState.getState[0].getPendingStashDebit,
        userView.currentDate,
        AppState.getState[0].getFullName,
        "Stash Withdrawal"
      );

      //update the ui
      userView.updateUI();

      //remove the confirmation modal
      this.removeConfirmationModal();

      //clear the pending stash debit
      AppState.getState[0].setPendingStashDebit = 0;
    }
  }

  showAndRemoveSuccessModal(user, amount) {
    //if the user sent money to another person
    if (!user) {
      this.successModalAmount.textContent =
        AppState.getReceiverDetails.outgoingAmount[0];
      this.successModalReceiver.textContent =
        AppState.getReceiverDetails.reciverAccount[0].getFullName;
      this.successModal.classList.add("show-success-modal");
    }
    //if the user sent money to his/her stash
    else {
      this.successModalAmount.textContent = amount;
      this.successModalReceiver.textContent = user.getFullName;
      this.successModal.classList.add("show-success-modal");
    }

    setTimeout(
      function (successModal) {
        successModal.classList.remove("show-success-modal");
      },
      3000,
      this.successModal
    );
  }

  //removes the confirmation modal
  removeConfirmationModal() {
    sendMoney.clearInputElements();
    this.receiverNamesConfirmation.textContent = "";
    this.confirmationInput.value = "";
    this.confirmationModal.classList.remove("show-interface");
  }

  //delete password digits
  deleteConfirmationText() {
    const cloneField = this.confirmationInput.value.split("");
    cloneField.splice(-1, 1);
    this.confirmationInput.value = cloneField.join("");
  }

  //shows the confirmation modal with the receivers name
  showConfirmationModal(receiver, amount) {
    this.receiverNamesConfirmation.textContent = `Send ${amount} to ${receiver.lastName} ${receiver.firstName}`;
    this.confirmationModal.classList.add("show-interface");
  }
}

export const confirmationInterface = new ConfirmationModal();
