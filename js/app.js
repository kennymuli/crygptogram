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
  const contractAddress = '0x02db90c30790f11ae8a2bf960a9bcc02437097b7'; // Replace with your contract address
  const contractABI = [
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
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
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
    }
  ]; // Update with your contract ABI
  
  let web3;
  let cryptogram;
  
  function startApp() {
    // Modern dapp browsers...
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          cryptogram = new web3.eth.Contract(contractABI, contractAddress);
          console.log('Cryptogram contract:', cryptogram);
        })
        .catch((error) => {
          console.log('User denied account access');
        });
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      cryptogram = new web3.eth.Contract(contractABI, contractAddress);
      console.log('Cryptogram contract:', cryptogram);
    }
    // Non-dapp browsers...
    else {
      console.log('No web3 provider detected');
    }
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
  