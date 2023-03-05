const cryptogramContract = new web3.eth.Contract(contractAbi, contractAddress);

// submit solution when the user clicks the submit button
document.getElementById('submit-button').addEventListener('click', async () => {
  const encryptedMessage = document.getElementById('encrypted-message').value;
  const substitutionCipher = document.getElementById('substitution-cipher').value;
  const playerSolution = document.getElementById('player-solution').value;
  await cryptogramContract.methods.submitSolution(playerSolution).send({ from: userAccount });
  const isCorrect = await cryptogramContract.methods.verifySolution().call();
  if (isCorrect) {
    const reward = await cryptogramContract.methods.reward().call();
    document.getElementById('result-message').innerText = `Congratulations, your solution is correct! You earned ${reward} Ether.`;
  } else {
    document.getElementById('result-message').innerText = 'Sorry, your solution is incorrect. Please try again.';
  }
});
