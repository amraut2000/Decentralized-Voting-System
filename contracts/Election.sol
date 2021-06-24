pragma solidity >=0.4.22 <0.8.0;

contract Election{
    
    //head of election commision is the only one who can register the candidates for voting
    address public head;

    //start is the time when voting process starts i.e when contract deployed
    uint public start;

    //get duration of voting period from head of election commision
    uint public timePeriod;

    //model of a candidate
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    //registered voters
    mapping (address=>bool) public registeredVoters;

    //to keep track of total number of registered voters
    uint public registeredVotersCount;

    //to keep track of voters
    mapping (address=>bool) public voters;

    //used to fetch candidates data using id
    mapping(uint=>Candidate) public candidates;

    //to keep track of how many candidates are there
    uint public candidatesCount;

    //to keep track of voted voters coount
    uint public votedCount;

    //registered event
    event registeredEvent( 
        address registered_person
    );

    //voted event
    event votedEvent(
        uint indexed_candidateId
    );

    //constructor
    constructor() public{
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
        //head is the one who deploys the contract  and head of election
        head=msg.sender;
        start=now;
        timePeriod=300 seconds;
    }

    //to get duration period from head of election commision only
    function getDuration(uint _time) public{
        timePeriod=_time *3600;
    }


    //to add new candidate
    function addCandidate(string memory _name) private{
        candidatesCount++;
        candidates[candidatesCount]= Candidate(candidatesCount,_name,0);
    }

    //to register for voting
    function registerVoter(address voter) public{

        //head of election commision can only register the voters
        require(msg.sender==head);

        //require that voter have not registered yet
        require(!registeredVoters[voter]);

        //mark voter has registered
        registeredVoters[voter]=true;

        //increment registered voters count
        registeredVotersCount++;

        //trigger registered event
        emit registeredEvent(voter);
    }

    //to vote a candidate
    function vote(uint _id) public{
        //allow voting only in given period of time
        require(now<start+timePeriod);
        //require that voter have not voted yet
        require(!voters[msg.sender]);

        //require that voter has registered by head
        require(registeredVoters[msg.sender]);

        //require a valid candidate
        require(_id>0 && _id<=candidatesCount);

        //mark voter has voted
        voters[msg.sender]=true;

        //increment candidates vote count
        candidates[_id].voteCount++;

        //increment the voted voters count
        votedCount++;

        //trigger voted event
        emit votedEvent(_id);
    }

    function winnerOfElection() public view returns(string memory){
        
        if(candidates[1].voteCount==candidates[2].voteCount){
            return "Undeclared";
        }
        if(candidates[1].voteCount>candidates[2].voteCount){
            return candidates[1].name;
        }
        return candidates[2].name;
    }


}