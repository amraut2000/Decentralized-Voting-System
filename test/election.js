var Election = artifacts.require("./Election.sol");
let electionInstance;

contract("Election",function(accounts){

    //to check candidates initialised or not
    it("Initializes with two candidates",function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        })
        .then(function(count){
            assert.equal(count,2);
        })
    })

    //to check candidates initialised with correct information
    it("it initialises candidates with correct values",function(){
        return Election.deployed().then(function(instance){
            electionInstance=instance;
            return electionInstance.candidates(1);
        })
        .then(function(candidate){
            assert.equal(candidate[0],1,"Id of candidate1 correct");
            assert.equal(candidate[1],"Candidate 1","Name of candidate1 correct");
            assert.equal(candidate[2],0,"Votes of candidate1 correct");
            return electionInstance.candidates(2);
        })
        .then(function(candidate){
            assert.equal(candidate[0],2,"Id of candidate2 correct");
            assert.equal(candidate[1],"Candidate 2","Name of candidate2 correct");
            assert.equal(candidate[2],0,"Votes of candidate2 correct");

        });
    });

    //to check if head of election commision has correct address
    it("it checks correct address of head",function(){
        return Election.deployed().then(function(instance){
          electionInstance=instance;
          return electionInstance.head();
        })
        .then(function(headAddress){
          assert(headAddress,accounts[0],"address of head is correct");
        });
    });

    //to check if registration of voter only done by head of election and to check if count of registered
    //voter incremeted or not
    it("it checks only head can register voter",function(){
        return Election.deployed().then(function(instance){
          electionInstance=instance;
          return electionInstance.registerVoter(accounts[1],{from:accounts[0]});
        })
        .then(function(receipt){
          assert.equal(receipt.logs.length, 1, "an event was triggered");
          assert.equal(receipt.logs[0].event, "registeredEvent", "the event type is correct");
          return electionInstance.registeredVoters(accounts[1]);
        })
        .then(function(registered){
          assert(registered,"voter was marked as registered");
          return electionInstance.registerVoter(accounts[2],{from:accounts[0]});
        })
        .then(function(receipt){
          assert.equal(receipt.logs.length, 1, "an event was triggered");
          assert.equal(receipt.logs[0].event, "registeredEvent", "the event type is correct");
          return electionInstance.registeredVoters(accounts[2]);
        })
        .then(function(registered){
          assert(registered,"voter was marked as registered");
          return electionInstance.registeredVotersCount();
        })
        .then(function(count){
          assert.equal(count,2,"registered voters count incremented");
        });
        
    });

    //to ckeck voter can cast a vote and check candidate's vote count incremented or not
    it("it allows voter to cast a vote",function(){
        return Election.deployed().then(function(instance){
            electionInstance=instance;
            candidateId=1;
            return electionInstance.vote(candidateId,{from:accounts[1]});
        })
        .then(function(receipt){
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            return electionInstance.voters(accounts[1]);
        })
        .then(function(voted){
            assert(voted,"voter was marked as voted");
            return electionInstance.candidates(candidateId);
        })
        .then(function(candidate){
            voteCount=candidate[2];
            assert.equal(voteCount,1,"Vote count incremented");
        });
    });

    //to check candidate is valid
    it("throws an exception for invalid candiates", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.vote(1, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
      });
    
      //to check if voter has already voted and try to vote again
      it("throws an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 2;
          electionInstance.vote(candidateId, { from: accounts[2] });
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "accepts first vote"); 
          // Try to vote again
          return electionInstance.vote(candidateId, { from: accounts[2] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
      });
});