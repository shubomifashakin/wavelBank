class App {
  #state = [];
  #receiverDetails = {
    reciverAccount: [],
    outgoingAmount: [],
  };

  get getState() {
    return this.#state;
  }

  get getReceiverDetails() {
    return this.#receiverDetails;
  }

  //removes the money to send and account to send to
  clearReceiverDetails() {
    this.#receiverDetails.reciverAccount.pop();
    this.#receiverDetails.outgoingAmount.pop();
  }
}

export const AppState = new App();

class allBanks {
  #banks = [];

  registerBank(bank) {
    this.#banks.push(bank);
  }

  //checks if a bank exists, if the bank exists it checks if the account number exists in that bank
  findAccount(bankName, accNo) {
    if (this.#banks.find((bank) => bank.bankName === bankName.toLowerCase())) {
      let foundBank = this.#banks.find(
        (bank) => bank.bankName === bankName.toLowerCase()
      );

      //check if the account exists in the bank
      return foundBank.findAccount(accNo);
    } else {
      //the bank does not exist
      return "Sorry!This Bank Does Not Exist";
    }
  }
}

export const everyBank = new allBanks();

class bank {
  bankName;
  #accounts = [];

  constructor(bankName) {
    this.bankName = bankName;
    //when a bank is created it is automatically registered
    everyBank.registerBank(this);
  }

  addNewAccount(newAccount) {
    this.#accounts.push(newAccount);
  }

  //to log in to the web app
  findUser(user, password) {
    //finds the account in the bank
    const foundUser = this.#accounts.find((acc) => acc.username === user);
    if (foundUser) {
      //if the foundUsers password is the same as the password entered
      return foundUser.getPassword === password
        ? foundUser
        : "Incorrect Password";
    } else {
      return "No user Found";
    }
  }

  //finds the account with this account number
  findAccount(accountNumber) {
    //finds the account with the passed account number
    const foundAccount = this.#accounts.find(
      (acc) => acc.accountNumber === accountNumber
    );

    //if an account is found, it returns the account if not it returns the string
    return foundAccount ? foundAccount : "Account does not exist";
  }
}

//create the bank
export const wavelBank = new bank("wavel");
export const ecobank = new bank("ecobank");

export class account {
  accountType;
  #password;
  #bvn;
  #card;
  #stash = [];

  constructor(
    username,
    firstName,
    lastName,
    password,
    email,
    address,
    bvn,
    card,
    accountNumber,
    accountType
  ) {
    (this.username = username),
      (this.firstName = firstName),
      (this.lastName = lastName),
      (this.#password = password),
      (this.email = email),
      (this.address = address),
      (this.#card = card),
      (this.#bvn = bvn),
      (this.accountNumber = accountNumber);
    this.accountType = accountType;

    //immediately adds the details of the account created to the bank
    this.pushToBank();
  }

  get getFullName() {
    return this.firstName + " " + this.lastName;
  }

  #movements = {
    transactionsInOrder: [],
    timeOfTransactions: [],
    timeOfDebitsOnly: [],
    timeOfCreditsOnly: [],
    from: [],
    fromDebitsOnly: [],
    fromCreditsOnly: [],
  };

  newDebit(debit, time, from) {
    this.#movements.transactionsInOrder.push(-debit);
    this.#movements.timeOfTransactions.push(time);
    this.#movements.timeOfDebitsOnly.push(time);
    this.#movements.from.push(from);
    this.#movements.fromDebitsOnly.push(from);
  }

  newCredit(credit, time, from) {
    this.#movements.transactionsInOrder.push(credit);
    this.#movements.timeOfTransactions.push(time);
    this.#movements.timeOfCreditsOnly.push(time);
    this.#movements.from.push(from);
    this.#movements.fromCreditsOnly.push(from);
  }

  //get password
  get getPassword() {
    return this.#password;
  }

  //returns only credits
  get allCredits() {
    return this.#movements.transactionsInOrder.filter((c) => c > 0);
  }

  //returns only debits
  get allDebits() {
    return this.#movements.transactionsInOrder.filter((c) => c < 0);
  }

  //returns all transactions in order
  get allMovements() {
    return this.#movements.transactionsInOrder;
  }

  //get all from movements
  get fromMovements() {
    return this.#movements.from;
  }

  //get all from Credits
  get fromCredits() {
    return this.#movements.fromCreditsOnly;
  }

  //get all from debits
  get fromDebits() {
    return this.#movements.fromDebitsOnly;
  }

  //get all time of transactions
  get timeOfTransaction() {
    return this.#movements.timeOfTransactions;
  }

  //get all time of debits only
  get timeOfDebits() {
    return this.#movements.timeOfDebitsOnly;
  }

  //get all time of credits only
  get timeOfCredits() {
    return this.#movements.timeOfCreditsOnly;
  }

  //returns the users account balance
  get accountBalance() {
    return this.#movements.transactionsInOrder.reduce((total, curr) => {
      return total + Number(curr);
    }, 0);
  }

  //when an account is created it addss the account to the wavel banks accounts array
  pushToBank() {
    wavelBank.addNewAccount(this);
  }
}

const ac1 = new account(
  "andre200",
  "Thomas",
  "Andre",
  "1234567",
  "andrethomas@gmail.com",
  "200 vivian fowler street lagos, nigeria",
  "99448820128",
  "12345678930123",
  "0432310080",
  "savings"
);

ac1.newCredit(2550, "02/03/2023", "Diana Ross");
ac1.newDebit(8390, "20/03/2023", "Meek Mill");
ac1.newCredit(93000, "31/03/2023", "Mac Miller");
ac1.newCredit(530, "02/04/2023", "Kendrick Lamar");
ac1.newDebit(4321, "09/04/2023", "Ella Mai");

const ac2 = new account(
  "useruser",
  "Fela",
  "Adegoke",
  "1234567",
  "felaAde@icloud.com",
  "200 vivian fowler street lagos, nigeria",
  "99448820128",
  "12345678930123",
  "2004475543",
  "savings"
);
ac2.newCredit(8022, "02/03/2023", "Luka Sabbat");
ac2.newDebit(2340, "08/03/2023", "Elon Musk");
ac2.newCredit(9300, "02/04/2023", "Jermaine Cole");
ac2.newDebit(15400, "07/04/2023", "Temi Otedola");
ac2.newCredit(22300, "02/04/2023", "Kendrick Lamar");

const ac3 = new account(
  "femiote",
  "Femi",
  "Otedola",
  "1234567",
  "otedollars@gmail.com",
  "200 vivian fowler street lagos, nigeria",
  "99448820128",
  "12345678930123",
  "2122662171",
  "savings"
);
ac3.newCredit(8022, "02/03/2023", "Luka Sabbat");
ac3.newDebit(2340, "08/03/2023", "Elon Musk");
ac3.newCredit(9300, "02/04/2023", "Jermaine Cole");
ac3.newDebit(15400, "07/04/2023", "Temi Otedola");
ac3.newCredit(22300, "02/04/2023", "Kendrick Lamar");
