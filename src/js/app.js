
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  head: '0x0',
  hasVoted: false,


  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  // listenForEvents: function() {
  //   App.contracts.Election.deployed().then(function(instance) {
  //     // Restart Chrome if you are unable to receive this event
  //     // This is a known issue with Metamask
  //     // https://github.com/MetaMask/metamask-extension/issues/2393
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       App.render();
  //     });
  //   });
  // },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var resultDiv=$("#resultDiv");
    var registerForm = $("#registerForm");

    //electionResult.hide();
    loader.show();
    content.hide();
    resultDiv.hide();



    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    //to get head of election commision
    App.contracts.Election.deployed().then(function (instance) {
      return instance.head();
    })
      .then(function (head) {
        App.head = head;
        //show only when current user is head of commision
        if (App.head != App.account) {
          $("#timeForm").hide();
          $("#registerForm").hide();
          $("#seeResultButton").hide();
        }
      });



    // Load contract data
    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      var candidatesResults = $('#candidatesResults');
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount.toNumber(); i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      // Do not allow a user to vote
      if (hasVoted) {
        $('#voteForm').hide();
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });

  },


  setDuration: function () {
    var timePeriod = $("#inputTime").val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.getDuration(timePeriod, { from: App.account });
    })
      .then(function (result) {
        alert("Duration of " + timePeriod + " hours set Successfully.");
      })
      .catch(function (err) {
        console.log(err);
      });
  },

  register: function () {
    var voterAddress = $("#inputAddress").val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.registerVoter(voterAddress, { from: App.account });
    })
      .then(function (result) {
        alert("Voter having address " + voterAddress + " registered successfully.");
      })
      .catch(function (err) {
        console.error(err);
      })
  },


  castVote: function () {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  seeResult: function () {
    //to set winner
    App.contracts.Election.deployed().then(function (instance) {
      electionInstance=instance;
      return instance.winnerOfElection();
    })
    .then(function (winner) {
        $("#winner").html("Winner: " + winner);
        return electionInstance.registeredVotersCount();
    })
    .then(function(count){
      $("#registeredCount").html("Total registered peoples: "+ count);
      return electionInstance.votedCount();
    })
    .then(function(cnt){
      $("#votedCount").html("Total voted peoples: "+cnt);
    });
    $("#resultDiv").show();
  }


};

$(function () {
  $(window).load(function () {
    App.init();
  });
});