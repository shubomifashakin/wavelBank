import { sendMoney } from "./sendMoneyView";
import { userView } from "./view";
import { everyBank } from "./model";
import { AppState } from "./model";

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
    //if the confirm send button was clicked and the user has entered the correct pin
    else if (
      e.target.classList.contains("confirm-send-money-btn") &&
      this.confirmationInput.value === AppState.getState[0].getPassword
    ) {
      //debit the user
      AppState.getState[0].newDebit(
        AppState.getReceiverDetails.outgoingAmount[0],
        userView.currentDate,
        AppState.getReceiverDetails.reciverAccount[0].getFullName
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
          AppState.getState[0].getFullName
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
  }

  showAndRemoveSuccessModal() {
    this.successModalAmount.textContent =
      AppState.getReceiverDetails.outgoingAmount[0];
    this.successModalReceiver.textContent =
      AppState.getReceiverDetails.reciverAccount[0].getFullName;
    this.successModal.classList.add("show-success-modal");

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
