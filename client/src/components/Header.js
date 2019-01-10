import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
	<div>
	<h1>Welcome to online MarketPlace!</h1>
	<h2>Your account number is: {this.props.accounts}</h2>
        <h2>Your balance is: {this.props.balance}</h2>
        {
	   (() => {
	      if(!this.props.MarketState)
	         return <h5>Current Market State: OPEN </h5> 
	       else
		  return <h6>Current Market State: CLOSED  </h6>
	   })()
	}
	<br/>
	</div>
	);
  }
}

export default Header;
