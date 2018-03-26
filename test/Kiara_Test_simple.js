// Contract to be tested
var Kiara = artifacts.require("./Kiara.sol");

// Test suite
contract('Kiara', function(accounts) {
  var KiaraInstance;
  var sender = accounts[1];
  //var articleName = "article 1";
  var articleDescription = "Description for article 1";
  var amount = 10;
  var watcher;

  // Test case: check initial values
  it("should be initialized with empty values", function() {
    return Kiara.deployed().then(function(instance) {
      return instance.getArticle.call();  //******* BIG HONKING WARNING ****
    }).then(function(data) {
      assert.equal(data[0], 0x0, "sender must be empty");
      assert.equal(data[1], '', "article name must be empty");
      assert.equal(data[2], '', "description must be empty");
      assert.equal(data[3].toNumber(), 0, "article price must be zero");
    });
  });

  // Test case: sell an article
  it("should sell an article", function() {
    return ChainList.deployed().then(function(instance) {
      KiaraInstance = instance;
      return KiaraInstance.sellArticle(articleName, articleDescription, web3.toWei(amount, "ether"), {
        from: sender
      });
    }).then(function() {
      return KiaraInstance.getArticle.call();
    }).then(function(data) {
      assert.equal(data[0], sender, "sender must be " + sender);
      assert.equal(data[1], articleName, "article name must be " + articleName);
      assert.equal(data[2], articleDescription, "article descriptio must be " + articleDescription);
      assert.equal(data[3].toNumber(), web3.toWei(amount, "ether"), "article price must be " + web3.toWei(amount, "ether"));
    });
  });

  // Test case: should check events
  it("should trigger an event when a new article is sold", function() {
    return ChainList.deployed().then(function(instance) {
      KiaraInstance = instance;
      watcher = KiaraInstance.sellArticleEvent();
      return KiaraInstance.sellArticle(
        articleName,
        articleDescription,
        web3.toWei(amount, "ether"), {from: sender}
      );
    }).then(function() {
      return watcher.get();
    }).then(function(events) {
      assert.equal(events.length, 1, "should have received one event");
      assert.equal(events[0].args._sender, sender, "sender must be " + sender);
      assert.equal(events[0].args._name, articleName, "article name must be " + articleName);
      assert.equal(events[0].args._price.toNumber(), web3.toWei(amount, "ether"), "article price must be " + web3.toWei(amount, "ether"));
    });
  });
});
