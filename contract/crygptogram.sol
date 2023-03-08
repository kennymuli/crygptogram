pragma solidity ^0.8.0;

contract Cryptogram {
    address public owner;
    string public encryptedMessage;
    string public substitutionCipher;
    string public playerSolution;
    uint public reward = 100000000000000000;

    constructor(string memory _encryptedMessage, string memory _substitutionCipher) {
        owner = msg.sender;
        encryptedMessage = _encryptedMessage;
        substitutionCipher = _substitutionCipher;
    }

    function submitSolution(string calldata _playerSolution) public {
        require(bytes(_playerSolution).length == bytes(encryptedMessage).length, "Solution length does not match encrypted message length");

        uint numSpaces = 0;
        bytes memory cipher = bytes(encryptedMessage);
        for (uint i = 0; i < cipher.length; i++) {
            if (cipher[i] == " ") {
                numSpaces++;
            }
        }
        require(numSpaces == countSpaces(_playerSolution), "Solution does not contain the correct number of spaces");

        playerSolution = _playerSolution;
        if (verifySolution()) {
            payable(msg.sender).transfer(reward);
            playerSolution = "";
        } else {
            playerSolution = "";
        }
    }

    function countSpaces(string memory str) internal pure returns (uint) {
        bytes memory bytesStr = bytes(str);
        uint numSpaces = 0;
        for (uint i = 0; i < bytesStr.length; i++) {
            if (bytesStr[i] == " ") {
                numSpaces++;
            }
        }
        return numSpaces;
    }

    function verifySolution() public view returns (bool) {
        bytes memory cipher = bytes(encryptedMessage);
        bytes memory solution = bytes(playerSolution);
        bytes memory plain = new bytes(cipher.length);
        bytes storage cipherKey = bytes(substitutionCipher);

        for (uint i = 0; i < cipher.length; i++) {
            bytes1 cipherChar = cipher[i];
            bytes1 plainChar;
            if (cipherChar == " ") {
                plainChar = " ";
            } else {
                uint index = uint8(cipherChar) - 65;
                plainChar = bytes1(cipherKey[index]);
            }
            plain[i] = plainChar;
        }
        return keccak256(solution) == keccak256(plain);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }
}