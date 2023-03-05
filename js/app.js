// Load web3.js library
window.addEventListener('load', async () => {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3 provider detected');
  }
  await window.ethereum.enable();
  startApp();
});

// Set up contract
const contractAddress = '0x1234567890123456789012345678901234567890'; // Replace with your contract address
const contractABI = [
  // Replace with your contract ABI
];

let cryptogram;

function startApp() {
  cryptogram = new web3.eth.Contract(contractABI, contractAddress);
  console.log('Cryptogram contract:', cryptogram);
}

// Submit solution
async function submitSolution(event) {
  event.preventDefault();
  const solution = document.getElementById("solution").value;
  const result = await cryptogram.methods.checkSolution(solution).call();
  const guessed = await cryptogram.methods.getGuessedWord().call();
  document.getElementById("result").textContent = result;
  document.getElementById("guessed").textContent = `You guessed: ${guessed}`;
}
document.getElementById("submit").addEventListener("click", submitSolution);
