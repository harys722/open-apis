// Utility functions
const isPrime = (num) => {
  if (!Number.isInteger(num) || num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const isFibonacci = (num) => {
  const test1 = 5 * num * num + 4;
  const test2 = 5 * num * num - 4;
  return isPerfectSquare(test1) || isPerfectSquare(test2);
};

const isPerfectSquare = (num) => {
  if (num < 0) return false;
  const sqrt = Math.sqrt(num);
  return sqrt === Math.floor(sqrt);
};

const isArmstrong = (num) => {
  const strNum = Math.abs(num).toString();
  const numDigits = strNum.length;
  let sum = 0;
  for (let digit of strNum) {
    sum += Math.pow(parseInt(digit), numDigits);
  }
  return sum === Math.abs(num);
};

const isPalindrome = (num) => {
  const str = Math.abs(num).toString();
  return str === str.split('').reverse().join('');
};

const primeFactors = (num) => {
  const factors = [];
  let n = Math.abs(num);
  if (n < 2) return factors;

  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }
  if (n > 2) {
    factors.push(n);
  }
  return factors;
};

// Main handler
import { checkApiKey } from '../../data/auth';

export default function handler(req, res) {
  if (!checkApiKey(req, res)) {
    return; // Stop processing if not authorized
  }
  
  if (req.method !== 'GET') {
    res.status(405).send("Method Not Allowed, this endpoint only uses 'GET' requests.");
    return;
  }

  const query = req.query;
  let number;

  // Check if user provided a specific number
  if (query.number !== undefined) {
    number = parseFloat(query.number);
    if (isNaN(number)) {
      res.status(400).send("Invalid 'number' parameter.");
      return;
    }
  } else {
    // Generate random number within range
    const minParam = query.min !== undefined ? parseFloat(query.min) : undefined;
    const maxParam = query.max !== undefined ? parseFloat(query.max) : undefined;

    let minRange, maxRange;

    if (minParam !== undefined && maxParam !== undefined) {
      minRange = minParam;
      maxRange = maxParam;
    } else if (minParam !== undefined && maxParam === undefined) {
      minRange = minParam;
      maxRange = 10000;
    } else if (minParam === undefined && maxParam !== undefined) {
      minRange = 1;
      maxRange = maxParam;
    } else {
      minRange = 1;
      maxRange = 10000;
    }

    number = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
  }

  // Basic properties
  const absoluteValue = Math.abs(number);
  const isNegative = number < 0;
  const isGreaterThanZero = number > 0;
  const isEven = number % 2 === 0;
  const isOdd = !isEven;
  const isPrimeNum = isPrime(number);
  const isFibo = isFibonacci(number);
  const isSquare = isPerfectSquare(number);
  const isArm = isArmstrong(number);
  const isPalin = isPalindrome(number);
  const isDiv3 = number % 3 === 0;

  // Additional properties
  const isDecimal = !Number.isInteger(number);
  const modulo3 = number % 3;
  const modulo5 = number % 5;
  const modulo7 = number % 7;
  const digitCount = Math.abs(number).toString().length;
  const isDivisibleBy5 = number % 5 === 0;
  const isDivisibleBy10 = number % 10 === 0;

  // Formatting
  const formatted1 = number.toLocaleString('en-US');
  const formatted2 = number.toLocaleString('de-DE');
  const abbrev = (() => {
    if (Math.abs(number) >= 1_000_000_000) {
      return (number / 1_000_000_000).toFixed(1) + 'B';
    } else if (Math.abs(number) >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M';
    } else if (Math.abs(number) >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K';
    }
    return number.toString();
  })();

  // Prime factors
  const factors = primeFactors(number);

  res.json({
    number,
    absoluteValue,
    isNegative,
    isGreaterThanZero,
    isEven,
    isOdd,
    isDecimal,
    isPrime: isPrimeNum,
    isFibonacci: isFibo,
    isPerfectSquare: isSquare,
    isArmstrong: isArm,
    isPalindrome: isPalin,
    isDivisibleBy3: isDiv3,
    isDivisibleBy5: isDivisibleBy5,
    isDivisibleBy10: isDivisibleBy10,
    modulo3,
    modulo5,
    modulo7,
    digitCount,
    primeFactors: factors,
    formatted1,
    formatted2,
    abbreviated: abbrev,
    numberType: Number.isInteger(number) ? 'integer' : 'float',
    info: {
      credits: "Made by harys722, available only everyone.",
      support: "https://harys.is-a.dev/api"
    }
  });
}
