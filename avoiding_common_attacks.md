
## Avoiding Common Attacks

### 1. **Integer Overflow/Underflow** 

The SafeMath library has been used for arithmetic operations to prevent integer overflow and underflow errors. 

### 2. **Reentrancy** 

In the withdraw() function in the StoreOwner contract, the balance of the message sender (store front owner) gets reset to 0 before transferring the store front balance. The function cannot be called over and over from another contract or account to transfer the balance.  

### 3. **Force Send Ether** 

The contract balance has **_NOT_** been used when the store front balance is transferred to the store owner. 
pendingWithdrawals variable has been used to keep track of the store front balance by store owner. 

### 4. **DoS (Denial of Service) with Block Gas Limit**

Mapping and other necessary variables have been used to avoid the need of iterating through the array. 
For example: 

**mapping(uint => address) public storeIdtoStoreOwner;**

storeIdtoStoreOwner can be used to find the store owner of the given storeid in relatively less gas than iterating though the list of store front owners and store ids.

### 5. **DoS with (Unexpected) revert**

The transfer of the store front balance does not iterate through loop and isolates each payment as one transaction instead of combining them all to avoide this attack. This is implemented as a pull payment system where store front owners can withdraw balance as opposed to pushing the balance to them.
