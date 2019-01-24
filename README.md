# final-project-akp18 - Online Marketplace on Blockchain

## Description: Create an online marketplace that operates on the blockchain.

[![Build Status](https://travis-ci.org/dev-bootcamp-2019/final-project-akp18.svg?branch=master)](https://travis-ci.org/dev-bootcamp-2019/final-project-akp18)

### Overview  
There are a list of stores on a central marketplace where shoppers can purchase goods posted by the store owners.

The central marketplace is managed by a group of administrators. 
Admins allow store owners to add stores to the marketplace. 
Store owners can manage their store’s inventory and funds. 
Shoppers can visit stores and purchase goods that are in stock using cryptocurrency. 

#### Owner Features 
<ul>
<li>A market owner opens the web app.</li>  
<li>The web app reads the address and identifies that the user is an owner, showing them owner only functions.</li>  
<li>Market owner can add new admins.</li>
<li>Market owner can stop the market place in case of emergency.</li>
</ul>

#### Admin Features 
<ul>
<li>An administrator opens the web app.</li>  
<li>The web app reads the address and identifies that the user is an admin, showing them admin only functions, such as managing store owners.</li>
<li>An admin adds an address to the list of approved store owners, so if the owner of that address logs into the app, they have access to the store owner functions.</li>
</ul>

#### Store Owner Features
<ul>
	<li>The web app recognizes their address and identifies them as a store owner. </li>  
	<li>They are shown the store owner functions. </li>  
	<li>They can create a new storefront that will be displayed on the marketplace. </li>  
	<li>They can also see the storefronts that they have already created. </li>  
	<li>They can click on a storefront to manage it. </li>  
	<li>They can add/remove products to the storefront or change any of the products’ prices. </li>  
	<li>They can also withdraw any funds that the store has collected from sales.</li>  
 </ul>

#### Shopper Features
<ul>
	<li>The web app does not recognize their address so they are shown the generic shopper application. </li>  
	<li>From the main page they can browse all of the storefronts that have been created in the marketplace.</li>  
 <li>Clicking on a storefront will take them to a product page. </li>  
	<li>They can see a list of products offered by the store, including their price and quantity. Shoppers can purchase a product, which will debit their account and send it to the store. </li>  
	<li>The quantity of the item in the store’s inventory will be reduced by the appropriate amount.</li>  
  </ul>
  
### Prerequisite

1. Make sure you have [Ganache](https://truffleframework.com/ganache) installed.
	
2. Make sure you have the [react-script](https://www.npmjs.com/package/react-scripts ) installed.

3. Make sure you have Truffle v4.1.15 installed.

4. Make sure you have [MetaMask](https://metamask.io/) installed.

### Installation and Setup

1. Download or clone the repository
https://github.com/dev-bootcamp-2019/final-project-akp18.git

2. CD into the project and install the dependencies:
   ```javascript
    $ npm install 
    ```	

3. Make sure you have ganache-cli running on port 8545.(save your mnemonic to be able to get the same setup later) ganache      will generate 10 addresses that you can use later to perform different operations.
    ```javascript
    $ ganache-cli
    ```

4. Compile and migrate the smart contracts. 
    ```javascript
    $ truffle compile
    $ truffle migrate
    ```

5. Truffle can run tests written in Solidity or JavaScript against your smart contracts. 
    ```javascript
      $ truffle test
    ```
     ![image](https://user-images.githubusercontent.com/43038291/51080213-0f119d80-169d-11e9-8cfb-dbd8878e1d1a.png)

6. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated. CD into the client directory and run the following command.
    ```javascript
    // Serves the front-end on http://localhost:3000
    $ npm run start
    ```

 ### Process Flow

1.  Login as Market Owner. This will be the default address that was used to deploy the contract.
![image](https://user-images.githubusercontent.com/43038291/51078582-dd88da00-167c-11e9-9f3c-e130cc8cf984.png)
2. 	 Add a new Admin address. Enter the address of market admin and click Add.
3. 	 Login as Admin. Switch account using MetaMask plugin.
![image](https://user-images.githubusercontent.com/43038291/51078597-3193be80-167d-11e9-98ad-689d772c0e3c.png)
4. 	 Add a new Store Owner to the market place.
5. 	 Switch account (using MetaMask) again and now login as Store Owner
6. 	 Add a new Store Front by entering the name of the store.
![image](https://user-images.githubusercontent.com/43038291/51078688-132ec280-167f-11e9-81fe-5a57d7c9fbed.png)
7. 	 Switch account (using MetaMask) again and login as Admin.
8. 	 Approve pending Store Fronts by entering the store number (e.g. 0, 1, 2..).
![image](https://user-images.githubusercontent.com/43038291/51078677-d5ca3500-167e-11e9-88e5-a673be773755.png) 
9. 	 Switch account (using MetaMask) again and login as Store Owner. 
![image](https://user-images.githubusercontent.com/43038291/51078644-59375680-167e-11e9-8133-8f8e33defc6c.png)
![image](https://user-images.githubusercontent.com/43038291/51078647-5d637400-167e-11e9-84c9-99f69acb79b3.png)
10.	 Add new Products. Please note that you can only manage store fronts that have been approved by market admin.
11.	 Update an existing Product.
12.	 Remove an existing Product.
13.	 Switch account (using MetaMask) again and login as Shopper
![image](https://user-images.githubusercontent.com/43038291/51078656-85eb6e00-167e-11e9-8064-24c5ed59c52e.png)
14.	 Browse different Store Fronts. You will have to click on the Load Products button once you select a store front from the Approved Store Front drop-down menu.
![image](https://user-images.githubusercontent.com/43038291/51078663-9e5b8880-167e-11e9-83cb-6a07876bfc82.png)
15.	 Buy a Product by selecting the SKU of the product that you want to buy.
16.	 Switch account (using MetaMask) again and login as Store Owner. 
![image](https://user-images.githubusercontent.com/43038291/51078667-a61b2d00-167e-11e9-851c-c1800fd39238.png)
17.    Withdraw collected amount. Refresh the page to see the updated balance in the page header.
18.    Switch account (using MetaMask) again. Login as Owner.
19.    Stop Market Place in case of emergency. You will no longer be able to any operations (read only) in the market place. 
![image](https://user-images.githubusercontent.com/43038291/51078675-cba83680-167e-11e9-9716-1ba0c03a7fbe.png)


### Project Requirements 
#### User Interface Requirements     
- [x]     Run the app on a dev server locally for testing/grading
- [x]      You should be able to visit a URL and interact with the application
- [x]      App recognizes current account
- [x]      Sign transactions using MetaMask or uPort
- [x]      Contract state is updated
- [x]      Update reflected in UI
####  Test Requirements
- [x]      Write 5 tests for each contract you wrote
- [x]      Solidity or JavaScript
- [x]      Explain why you wrote those tests
- [x]      Tests run with truffle test
#### Design Pattern Requirements
- [x]      Implement a circuit breaker (emergency stop) pattern
- [x]      What other design patterns have you used / not used?
- [x]      Why did you choose the patterns that you did?
- [x]      Why not others?
#### Security Tools / Common Attacks
- [x]      Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
- [x]      Use a library or extend a contract 
- [x]      Via EthPM or write your own
#### Stretch Requirements 
- [x] Deploy contract on testnet - Ropsen
- [x] Test contracts with travis CI
- [ ] Add functionality that allows store owners to create an auction for an individual item in their store
- [ ] Give store owners the option to accept any ERC-20 token
- [ ] Implement an upgradable design pattern
- [ ] Write a smart contract in LLL or Vyper
- [ ] Use Ethereum Name Service, uPort, IPFS, Oracle


