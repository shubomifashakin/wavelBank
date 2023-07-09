import { AppState } from "./_model";

class Views {
  transactionsInterface = document.querySelector(".transactions-interface");

  //navbar elements
  eyeIcon = document.querySelector(".icon-eye");
  userBalance = document.querySelector(".user-current-balance");
  stashBalance = document.querySelector(".user-stash-balance");
  userName = document.querySelector(".user-name");
  userAccountNumber = document.querySelector(".user-account-number");
  userAccountType = document.querySelector(".user-account-type");

  //sidebar icons
  transactionsIcon = document.querySelector(".transactions");
  sendMoneyIcon = document.querySelector(".send-money-icon");
  payBillsIcon = document.querySelector(".pay-bills-icon");
  stashIcon = document.querySelector(".stash-icon");
  sidebarIcons = document.querySelectorAll(".side-icon");

  mainElement = document.querySelector(".app-main-inner");

  //footer elements
  sortBtn = document.querySelector(".sort-icon");

  constructor() {
    //when the user clicks hide their account balance
    this.eyeIcon.addEventListener("click", this.hideAccountBalance.bind(this));

    //when the user clicks the transactions icon
    this.transactionsIcon.addEventListener(
      "click",
      this.showTransactions.bind(this)
    );

    //when the user clicks the sendMoney icon
    this.sendMoneyIcon.addEventListener("click", this.showInterface.bind(this));

    //when the user clicks the payBills icon
    this.payBillsIcon.addEventListener("click", this.showInterface.bind(this));

    //when the user clicks the stash icon
    this.stashIcon.addEventListener("click", this.showInterface.bind(this));

    //handling toggle clicks in the main element
    this.mainElement.addEventListener(
      "click",
      this.mainElementDelegation.bind(this)
    );

    //when the user clicks the sort button
    this.sortBtn.addEventListener("click", this.showTransactions.bind(this));
  }

  //hides the users balance
  hideAccountBalance() {
    if (this.userBalance.textContent !== "---") {
      this.userBalance.textContent = "---";
      this.stashBalance.textContent = "---";
    } else {
      //show the users account balance
      this.userBalance.textContent = new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(AppState.getState[0].accountBalance);

      this.stashBalance.textContent = new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(AppState.getState[0].getStashBalance);
    }
  }

  //show the interface on the screen
  showInterface(el) {
    //hide all the elements in the mainElement container
    [...this.mainElement.children].forEach((c) => {
      c.classList.remove("show-interface");
    });

    //if an icon is clicked
    if (el.target) {
      //remove the active class from other icons
      this.removeActiveClassFromAllIcons();

      //add the active class to the icon clicked
      el.target.classList.add("button-active");

      //show the correct section for that icon
      document
        .querySelector(`.${el.target.dataset.targetSection}`)
        .classList.add("show-interface");
    }
    //when the user logs in or clicks the transactions icon
    else {
      el.classList.add("show-interface");

      //remove the active class from other icons
      this.removeActiveClassFromAllIcons();
    }
  }

  //this renders all users transactions
  showTransactions(e) {
    //removes rendered transactions from the transactions element
    this.transactionsInterface.innerHTML = "";

    //show the transactions interface
    this.showInterface(this.transactionsInterface);

    //if the transactions button or sort button is clicked then pass e into the function OR
    //if the user logs in,
    let results = e
      ? this.toggleTransactions(e.target)
      : this.toggleTransactions();

    //for each transaction render html on screen
    results.transactions.forEach((tra, i) => {
      const html = ` <div class="transaction debit">
        <span class="transaction-info-left">
          <p class="transaction-sender-name">${results.fromMovements[i]}</p>

          <p class="transaction-date">${results.timeOfMovements[i]}</p>
        </span>

        <span class="transaction-info-right">
          <p class="transaction-sender-desc">DESC: ${
            results.transactionNotes[i]
          }</p>
          <p class="transaction-amount ${
            tra < 0 ? "debit" : "credit"
          }">${new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(tra)}</p>
        </span>
      </div>`;

      //insert the transactions into the transactions section
      this.transactionsInterface.insertAdjacentHTML("afterbegin", html);
    });
  }

