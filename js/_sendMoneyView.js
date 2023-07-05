import { userView } from "./_view";
import { everyBank } from "./_model";
import { AppState } from "./_model";
import { confirmationInterface } from "./_confirmationModal";

class SendMoney {
  //send money interface elements
  sendMoneyInterface = document.querySelector(".send-money-interface");
  accountNumberInput = document.querySelector(".account-number-input");
  listOfBanksInput = document.querySelector(".listOfBanksInput");
  amountToSendInput = document.querySelector(".amount-to-send-input");
  amountToSendRow = document.querySelector(".amount-to-send");
  foundReceiver = document.querySelector(".found");

  constructor() {
    userView.mainElement.addEventListener(
      "click",
      this.sendMoneyEventHandler.bind(this)
    );
  }

  sendMoneyEventHandler(e) {
    //if the user clicks the send button and the bank Name and account Number are filled
    if (
      e.target.classList.contains("send-money-btn") &&
      this.accountNumberInput.value &&
      this.accountNumberInput.value !== AppState.getState[0].accountNumber &&
      this.listOfBanksInput.value &&
      !this.amountToSendInput.value
    ) {
      //find the receiver the user wants to send to
      const receiver = everyBank.findAccount(
        this.listOfBanksInput.value,
        this.accountNumberInput.value
      );

      //if the receiver was found show the amount-to-send row
      if (typeof receiver !== "string") {
        //show the amount to send input
        this.amountToSendRow.classList.add("show-interface");

        //show the name of the receiver
        this.foundReceiver.textContent = `${receiver.firstName} ${receiver.lastName}`;
      } else {
        //show the error on the screen
        this.showSendError(receiver);

        //hide the amount to send row
        this.amountToSendRow.classList.remove("show-interface");
      }
    }
    //if the user clicks the send money btn and the account number entered is the same as the logged in user
    else if (
      e.target.classList.contains("send-money-btn") &&
      this.accountNumberInput.value === AppState.getState[0].accountNumber
    ) {
      //remove the amount to send row and clear the receiver message
      this.amountToSendInput.value = "";
      this.amountToSendRow.classList.remove("show-interface");
      this.foundReceiver.textContent = "";

      //clear the sending state if there was anything stored in it
      AppState.clearReceiverDetails();
    }
    //if the send money button is clicked, the user entered an amount and the receiving account actually exists
    else if (
      e.target.classList.contains("send-money-btn") &&
      this.accountNumberInput.value &&
      this.amountToSendInput.value &&
      typeof everyBank.findAccount(
        this.listOfBanksInput.value,
        this.accountNumberInput.value
      ) !== "string"
    ) {
      //get the amount entered in the amount input
      const amountToSend = this.amountToSendInput.value;

      //receiver details
      const receiver = everyBank.findAccount(
        this.listOfBanksInput.value,
        this.accountNumberInput.value
      );

      //check if the user has the money. if they do the confirmation modal is shown if they do not, an error is shown
      this.checkIfTheUserHasTheMoney(
        receiver,
        amountToSend,
        this.showSendError.bind(this)
      );
    }
  }

  //renders the error gotten trying to send money
  showSendError(err) {
    this.foundReceiver.textContent = err;
  }

  //clears the input elements in the send money interface
  clearInputElements() {
    this.foundReceiver.textContent = "";
    this.accountNumberInput.value = "";
    this.amountToSendInput.value = "";
    this.listOfBanksInput.value = "";
    this.amountToSendRow.classList.remove("show-interface");
  }

  //checks if the user has the money to send
  checkIfTheUserHasTheMoney(receiver, amountToSend, errorHandler) {
    //if the user has the money
    if (
      AppState.getState[0].accountBalance > amountToSend &&
      amountToSend > 0
    ) {
      //store the receivers account and outgoing amount in receiver details
      AppState.getReceiverDetails.reciverAccount.push(receiver);
      AppState.getReceiverDetails.outgoingAmount.push(amountToSend);

      //show confirmation modal
      confirmationInterface.showConfirmationModal(receiver, amountToSend);
    }
    //if the user does not have the money, show the error using the passed handler
    else {
      amountToSend < 0
        ? errorHandler("Impossible Transaction")
        : errorHandler("Insufficient Funds");
    }
  }
}

export const sendMoney = new SendMoney();
