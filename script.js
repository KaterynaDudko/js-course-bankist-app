'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-10-23T07:42:02.383Z',
    '2020-11-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-04T14:11:59.604Z',
    '2020-07-26T17:01:17.234Z',
    '2024-02-06T23:36:17.929Z',
    '2024-02-08T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-10-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2019-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.234Z',
    '2020-07-28T23:36:17.929Z',
    '2023-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-02-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-27T17:01:170234Z',
    '2020-08-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAcc;
let sorted = false;
// APP LOGIC

//LOG IN to the app

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc);
  //Display Balance
  displayCurrentBalance(acc);

  //Display Summary
  displaySummary(acc);
};

const getCurrentDate = function (locale) {
  const now = new Date();

  // Get locale from user's browser
  // const locale = navigator.language;
  // console.log(locale);

  const options = {
    day: 'numeric',
    minute: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(now);
};

//Event Handlers
btnLogin.addEventListener('click', function (e) {
  //prevent page reload
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    //Display UI
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //FIRST EDITION
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = getCurrentDate(currentAcc.locale);
    updateUI(currentAcc);
  }
  //TODO: show error if no user found or pin in incorrect
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    amount <= currentAcc.balance &&
    receiverAcc &&
    receiverAcc?.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAcc.movementsDates.push(new Date());
    updateUI(currentAcc);
  }

  //TODO: show msg if transfer is impossible
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAcc.username === inputCloseUsername.value &&
    currentAcc.pin === Number(inputClosePin.value)
  ) {
    const accToCloseIndex = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    console.log(accToCloseIndex);
    accounts.splice(accToCloseIndex, 1);
    console.log(accounts);
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    currentAcc.movements.push(amount);
    currentAcc.movementsDates.push(new Date());
    updateUI(currentAcc);
  }
  inputLoanAmount.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcc, !sorted);
  sorted = !sorted;
});

//Display movements
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    //Empty movements container to remove starter data
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const movDate = new Date(acc.movementsDates[i]);

    const date = formatMovementDate(movDate, acc.locale);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i} ${type}</div>
        <div class="movements__date">${date}</div>
        <div class="movements__value">${mov.toFixed(2)}</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Compute Usernames for each account
const createUsername = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
const user = 'Steven Thomas Williams';
createUsername(accounts);

//Display current balance
const displayCurrentBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

//Calculate summary
const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};
