import React, { Component } from "react";
import MarketAdminContract from "./contracts/MarketAdmin.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import Header from './components/Header';
import "./App.css";


class App extends React.Component {

  state = { adminvalue: '',
	    storeownervalue: '', 
            isAdmin: false, isStoreOwner: false, Admins: null,StoreOwners: null,  web3: null, accounts: null, contract: null };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

	alert(
        `loaded accounts - ` + accounts[0]
      	);

      // Get the contract instance.
      const Contract = truffleContract(MarketAdminContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

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
    const _isAdmin = await contract.isAdmin.call(accounts[0] , { from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const _isStoreOwner = await contract.isStoreOwner.call(accounts[0] , { from: accounts[0]});



    // Get the value from the contract to prove it worked.
    const _Admins = await contract.getAdmins.call({ from: accounts[0] });


    // Get the value from the contract to prove it worked.
    const _StoreOwners = await contract.getStoreOwners.call({ from: accounts[0] });


    // Update state with the result.
    this.setState({ adminvalue: '',storeownervalue: '',isAdmin: _isAdmin ,isStoreOwner: _isStoreOwner, Admins: _Admins, StoreOwners: _StoreOwners});


  };


  handleChange(event) {

     this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.adminvalue;
  
    alert(
        `Adding a new admin ` + value
      	);

        contract.addAdmin(value, {from : accounts[0]})
        .then(result => {  		
		this.runExample();
        	this.forceUpdate(); 
        });
	this.setState({ adminvalue: '',storeownervalue: ''});

  }

  handleAlternate(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.storeownervalue;
  
    alert(
        `Adding a new Store Owner ` + value
      	);

        contract.addStoreOwner(value, {from : accounts[0]})
        .then(result => {         
		this.runExample();
        	this.forceUpdate(); 
        });
	this.setState({ adminvalue: '',storeownervalue: ''});

  }



  render() {
    const isAdmin = this.state.isAdmin;
    const isStoreOwner = this.state.isStoreOwner;

    return (
 	
      <form onSubmit={this.handleSubmit.bind(this)}>
 	<div className="DottedBox">    
	<Header {...this.state}/> 
	<div>
	{
	   (() => {
	       if (isAdmin)
		  return <div>You are logged in as ADMIN</div>
	       if (isStoreOwner)
		  return <span>You are logged in as STORE OWNER</span>
	       else 
		  return <span>You are logged in as SHOPPER</span>
	   })()
	}
	</div>           
       </div>

	<p>
        <label>
          Add a new Admin:
          <input type="text" ref="admininput" name="adminvalue" value={this.state.adminvalue} onChange={this.handleChange} placeholder="Enter Admin Address..."/>
        </label>
        <button type="submit">Add</button>
	</p>
	<div id="result">List of admins: {String(this.state.Admins)}</div>

    	<p>
        <label>
          Add a new Store Owner:
          <input type="text" ref="storeownerinput" name="storeownervalue" value={this.state.storeownervalue} onChange={this.handleChange} placeholder="Enter Store Owner Address..."/>
        </label>
        <button onClick={this.handleAlternate.bind(this)}>Add</button>
	</p>
	<div id="result">List of Store Owners: {String(this.state.StoreOwners)}</div>

      </form>
	
    );
  }
}
export default App;
