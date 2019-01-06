import React, { Component } from "react";
import truffleContract from "truffle-contract";


class Admin extends React.Component {

constructor(props) {
    super(props);
    this.state = { adminvalue: '', storeownervalue: '',storeapprvalue: '' , Admins: [],StoreOwners: [],PendingStores: []  ,web3: this.props.web3, accounts: this.props.accounts, contract: this.props.contract };
    }


  componentDidMount = async () => {
  try {

      this.runExample();
      
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleSubmitStrOwner = this.handleSubmitStrOwner.bind(this);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.` + error
      );
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    let _PendingStores = [];

    // Get the value from the contract to prove it worked.
    const _Admins = await contract.getAdmins.call({ from: accounts[0] });


    // Get the value from the contract to prove it worked.
    const _StoreOwners = await contract.getStoreOwners.call({ from: accounts[0] });

    // Get total storefront count from the contract.
    const _StoreFrontCount = await contract.getStoreFrontCount.call({ from: accounts[0] });

 
    // Outer loop to create parent
    for (let i = 0; i < _StoreFrontCount; i++) 
    {
     
       // Get the value from the contract to prove it worked.
      const _StoreFront = await contract.getStoreFrontbyId.call(i, { from: accounts[0] });

         //Create storefront if not approved
	if(!_StoreFront[3])
         _PendingStores.push( "Store Number: " + i +  " ,Store Name: " +_StoreFront[0] );

   }

    
    // Update state with the result.
    this.setState({ adminvalue: '',storeownervalue: '',Admins: _Admins, StoreOwners: _StoreOwners,PendingStores: _PendingStores});

  };


  handleChange(event) {

     this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.adminvalue;
    if(!value)
  {
   alert(
        `Address can't be empty ` + value
      	);
   }
   else{
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
  }

  handleSubmitStrOwner(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.storeownervalue;
      if(!value)
  {
   alert(
        `Address can't be empty ` + value
      	);
   }
   else{
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
  }

  handleApprStore(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.storeapprvalue;
      if(!value)
  {
   alert(
        `Store number can't be empty ` + value
      	);
   }
   else{
    
        contract.approveStoreFront(value, {from : accounts[0]})
        .then(result => {         
		this.runExample();
        	this.forceUpdate(); 
        });
	this.setState({ storeapprvalue: ''});
}
  }



  render() {

    var storeownerlist = this.state.StoreOwners;
    var adminlist = this.state.Admins;
    var pendingstorelist = this.state.PendingStores;

    return ( 	
      <form onSubmit={this.handleSubmit.bind(this)}>

       <h3>You are logged in as ADMIN</h3>
       <p>
        <label>
          Add a new Admin:
          <input type="text" ref="admininput" name="adminvalue" value={this.state.adminvalue} onChange={this.handleChange} placeholder="Enter Admin Address..."/>
        </label>
        <button type="submit">Add</button>
	</p>
	<ul> 	
		<div id="result">List of Admins:</div>
                {adminlist.map(function(adminlist, index){
                    return <li key={ index }>{adminlist}</li>;
                  })}
            </ul>       
	 <br/>

    	<p>
        <label>
          Add a new Store Owner:
          <input type="text" ref="storeownerinput" name="storeownervalue" value={this.state.storeownervalue} onChange={this.handleChange} placeholder="Enter Store Owner Address..."/>
        </label>
        <button onClick={this.handleSubmitStrOwner.bind(this)}>Add</button>
	</p>
	   <ul> 	
		<div id="result">List of Store Owners:</div>
                {storeownerlist.map(function(storeownerlist, index){
                    return <li key={ index }>{storeownerlist}</li>;
                  })}
            </ul>       
	 <br/>


    	<p>
        <label>
          Approve New Store Opening: 
          <input type="text" ref="storeapprvalue" name="storeapprvalue" value={this.state.storeapprvalue} onChange={this.handleChange} placeholder="Enter Store Number i.e 23..."/>
        </label>
        <button onClick={this.handleApprStore.bind(this)}>Approve</button>
	</p>
		<ul> 	
		<div id="result">List of Pending New Store Fronts:</div>
                {pendingstorelist.map(function(pendingstorelist, index){
                    return <li key={ index }>{pendingstorelist}</li>;
                  })}
            </ul>        
	 <br/>	
      </form>	
    );
  }
}
export default Admin;
