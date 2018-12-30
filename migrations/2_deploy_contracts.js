const safeMath = artifacts.require("./SafeMath.sol");
const helperLibrary = artifacts.require("./HelperLibrary.sol");
const MarketAdmin = artifacts.require("./MarketAdmin.sol");
const StoreOwner = artifacts.require("./StoreOwner.sol");

module.exports = async function(deployer) {

	deployer.deploy(safeMath);
	deployer.deploy(helperLibrary);
	deployer.link(safeMath, MarketAdmin);
	deployer.link(safeMath, StoreOwner);
	deployer.link(helperLibrary, StoreOwner);
	deployer.deploy(MarketAdmin);
	deployer.deploy(StoreOwner);


};


