import React, { Component } from "react";
import truffleContract from "truffle-contract";


class Owner extends React.Component {

constructor(props) {
    super(props);
    this.state = { adminvalue: '', Admins: [] ,web3: this.props.web3, accounts: this.props.accounts, contract: this.props.contract ,MarketState: this.props.MarketState};
    }


  componentDidMount = async () => {
  try {

      this.runExample();
      
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);   
    
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.` + error
      );
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
  
    // Get the value from the contract to prove it worked.
    const _Admins = await contract.getAdmins.call({ from: accounts[0] });

   // Get the value from the contract to prove it worked.
   const _MarketState = await contract.getMarketState.call({ from: accounts[0] });

    // Update state with the result.
    this.setState({ adminvalue: '',Admins: _Admins, MarketState: _MarketState});

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

  handlechangeMarketState(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
    alert(
        `Are you sure you want to change the market state? `
      	);

        contract.changeMarketState( {from : accounts[0]})
        .then(result => {  		
		this.runExample();
        	this.forceUpdate(); 
        });
	this.setState({ adminvalue: '',storeownervalue: ''});
  }



  render() {

    var adminlist = this.state.Admins;
    const marketstate = this.state.MarketState;
    return ( 	
      <form onSubmit={this.handleSubmit.bind(this)}>

       <h3>You are logged in as OWNER</h3>
        {
	   (() => {
	      if(!marketstate)
	         return <div>Current Market State: OPEN </div> 
	       else
		  return <div>Current Market State: CLOSED  </div>
	   })()
	}
       <button onClick={this.handlechangeMarketState.bind(this)}>Change Market State</button>    
       <br/>


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

      </form>	
    );
  }
}
export default Owner;
