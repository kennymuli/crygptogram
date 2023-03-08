// Load web3.js library
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      // User denied account access...
      console.log('User denied account access');
    }
  } else {
    console.log('No web3 provider detected');
  }
  startApp();
});

//Setup contract
const contractAddress = '0xe01A39e613dfe2aC90c90067B7B7b409f26B14F6'; // Replace with your contract address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_encryptedMessage",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_substitutionCipher",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "encryptedMessage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "playerSolution",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reward",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "solution",
				"type": "string"
			}
		],
		"name": "setPlayerSolution",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_playerSolution",
				"type": "string"
			}
		],
		"name": "submitSolution",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "substitutionCipher",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "verifySolution",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; // Update with your contract ABI

let web3;
let cryptogram;

async function startApp() {
  // Modern dapp browsers...
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log('User denied account access');
    }
    cryptogram = new web3.eth.Contract(contractABI, contractAddress);
    console.log('Cryptogram contract:', cryptogram);
    const encryptedMessage = await cryptogram.methods.encryptedMessage().call();
    document.getElementById("message").textContent = encryptedMessage;
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    cryptogram = new web3.eth.Contract(contractABI, contractAddress);
    console.log('Cryptogram contract:', cryptogram);
    const encryptedMessage = await cryptogram.methods.encryptedMessage().call();
    document.getElementById("message").textContent = encryptedMessage;
  }
  // Non-dapp browsers...
  else {
    console.log('No web3 provider detected');
  }
};

async function submitSolution(event) {
  event.preventDefault();
  console.log("submitSolution function called");

  const solution = document.getElementById("solution").value;
  console.log("solution:", solution);

  const encryptedMessage = document.getElementById("message").textContent;
  console.log("encryptedMessage:", encryptedMessage);

  if (solution.length !== encryptedMessage.length) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "Your current guess doesn't match the length of the encrypted message.";
    return;
  }

  console.log("encryptedMessage:", encryptedMessage);
  console.log("guessed:", guessed);
  console.log("solution:", solution);

  const accounts = await web3.eth.getAccounts();

  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "Checking your answer on-chain. One moment.";

  try {
    await cryptogram.methods.setPlayerSolution(solution).send({ from: accounts[0] });

    console.log("solution submitted to smart contract");

    const isCorrect = await cryptogram.methods.verifySolution().call();
    console.log("isCorrect:", isCorrect);

    const guessed = await cryptogram.methods.playerSolution().call();
    console.log("guessed:", guessed);

    if (isCorrect) {
      errorMessage.textContent = "Congratulations! You got the answer correct.";
    } else {
      errorMessage.textContent = "Sorry, that's incorrect. You can try again!";
    }

    // Clear any existing message
    const messageContainer = document.getElementById("message");
    messageContainer.innerHTML = "";

    // Iterate through the encrypted message and guessed word
    for (let i = 0; i < encryptedMessage.length; i++) {
      const letter = encryptedMessage.charAt(i);
      const guessedLetter = guessed.charAt(i);

      // Create a span element for each letter
      const span = document.createElement("span");
      span.classList.add("letter");

      if (letter === " ") {
        // Add a space
        span.textContent = " ";
      } else if (guessedLetter !== "_" && guessedLetter !== letter) {
        // Add the incorrectly guessed letter
        span.textContent = guessedLetter;
      } else if (solution.includes(letter)) {
        // Add the correctly guessed letter
        span.textContent = letter;
      } else {
        // Add an underscore for an incorrect guess
        span.textContent = "_";
      }

      // Append the span element to the message container
      messageContainer.appendChild(span);
    }
  } catch (error) {
    console.error(error);
    errorMessage.textContent = "There was an error checking your answer on-chain. Please try again.";
  }
};

function checkSolutionLength(event) {
  const solution = document.getElementById("solution").value;
  const encryptedMessage = document.getElementById("message").textContent;
  const submitButton = document.getElementById("submit-button");
  console.log(encryptedMessage);
  console.log(encryptedMessage.length);

  if (solution.length !== encryptedMessage.length) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "Your current guess doesn't match the length of the encrypted message.";
    submitButton.disabled = true;
  } else {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    submitButton.disabled = false;
  }
};

const solutionInput = document.getElementById("solution");
solutionInput.addEventListener('input', checkSolutionLength);