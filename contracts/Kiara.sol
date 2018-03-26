pragma solidity ^0.4.11;

contract Kiara {
    address sender;
    address receiver;
    string sendTo;
    uint256 amount;
    event sendMoneyEvent(address indexed _sender, uint256 _amount, string _sendTo);
    event receiveMoneyEvent(address indexed _sender, address indexed _receiver, uint256 _amount);

    function sendMoney(uint256 _amount, string _sendTo) public {
        sender = msg.sender;
        amount = _amount;
        sendTo = _sendTo;
        sendMoneyEvent(sender, amount, sendTo);
    }
    function getAccountBalance() public constant returns (
        address _sender,
        uint256 _amount,
        string _sendTo) {
        return(sender, amount, sendTo);
    }
    function receiveMoney() payable public {
      require(receiver == 0x0);
      //receiver = msg.sender;
      //require(msg.value == amount);
      sender.transfer(msg.value);
      receiveMoneyEvent(sender, receiver, amount);
    }
  }



  /* pragma solidity ^0.4.11;

  contract Kiara {

    // Custom Types
    struct myTransaction {
      uint id;
      address sender;
      address receiver;
      uint256 amount;
    }


      // State variables

      mapping(uint => myTransaction) public transactions;
      uint myTransactionCounter;

      //Events

      event sendMoneyEvent(uint indexed _id, address indexed _sender, uint256 _amount);
      event receiveMoneyEvent(uint indexed _id, address indexed _sender, address indexed _receiver, uint256 _amount);

      // sell an article
      function sendMoney(uint256 _amount) public {
          myTransactionCounter++;

          trasactions[myTransactionCounter] = myTransaction(
            myTransactionCounter,
            msg.sender,
            0x0,
            _amount
            );

          /* sender = msg.sender;
          amount = _amount; */
          /* sendMoneyEvent(myTransactionCounter,sender, amount);
      }

      // get the article
      function getAccountBalance() public constant returns (
          address _sender,
          uint256 _amount) {
          return(sender, amount);
      }

      function receiveMoney(uint _id) payable public {
        // we check whether there is an article for sale
        //require(sender != 0x0);

        myTransaction storage transaction = transactions[_id];
        // we check that the article was not already sold
        require(transaction.receiver == 0x0);

        //we don't allow the seller to buy its own article
        //require(msg.sender != sender);

        //we check whether the value sent corresponds to the article price
        //require(msg.value == amount);

        // keep buyer's information
        transaction.receiver = msg.sender;

        // the buyer can buy the article
        transaction.sender.send(msg.value);

        // trigger the event
        receiveMoneyEvent(_id, sender, receiver, amount);
      }
    } */