  toggleTransactions(e) {
    //if the sort icon was clicked and it contains sort-all, change it to sort-credit and change all the data attributes to match the current sort class
    if (e?.classList.contains("sort-all")) {
      e.dataset.movements = "allCredits";
      e.dataset.from = "fromCredits";
      e.dataset.timemov = "timeOfCredits";
      e.dataset.notes = "creditNotes";
      e.classList.remove("sort-all");
      e.classList.add("sort-credits");
    } else if (e?.classList.contains("sort-credits")) {
      e.dataset.movements = "allDebits";
      e.dataset.from = "fromDebits";
      e.dataset.timemov = "timeOfDebits";
      e.dataset.notes = "debitNotes";
      e.classList.remove("sort-credits");
      e.classList.add("sort-debits");
    } else if (e?.classList.contains("sort-debits")) {
      e.dataset.movements = "allMovements";
      e.dataset.from = "fromMovements";
      e.dataset.timemov = "timeOfTransaction";
      e.dataset.notes = "allNotes";
      e.classList.remove("sort-debits");
      e.classList.add("sort-all");
    }

    //if the sort icon was clicked, let the transactions,fromMovements and timeMov be gotten from their respective datasets

    //but if the user logged in or clicked the transactions icon, get all transactions,fromMovements and timeOfTransactions
    let transactions = e?.classList.contains("sort-icon")
      ? AppState.getState[0][e.dataset.movements]
      : AppState.getState[0].allMovements;
    let fromMovements = e?.classList.contains("sort-icon")
      ? AppState.getState[0][e.dataset.from]
      : AppState.getState[0].fromMovements;
    let timeOfMovements = e?.classList.contains("sort-icon")
      ? AppState.getState[0][e.dataset.timemov]
      : AppState.getState[0].timeOfTransaction;
    let transactionNotes = e?.classList.contains("sort-icon")
      ? AppState.getState[0][e.dataset.notes]
      : AppState.getState[0].allNotes;
    return { transactions, fromMovements, timeOfMovements, transactionNotes };
  }

  //call back for handling clicks in the main element
  mainElementDelegation(e) {
    e.preventDefault();
    //if the user clicks on a dropdown input s
    if (e.target.classList.contains("listToggler")) {
      //the dropdown menu
      const dropdownList = document.querySelector(
        `.${e.target.dataset.toggler}`
      );

      //show the dropdown menu
      dropdownList.classList.toggle("show-interface");

      //add an event listener to the dropdown list so we can capture the values
      dropdownList.addEventListener("click", function (el) {
        //element clicked on list
        const listItemClicked = el.target;
        //add the value clicked on the list to the input element
        listItemClicked.classList.contains("list-item")
          ? ((e.target.value = el.target.textContent),
            dropdownList.classList.remove("show-interface"))
          : null;
      });
    }
  }

  //returns the current date
  get currentDate() {
    return new Intl.DateTimeFormat("en-us", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());
  }

  //removes active style from all icons in sideBar
  removeActiveClassFromAllIcons() {
    this.sidebarIcons.forEach((icon) => icon.classList.remove("button-active"));
  }

  //updates the ui to show recent changes to state
  updateUI() {
    //shows recent account balance
    this.userBalance.textContent = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(AppState.getState[0].accountBalance);

    //shows user account number
    this.userAccountNumber.textContent = `${
      AppState.getState[0].accountNumber
    } - - ${AppState.getState[0].accountType.toUpperCase()}`;
    this.userName.textContent = AppState.getState[0].lastName;

    //shows the users stash Balance
    this.stashBalance.textContent = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(AppState.getState[0].getStashBalance);
  }
}

export const userView = new Views();
