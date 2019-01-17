## Design Pattern Decisions
### Behavioral Patterns
#### [Guard Check](https://github.com/fravoll/solidity-patterns/blob/master/docs/guard_check.md)
Ensure that the behavior of a smart contract and its input parameters are as expected. 
- [x] It validates user inputs when state variable are being modified. For example - it checks the name of the store front and product being added/updated to make sure that the string is not empty. It uses a helper library to check for empty/invalid string.
- [x] It checks the contract state before executing logic. For example - it checks the account of the shopper, verifies the amount being supplied by the shopper with the actual price of the product and makes sure that the item is not sold out in the purchaseProduct function before executing the business logic.

### 	 Security Patterns
#### [Access Restriction](https://github.com/fravoll/solidity-patterns/blob/master/docs/access_restriction.md)
Restrict the access to contract functionality according to suitable criteria.
- [x] Access modifiers have been used to restrict the access for Market Front Owner, Admins, Store Owners and Shoppers. 
For example: 
- A Store Owner cannot add a new market admin. 
- Shopper cannot add a new store front.  

#### [Pull over Push ](https://github.com/fravoll/solidity-patterns/blob/master/docs/pull_over_push.md)
Shift the risk associated with transferring ether to the user. 
- [x] The transfer of the available store front balance is always pulled by the store owner instead of pushing the balance directly.
####  [Emergency Stop](https://github.com/fravoll/solidity-patterns/blob/master/docs/emergency_stop.md)
Add an option to disable critical contract functionality in case of an emergency. 
- [x] The stoppable contract only allows the marker owner to be able to stop the market place in case of an emergency.
###  Economic Patterns
#### [Memory Array Building ](https://github.com/fravoll/solidity-patterns/blob/master/docs/memory_array_building.md)
Aggregate and retrieve data from contract storage in a gas efficient way. 
- [x] This pattern is used mainly for getting the product and store front information. The store front information can be requested using the store front number (id) and the product information can be requested using the sku of the product. These methods are view functions.
### Events and Logs
- [x] All important changes in the state variable emits events. Below are some the useful events that have been used in the MarketAdmin and StoreOwner contracts.
 1. Add new admin
 2. Add new store owner
 3. Add new store front
 4. Approve new store front
 5. Add new product
 6. Update an existing product
 7. Delete an existing product
 8. Purchase a product
 9. Withdraw store balance
 
