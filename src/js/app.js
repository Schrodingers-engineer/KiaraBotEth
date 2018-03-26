App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        // App.account = account;
        // $("#account").text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if (err === null) {
            balance = balance/10000000000000000;
            //balance = math.round(balance);
            //$("#accountBalance").text(web3.fromWei(balance, "ether") + " CAD");
            $("#accountBalance").text("$" + balance );
          }
        });
      }
    });
  },

  initContract: function() {
    $.getJSON('Kiara.json', function(KiaraArtifact) {
      // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
      App.contracts.Kiara = TruffleContract(KiaraArtifact);

      // Set the provider for our contract.
      App.contracts.Kiara.setProvider(App.web3Provider);

      //Listen to Events
      App.listenToEvents();

      // Retrieve the article from the smart contract
      return App.reloadAccountBalance();
    });
  },

  reloadAccountBalance: function() {
    // refresh account information because the balance may have changed
    App.displayAccountInfo();
    App.contracts.Kiara.deployed().then(function(instance) {
      return instance.getAccountBalance.call();
    }).then(function(transaction) {
      if (transaction[0] == 0x0) {
        // no article
        return;
      }
      // Retrieve and clear the article placeholder
      var TransactionRow = $('#TransactionRow');
      TransactionRow.empty();
      var Amount = transaction[1];
      Amount = Amount*100;

      var receiver = transaction[2];

      // Retrieve and fill the article template
      var TransactionTemplate = $('#TransactionTemplate');
      //TransactionTemplate.find('.panel-title').text(transaction[2]);
      TransactionTemplate.find('.Transaction-Amount').text(Amount);

      TransactionTemplate.find('.btn-confirm').attr('data-value', Amount);


      var sender = "You: address (" + transaction[0] + ")";
      // if (sender == web3.eth.accounts[0]) {
      //   sender = "You";
      // }
      TransactionTemplate.find('.Transaction-sender').text(sender);


      if (receiver == "Mom") {
        receiver = "Mom: address (" + web3.eth.accounts[1] + ")";
      }
      if (receiver == "Dad") {
        receiver = "Dad: address (" + web3.eth.accounts[2] + ")";
      }
      if (receiver == "Bailey") {
        receiver = "Bailey: address (" + web3.eth.accounts[3] + ")";
      }
      if (receiver == "Naz") {
        receiver = "Naz: address (" + web3.eth.accounts[4] + ")";
      }
      if (receiver == "Donald") {
        receiver = "Donald: address (" + web3.eth.accounts[5] + ")";
      }
      if (receiver == "Landlord") {
        receiver = "Landlord: address (" + web3.eth.accounts[7] + ")";
      }
      TransactionTemplate.find('.Transaction-receiver').text(receiver);

      //
      // if (transaction[0] == App.account || article[1] != 0x0) {
      //     TransactionTemplate.find('.btn-buy').hide();
      // }

      // add this new article
      TransactionRow.append(TransactionTemplate.html());
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  sendMoney: function() {
    // retrieve details of the article
    //var _price = web3.toWei(parseInt($("#article_price").val() || 0), "ether");
    var _price = $("#Amount").val();
    var _recipient = $("#Recipient").val();
    var account_num = 8;
    if (_recipient == "Mom") {
      account_num = 1;
    }
    if (_recipient == "Dad") {
        account_num = 2;
    }
    if (_recipient == "Bailey") {
        account_num = 3;
    }
    if (_recipient == "Naz") {
        account_num = 4;
    }
    if (_recipient == "Donald") {
        account_num = 5;
    }
    if (_recipient == "Landlord") {
        account_num = 7;
    }
    //var _price = 10; //10 is reducing 1000
    _price = _price/100;


    App.contracts.Kiara.deployed().then(function(instance) {
      return instance.sendMoney(_price, _recipient, {
        //from: App.account,
        from: web3.eth.accounts[account_num],
        gas: 500000
      });
    }).then(function(result) {

    }).catch(function(err) {
      console.error(err);
    });
  },

  // testTranaction: function() {
  //   instance.sendTransaction({from:eth.accounts[5], to:eth.accounts[6],value: web3.toWei('6',"ether")});
  // },


  // LISTEN TO EVENTS: MAYBE TO UPDATE THE PAGE
  listenToEvents: function() {
    App.contracts.Kiara.deployed().then(function(instance){
      instance.sendMoneyEvent({},{
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event){
        App.reloadAccountBalance();
      });
      instance.receiveMoneyEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
      //  $("#events").append('<li class="list-group-item">' + event.args._buyer + ' bought ' + event.args._name + '</li>');
        App.reloadAccountBalance();
      });
    });
  },

  receiveMoney: function() {
    event.preventDefault();

    // retrieve the article price
    var _price = parseInt($(event.target).data('value'));
    //var _price = 10;
    _price = _price/100;

    App.contracts.Kiara.deployed().then(function(instance) {
      return instance.receiveMoney({
        //from: App.account,
        from: web3.eth.accounts[0],
        value: web3.toWei(_price, "ether"),
        gas: 500000
      });
    }).then(function(result) {

    }).catch(function(err) {
      console.error(err);
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
