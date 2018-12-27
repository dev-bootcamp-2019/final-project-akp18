import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
	<div>
	<h1>Welcome to online MarketPlace!</h1>
	<div>Your account number is: {this.props.accounts}</div>
	</div>
	);
  }
}

export default Header;
