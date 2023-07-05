import { userView } from "./_view";
class PayBills {
  payBillsInterface = document.querySelector(".pay-bills-interface");
  listOfBillsInput = document.querySelector(".listOfBillsInput");
  allPayBillsMenus = document.querySelectorAll(".pay-bills-menu");
  airtimePurchaseMenu = document.querySelector(".airtime-purchase-menu");
  internetServicesMenu = document.querySelector(".internet-service-menu");
  dstvMenu = document.querySelector(".dstv-menu");

  constructor() {
    userView.mainElement.addEventListener(
      "click",
      this.payBillsEventHandler.bind(this)
    );
  }

  //how the bank app handles clicks on the main element when the pay bills interface is active
  payBillsEventHandler(e) {
    if (this.listOfBillsInput.value === "Airtime Purchase") {
      this.clearPayBillsMenu(this.airtimePurchaseMenu);
    } else if (this.listOfBillsInput.value === "Internet Services") {
      this.clearPayBillsMenu(this.internetServicesMenu);
    } else if (this.listOfBillsInput.value === "DSTV payment") {
      this.clearPayBillsMenu(this.dstvMenu);
    }
  }

  //hides all the menus in the paybills section and shows the one passed
  clearPayBillsMenu(el) {
    //hides all the menus
    this.allPayBillsMenus.forEach((c) => c.classList.remove("show-interface"));
    //shows the menu passed into the function
    el.classList.add("show-interface");
  }
}

export const payBills = new PayBills();
