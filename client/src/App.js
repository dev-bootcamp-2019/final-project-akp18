import React, { Component } from "react";
import MarketAdminContract from "./contracts/StoreOwner.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import Header from './components/Header';
import Owner from './components/Owner';
import Admin from './components/Admin';
import StoreOwner from './components/StoreOwner';
import Shopper from './components/Shopper';
import "./App.css";


class App extends React.Component {

  state = {MarketState: null, UserType: null, web3: null, accounts: null, contract: null, balance: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();



      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      
      // Get the contract instance.
      const Contract = truffleContract(MarketAdminContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance , balance}, this.runExample);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.` + error
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;


    // Get the value from the contract to prove it worked.
    const _UserType = await contract.getUserType.call({ from: accounts[0] });

   // Get the value from the contract to prove it worked.
   const _MarketState = await contract.getMarketState.call({ from: accounts[0] });

    // Update state with the result.
    this.setState({ UserType: _UserType, MarketState: _MarketState });

  }; 

  render() {
    const _UserType = this.state.UserType;
    const balance = this.state.balance;

    return (
     <React.Fragment>
 	<div className="DottedBox">    
	<Header {...this.state}/> </div>  
	<div>
	{
	   (() => {
	       if (_UserType == 0)	
		  return <div><Owner {...this.state}/> </div>
	       else if (_UserType == 1)	
		  return <div><Admin {...this.state}/> </div>
	       else if (_UserType == 2)	
		 return <div><StoreOwner {...this.state}/> </div>
	       else if (_UserType == 3)	
		  return <div><Shopper {...this.state}/> </div>
	   })()
	}
         
       </div>


            
             
    </React.Fragment>
    );
  }
}
export default App;
