# final-project-akp18 - Online Marketplace on Blockchain

## Description: Create an online marketplace that operates on the blockchain.
 
### Overview  
There are a list of stores on a central marketplace where shoppers can purchase goods posted by the store owners.

The central marketplace is managed by a group of administrators. 
Admins allow store owners to add stores to the marketplace. 
Store owners can manage their store’s inventory and funds. 
Shoppers can visit stores and purchase goods that are in stock using cryptocurrency. 
 
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
  
 ### Deployment
 
 ### Process Flow
 	 1. Login as Market Owner
	 2. Add a new Admin
	 3. Login as Admin
	 4. Add a new Store Owners
	 5. Login as Store Owner
	 6. Add a new Store Front
	 7. Login as Admin
	 8. Approve pending Store Fronts
	 9. Login as Store Owner 
	 10. Add new Products
	 11. Update an existing Product
	 12. Remove an Product
	 13. Login as Shopper
	 14. Browse all Store Fronts
	 15. Buy a Product
	 16. Login as Store Owner 
	 17. Withdraw collected amount

### Requirements
   -      User Interface Requirements:
     -      Run the app on a dev server locally for testing/grading
     -      You should be able to visit a URL and interact with the application
      -      App recognizes current account
      -      Sign transactions using MetaMask or uPort
      -      Contract state is updated
      -      Update reflected in UI
   -      Test Requirements:
     -      Write 5 tests for each contract you wrote
      -      Solidity or JavaScript
     -      Explain why you wrote those tests
     -      Tests run with truffle test
   -      Design Pattern Requirements:
     -      Implement a circuit breaker (emergency stop) pattern
     -      What other design patterns have you used / not used?
      -      Why did you choose the patterns that you did?
      -      Why not others?
   -      Security Tools / Common Attacks:
     -      Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
   -      Use a library or extend a contract
     -      Via EthPM or write your own

