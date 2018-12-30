import React, { Component } from "react";
import MarketAdminContract from "./contracts/StoreOwner.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import Header from './components/Header';
import Admin from './components/Admin';
import StoreOwner from './components/StoreOwner';
//import Shopper from './components/Shopper';
import "./App.css";


class App extends React.Component {

  state = { UserType: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
	
      // Get the contract instance.
      const Contract = truffleContract(MarketAdminContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);

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

      alert(
        `UserType is ` + _UserType
      );

    // Update state with the result.
    this.setState({ UserType: _UserType });

  }; 

  render() {
    const _UserType = this.state.UserType;
    const isStoreOwner = this.state.isStoreOwner;


    return (
     <React.Fragment>
 	<div className="DottedBox">    
	<Header {...this.state}/> </div>  
	<div>
	{
	   (() => {
	       if (_UserType == 0)	
		  return <div><Admin {...this.state}/> </div>
	       else if (_UserType == 1)	
		  return <div><Admin {...this.state}/> </div>
	       else if (_UserType == 2)	
		 return <div><StoreOwner {...this.state}/> </div>
	       else 
		  return <span>You are logged in as SHOPPER</span>
	   })()
	}
         
       </div>


            
             
    </React.Fragment>
    );
  }
}
export default App;
