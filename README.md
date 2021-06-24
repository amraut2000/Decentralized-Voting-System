# Decentralized-Voting-System(Use of Ethereum blockchain).
    A decentralized application to manage your voting process with no cheating in the whole election process.Which allows you to take your election on 
 this platform.
    There are two types of users:
        1)Who's taking the election i.e head of election commision.(The address which deploys the contract).
        2)Peoples who have will to vote for perticular candidate.
    Firstly the peoples who are taking the part into voting, they must be registered by the head of election commision.Before the process start the head of election
commision have to register the voters and give the duration of voting.At any time also head can register the peoples and change the duration of voting process.
Only registered peoples are allow to vote and if duration voting finished then no one allow to vote.
    Also provided the extra information which includes total number of registered peoples,total number of voted peoples and current winner of election.
    
The project is a truffle project and runs on local host. To run this project :
    1.Install npm package manager and node : sudo apt install nodejs , sudo apt install npm.
    2.Install truffle : npm install -g truffle.
    3.Install Ganache : https://www.trufflesuite.com/ganache
    4.Run truffle compile from the project directory in terminal
    5.Start the Ganache and choose Quickstart Ethereum
    6.Make sure that the local host url on Ganache and in truffle-config.js is same.
    7.Then on terminal run truffle test
    8.Then run truffle migrate --reset
    9.Then run npm run dev. This will start the project in the browser
    10.Make sure that your metamask is connected to the site (Import accounts from Ganache blockchain into metamask).
  

Other features that can be added into the project :
    1.Use of IPFS to store the symbol (picture) of candidate and use it in the smart contract.
        
