var SafeMath = artifacts.require("./SafeMath.sol");
var HelperLibrary = artifacts.require("./HelperLibrary.sol");
var MarketAdmin = artifacts.require("./MarketAdmin.sol");
var StoreOwner = artifacts.require("./StoreOwner.sol");

contract('StoreOwner', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]
    const shopper = accounts[3]
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    var newstoreid = -1
    var newsku = -1

    const price = web3.toWei(0.00001, "ether")
    
    it("owner should be able to add new admins", async() => {
       const storeOwner = await StoreOwner.deployed()

        var eventEmitted = false
	var addedAddress = '0x0000000000000000000000000000000000000000'

	const tx = await storeOwner.addAdmin(alice, {from: owner})
	if (tx.logs[0].event === "adminAdded") {
                addedAddress = tx.logs[0].args._admin
		eventEmitted = true
	}

        const result = await storeOwner.isAdmin.call(alice)

        assert.equal(result, true ,'should be able to check if an address is in approved list of marketplace admins')
        assert.equal(alice,addedAddress, 'owner should be able to add a new address to the list of marketplace admins')
        assert.equal(eventEmitted, true, 'adding a market admin should emit a Admin Added event')
    }) 

    it("admin should be able to add new store owner", async() => {
       const storeOwner = await StoreOwner.deployed()

        var eventEmitted = false
	var storeownerAddress = '0x0000000000000000000000000000000000000000'

	const tx = await storeOwner.addStoreOwner(bob, {from: alice})
	if (tx.logs[0].event === "storeownerAdded") {
                storeownerAddress = tx.logs[0].args._storeowner
		eventEmitted = true
	}

        const result1 = await storeOwner.isStoreOwner.call(bob) //bob is store owner
	const result2 = await storeOwner.isStoreOwner.call(alice) //alice is not a store owner

        assert.equal(result1, true ,'should be able to check if an address is in the approved list of store owners')
	assert.equal(result2, false ,'should be able to check if an address is in the approved list of store owners')
        assert.equal(bob,storeownerAddress, 'admin should be able to add a new address to the list of approved store owners')
        assert.equal(eventEmitted, true, 'adding a store owner should emit a Store Owner Added event')
    })

    it("store owner should be able to add new store front", async() => {
       const storeOwner = await StoreOwner.deployed()
	
       //const result2 = await marketAdmin.getUserType({from: bob}) //get storefront count
       //console.log("Is bob store owner? - " + result2)

        var eventEmitted = false
        var storename = "Walmart"
	const tx = await storeOwner.createStoreFront(storename, {from: bob})
	if (tx.logs[0].event === "storeFrontCreated") {
                newstoreid = tx.logs[0].args._storeId
		eventEmitted = true
	}
        
	const result1 = await storeOwner.getStoreFrontCount.call() //get storefront count

	//console.log(result1.toString())
        assert.equal(newstoreid, (result1 - 1).toString() ,'should be able to check the store id of the new store front')
        assert.equal(eventEmitted, true, 'approving a store front should emit Store Front Approved event')
    })


    it("Admin should be able to approve new store front", async() => {
       const storeOwner = await StoreOwner.deployed()

       //console.log(alice);

	//const result1 = await storeOwner.getStoreFrontCount.call() //get storefront count
	//console.log(result1.toString())
        var eventEmitted = false
	var approvedStoreId
	const tx = await storeOwner.approveStoreFront(newstoreid, {from: alice})
	if (tx.logs[0].event === "storeFrontApproved") {
                approvedStoreId = tx.logs[0].args._storeId
		eventEmitted = true
	}

        //const result1 = await storeOwner.getStoreFrontCount.call() //get storefront count
	//console.log(newstoreid.toString())
        //console.log(storeIdapproved.toString())

        assert.equal(approvedStoreId.toString(),newstoreid.toString() ,'should be able to check the store id that got approval')
        assert.equal(eventEmitted, true, 'approving a store front should emit Store Front Approved event')
    })

    it("Store owner should be able to add product to approved storefront", async() => {
       const storeOwner = await StoreOwner.deployed()

       //console.log(alice);
	//const result1 = await storeOwner.getStoreFrontCount.call() //get storefront count
	//console.log(result1.toString())
        var eventEmitted = false
	var storeid
        var _productname = "Reclining Sofa"
	var _quantity = 3
	const tx = await storeOwner.addProduct(newstoreid,_productname ,price, _quantity, {from: bob})
	if (tx.logs[0].event === "productAdded") {
                storeid = tx.logs[0].args._storeId
		newsku = tx.logs[0].args._sku
		eventEmitted = true
	}

        const result = await storeOwner.getProductbysku(newstoreid, newsku, {from: bob}) //get product information
        //const result1 = await storeOwner.getProductCountbyStoreId(newstoreid, {from: bob}) //get product count
	//console.log(result[0])
        //console.log(result1.toString())
        

        assert.equal(storeid.toString(),newstoreid.toString() ,'should be able to check the store id of store where a new product has been added')
	assert.equal(result[0], _productname, 'the name of the last added item does not match the expected value')
        assert.equal(result[1].toString(10), price, 'the price of the last added item does not match the expected value')
        assert.equal(result[2], _quantity, 'the quantity of the last added item does not match the expected value')
        assert.equal(eventEmitted, true, 'adding an item should emit a Product Added event')
    })

    it("Store owner should be able to update existing product from approved storefront", async() => {
       const storeOwner = await StoreOwner.deployed()

       //console.log(alice);
	//const result1 = await storeOwner.getStoreFrontCount.call() //get storefront count
	//console.log(result1.toString())
        var eventEmitted = false
	var storeid
        var _productname = "Sleeper Sofa"
	var _quantity = 5
	const tx = await storeOwner.updateProduct(newstoreid,newsku, _productname ,price, _quantity, {from: bob})
	if (tx.logs[0].event === "productUpdated") {
                storeid = tx.logs[0].args._storeId
		newsku = tx.logs[0].args._sku
		eventEmitted = true
	}

        const result = await storeOwner.getProductbysku(newstoreid, newsku, {from: bob}) //get product information
        //const result1 = await storeOwner.getProductCountbyStoreId(newstoreid, {from: bob}) //get product count
	//console.log(result[0])
        //console.log(result1.toString())
        

        assert.equal(storeid.toString(),newstoreid.toString() ,'should be able to check the store id of store where a new product has been updated')
	assert.equal(result[0], _productname, 'the name of the last updated item does not match the expected value')
        assert.equal(result[1].toString(10), price, 'the price of the last updated item does not match the expected value')
        assert.equal(result[2], _quantity, 'the quantity of the last updated item does not match the expected value')
        assert.equal(eventEmitted, true, 'updating an item should emit a Product Updated event')
    })

    it("Store owner should be able to remove existing product from approved storefront", async() => {
       const storeOwner = await StoreOwner.deployed()

       //console.log(alice);
	//const result1 = await storeOwner.getStoreFrontCount.call() //get storefront count
	//console.log(result1.toString())
        var eventEmitted = false
	var storeid
	const tx = await storeOwner.removeProduct(newstoreid,newsku, {from: bob})
	if (tx.logs[0].event === "productRemoved") {
                storeid = tx.logs[0].args._storeId
		newsku = tx.logs[0].args._sku
		eventEmitted = true
	}

        const result = await storeOwner.getProductbysku(newstoreid, newsku, {from: bob}) //get product information
        //const result1 = await storeOwner.getProductCountbyStoreId(newstoreid, {from: bob}) //get product count
	//console.log(result[0])
        //console.log(result1.toString())
        

        assert.equal(storeid.toString(),newstoreid.toString() ,'should be able to check the store id of store where a new product has been updated')
        assert.equal(result[3], true, 'the IsRemoved falg value of the last deleted item does not match the expected value')
        assert.equal(eventEmitted, true, 'updating an item should emit a Product Removed event')
    })


     it("Store owner should be able to add another product to approved storefront", async() => {
       const storeOwner = await StoreOwner.deployed()	

       //console.log(alice);
	//const result1 = await storeOwner.getStoreFrontCount.call() //get storefront count
	//console.log(result1.toString())
        var eventEmitted = false
	var storeid
        var _productname = "Sleeper Sofa"
	var _quantity = 2
	const tx = await storeOwner.addProduct(newstoreid,_productname ,price, _quantity, {from: bob})
	if (tx.logs[0].event === "productAdded") {
                storeid = tx.logs[0].args._storeId
		newsku = tx.logs[0].args._sku
		eventEmitted = true
	}

        const result = await storeOwner.getProductbysku(newstoreid, newsku, {from: bob}) //get product information
        //const result1 = await storeOwner.getProductCountbyStoreId(newstoreid, {from: bob}) //get product count
	//console.log(result[0])
        //console.log(result1.toString())
        

        assert.equal(storeid.toString(),newstoreid.toString() ,'should be able to check the store id of store where a new product has been added')
	assert.equal(result[0], _productname, 'the name of the last added item does not match the expected value')
        assert.equal(result[1].toString(10), price, 'the price of the last added item does not match the expected value')
        assert.equal(result[2], _quantity, 'the quantity of the last added item does not match the expected value')
        assert.equal(eventEmitted, true, 'adding an item should emit a Product Added event')
    })


     it("Shopper should be able to purchase product from approved storefront", async() => {
       const storeOwner = await StoreOwner.deployed()
	
        var storeBalanceBefore = await storeOwner.viewStoreBalance( {from: bob}) //get available balance
        var shopperBalanceBefore = await web3.eth.getBalance(shopper).toNumber()        
        //console.log(shopperBalanceBefore);
        var eventEmitted = false
	var storeid
  	var quantity 
        var purchasedby
	const tx = await storeOwner.purchaseProduct(newstoreid,newsku, {from: shopper, value: price})
	if (tx.logs[0].event === "productPurchased") {
                storeid = tx.logs[0].args._storeId
		newsku = tx.logs[0].args._sku
                quantity = tx.logs[0].args._quantity
                purchasedby = tx.logs[0].args._purchasedBy
		eventEmitted = true
	}
   
        const result = await storeOwner.getProductbysku(newstoreid, newsku, {from: bob}) //get product information
        //const result1 = await storeOwner.viewStoreBalance( {from: bob}) //get available balance
        //console.log(result[2])
        var storeBalanceAfter = await storeOwner.viewStoreBalance( {from: bob}) //get available balance   
        var shopperBalanceAfter = await web3.eth.getBalance(shopper).toNumber()

        assert.equal(storeid.toString(),newstoreid.toString() ,'should be able to check the store id of store where a new product has been added')	
        assert.equal(parseInt(result[2]), parseInt(quantity), 'the quantity of the purchased item should be reduced by 1')
        assert.equal(shopper, purchasedby, 'the address of the buyer does not match the expected value')
        assert.equal(eventEmitted, true, 'purchasing an item should emit a Product Purchased event')
        assert.equal(parseInt(storeBalanceAfter), parseInt(storeBalanceBefore) + parseInt(price, 10), "store's balance should be increased by the price of the item")
        assert.isBelow(shopperBalanceAfter, shopperBalanceBefore - price, "shopper's balance should be reduced by more than the price of the item (including gas costs)")
    })


    it("Store owner should be able to withdraw balance from approved storefront", async() => {
       const storeOwner = await StoreOwner.deployed()
	
        //var bobBalanceBefore = await web3.eth.getBalance(bob).toNumber()
        //console.log(bobBalanceBefore);
        var eventEmitted = false
	var amount
        var withdrawnBy

	const tx = await storeOwner.withdraw({from: bob})
	if (tx.logs[0].event === "amountWithdrawn") {
                amount = tx.logs[0].args._amount
		withdrawnBy = tx.logs[0].args._withdrawnBy
		eventEmitted = true
	}   
        
        const storeBalanceAfter = await storeOwner.viewStoreBalance( {from: bob}) //get available balance
       
        //const bobBalanceAfter = await web3.eth.getBalance(bob).toNumber()     
        //console.log(bobBalanceAfter)
        //console.log(amount.toString())
        
        assert.equal(eventEmitted, true, 'withdrawing balance an item should emit a Amount Withdrawn event')
        assert.equal(storeBalanceAfter, 0, "store's balance should be 0 after withdraw")
        
    })

  it("owner should be able to stop the market place", async() => {
       const storeOwner = await StoreOwner.deployed()

        var eventEmitted = false
	var addedAddress = '0x0000000000000000000000000000000000000000'

	const tx = await storeOwner.changeMarketState({from: owner})
	if (tx.logs[0].event === "marketStopped") {                
		eventEmitted = true
	}

        assert.equal(eventEmitted, true, 'stopping the market place should emit a Market Stopped event')
    }) 

   
});
