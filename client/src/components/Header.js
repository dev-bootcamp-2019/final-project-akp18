import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
	<div>
	<h1>Welcome to online MarketPlace!</h1>
	<h2>Your account number is: {this.props.accounts}</h2>
	<br/>
	</div>
	);
  }
}

export default Header;
