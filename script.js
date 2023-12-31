'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-06-29T17:01:17.194Z',
    '2023-07-01T23:36:17.929Z',
    '2023-07-03T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-PH',
};

const accounts = [account1, account2];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// procedures

// display date
const calcDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// reusable currency formatter
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  // to set movements dummy inputs to empty
  containerMovements.innerHTML = '';

  const sortedMovements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // creating html with the movements information/transaction history
  sortedMovements.forEach(function (amount, i) {
    // to check if amount is greater than 0? then type = deposit else withdrawal
    const type = amount > 0 ? 'deposit' : 'withdrawal';

    // Date in the current balance
    const date = new Date(acc.movementsDates[i]);
    const displayDate = calcDate(date, acc.locale);

    // currency formatter
    const formattedMov = formatCurrency(amount, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov} </div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//display total and display as current balance
const calcDisplayBalance = function (account) {
  // reduce
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

//display total deposits, withdrawals and interest
const calcDisplaySummary = function (acc) {
  // displaying the total deposits
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  // displaying total withdrawals
  const withdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = formatCurrency(
    withdrawals,
    acc.locale,
    acc.currency
  );

  // displaying the interest
  // every deposit * 1.2 = interest
  // only if interest atleast 1 euro, if not exclude interest below 1 euro
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

//creating a function that makes acount user to its initials
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (account) {
  // display movements
  displayMovements(account);
  // display balance
  calcDisplayBalance(account);
  // display summary
  calcDisplaySummary(account);
};

// login functionality
let currentAccount, timer;

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

const startLogOutTime = function () {
  let time = 600;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  // optional chaining to check if current user exist
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Date in the current balance
    // Date internatinalization API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // clear user inputs
    inputLoginUsername.value = inputLoginPin.value = '';

    // to remove the focus of cursor in the inputs
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTime();

    // update UI
    updateUI(currentAccount);
  }
});

// transfer functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    // amount is not negative
    amount > 0 &&
    // receiver exist?
    receiverAccount &&
    // balance is greater or equal to amount
    currentAccount.balance >= amount &&
    // receiver must not same current account, wont send to own account
    receiverAccount?.username !== currentAccount.username
  ) {
    // transfer process
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTime();
  }
});

// loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const isEligible = currentAccount.movements.some(mov => mov >= amount * 0.1);

  if (amount > 0 && isEligible) {
    setTimeout(function () {
      // add movements
      currentAccount.movements.push(amount);

      // transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);
    }, 2500);
  }

  clearInterval(timer);
  timer = startLogOutTime();

  inputLoanAmount.value = '';
});

//account close functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    // delete the account
    accounts.splice(index, 1);
    // hide the UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// sorting the movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// LECTURES

// // conversion
// console.log(Number('23'));
// //23
// console.log(+'23');
// //23

// // parsing
// console.log(Number.parseInt('30px', 10));
// //30
// console.log(Number.parseInt('e23', 10));
// //NaN

// console.log(Number.parseInt('2.5rem'));
// //2
// console.log(Number.parseFloat('2.5rem'));
// //2.5

// //Check if value is NaN
// console.log(Number.isNaN(20));
// // false
// console.log(Number.isNaN('20'));
// // false
// console.log(Number.isNaN(+'20X'));
// // true
// console.log(Number.isNaN(23 / 0));
// // false

// //Check if value is a number
// console.log(Number.isFinite(20));
// // true
// console.log(Number.isFinite('20'));
// // false
// console.log(Number.isFinite(+'20X'));
// // false
// console.log(Number.isFinite(23 / 0));
// // false

// console.log(Number.isInteger(20));
// // true

// // Math and Rounding
// console.log(Math.sqrt(25));
// // 5
// console.log(25 ** (1 / 2));
// // 5
// console.log(8 ** (1 / 3));
// // 2

// console.log(Math.max(5, 12, 16, 23, 1, 5, 7));
// // 23
// console.log(Math.max(5, 12, 16, '25', 1, 5, 7));
// // 25
// console.log(Math.max(5, 12, '33px', '25', 1, 5, 7));
// // NaN

// console.log(Math.min(5, 12, 16, 23, 1, 5, 7));
// // 1

// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// // 314.1592653589793

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randoInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;

// console.log(randoInt(10, 20));

// // Rounding integers
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor('23.9'));

// console.log(Math.trunc(23.3));
// console.log(Math.trunc('23.9'));

// console.log(Math.floor(-23.3));
// console.log(Math.floor(-23.3));

// // rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// console.log(+(2.345).toFixed(2));

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());
// console.log(new Date(1688314448858));

// future.setFullYear(2050);
// console.log(future);

// const ingredients = ['olive', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// );

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// //setInterval
// setInterval(function () {
//   const now = new Date();
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const minute = `${now.getMinutes()}`.padStart(2, 0);
//   const getSeconds = `${now.getSeconds()}`.padStart(2, 0);
//   console.log(`${hour}:${minute}:${getSeconds}`);
// }, 1000);
