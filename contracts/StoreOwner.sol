pragma solidity ^0.4.24;

import "./MarketAdmin.sol";
import { HelperLibrary } from "./HelperLibrary.sol";

/** @title Store Owner and Shopper contract. */
contract StoreOwner is MarketAdmin {

  /** @dev count of total available stores   */
  uint storeFrontCount;

  /** @dev mapping for storeowners to owned storeids   */
  mapping(address => uint[]) public storeOwnertoStoreIds;

  /** @dev mapping for store id to store owner   */
  mapping(uint => address) public storeIdtoStoreOwner;

  /** @dev mapping for store to products   */
  mapping(uint => Product[]) public storetoProducts;

  /** @dev mapping for store owner to store front   */
  mapping(uint => StoreFront) public storeOwnertoStoreFront;

  /** @dev mapping for pending store withdrawls  */ 
  mapping (address => uint) pendingWithdrawals;

  /** @dev mapping for shopper to store to item purchased   */
  mapping(address => mapping(uint => uint[])) public buyertoStoretoProducts;
  
  /**
    @dev Event for new store creation 
   **/
  event storeFrontCreated(uint _storeId, string _storeName);
  
   /**
    @dev Event for when a store front gets approval
   **/
  event storeFrontApproved(uint _storeId, address _approvedBy);
  
   /**
    @dev Event for when a new product gets added to a store
   **/
  event productAdded(uint _storeId, uint _sku);
  
   /**
    @dev Event for when a product is removed from a store
   **/
  event productRemoved(uint _storeId,uint _sku);
  
   /**
    @dev Event for when a product gets updated from a StoreFront
   **/
  event productUpdated(uint _storeId,uint _sku);
  
   /**
    @dev Event for when a product is purchased by someone
   **/
  event productPurchased(uint _storeId, uint _sku, uint _quantity, address _purchasedBy);
  
   /**
    @dev Event for when pending balance is wwithdrawn by the store owner 
   **/
  event amountWithdrawn(uint _amount, address _withdrawnBy);
  
   /**
    @dev Struct for capturing store fronmt information
   **/  
  struct StoreFront
  {
      string storeName;
      address storeOwner;
      address approvedBy;
      uint skuCount;
      bool active;
  }

   /**
    @dev Struct for capturing product information
   **/  
  struct Product
  {
    string name;
    uint sku;
    uint price;
    uint quantity;
    bool isRemoved;
  }  

  /** @dev MODIFIER to verify that msg.owner is a store owner of the store   */  
  modifier verifyStoreOwner (uint _storeId) { require(storeIdtoStoreOwner[_storeId] == msg.sender ,  "You not store owner of the store front"); _;}

  /** @dev Creates a new store front
    * @param _storename Name of the store front.
    * @return _storeId Unique id of the new store front.
    */
  function createStoreFront(string _storename) onlyStoreOwner() checkMarketStatus public returns (uint _storeId) 
  {
        _storeId = addStoreFront(_storename);
        emit storeFrontCreated(_storeId, _storename);
  }
  
   /** @dev Internal function that creates a new store front
    * @param _storename Name of the store front.
    * @return _storeId Unique id of the new store front.
    */
  function addStoreFront(string _storename) internal returns (uint _storeId)
  {
      if(HelperLibrary.IsEmptyString(_storename)) {
            return;
        }
        _storeId =  storeFrontCount;
        storeOwnertoStoreFront[_storeId] = StoreFront({storeName: _storename, storeOwner: msg.sender, approvedBy: 0, skuCount: 0, active: false});
        storeIdtoStoreOwner[_storeId] = msg.sender;
        storeOwnertoStoreIds[msg.sender].push(_storeId);
        storeFrontCount += 1;
  }

   /** @dev Market admin can approve new store fronts
    * @param _storeId Unique id of the new store front.
    */ 
  function approveStoreFront(uint _storeId) checkMarketStatus onlyAdmin public
  {
      storeOwnertoStoreFront[_storeId].approvedBy = msg.sender;
      storeOwnertoStoreFront[_storeId].active = true;
      emit storeFrontApproved(_storeId, msg.sender);
  }

   /** @dev Store owners can add a new product to their store fronts
    * @param _storeId Unique id of the new store front.
    * @param _name Product name.
    * @param _price Product sale price.
    * @param _quantity Available quantity of the product.
    */   
  function addProduct(uint _storeId,string _name, uint _price,uint _quantity) verifyStoreOwner(_storeId) checkMarketStatus public 
  {
     if(HelperLibrary.IsEmptyString(_name)) {
            return;
        }
    require(storeOwnertoStoreFront[_storeId].active == true,  "Store front is not approved yet");
    //get next available sku
    uint _sku = storeOwnertoStoreFront[_storeId].skuCount;

    //add the new prooduct
    //storetoProducts[_storeId][_sku] = Product({name: _name, sku: _sku, price: _price, quantity: _quantity,isRemoved: false});
    storetoProducts[_storeId].push(Product( _name,  _sku,  _price,  _quantity, false));
    storeOwnertoStoreFront[_storeId].skuCount += 1;
    emit productAdded(_storeId, _sku);
  }

   /** @dev Store owners can update the existing product
    * @param _storeId Unique id of the new store front.
    * @param _sku Unique id of the product.
    * @param _name Product name.
    * @param _price Product sale price.
    * @param _quantity Available quantity of the product.
    */   
  function updateProduct(uint _storeId,uint _sku,string _name, uint _price,uint _quantity) verifyStoreOwner(_storeId) checkMarketStatus public returns(bool)
  {
     if(HelperLibrary.IsEmptyString(_name)) {
            return;
        }
    storetoProducts[_storeId][_sku].name = _name;
    storetoProducts[_storeId][_sku].price = _price;
    storetoProducts[_storeId][_sku].quantity = _quantity;
    emit productUpdated(_storeId, _sku);
    return true;
  }

   /** @dev Store owners can delete the existing product
    * @param _storeId Unique id of the new store front.
    * @param _sku Unique id of the product.
    */    
  function removeProduct(uint _storeId,uint _sku) verifyStoreOwner(_storeId) checkMarketStatus public returns(bool)
  {
    storetoProducts[_storeId][_sku].isRemoved = true;
    emit productRemoved(_storeId, _sku);
    return true;
  }

   /** @dev Get store front information 
    * @param _storeId Unique id of the new store front.
    * @return storeName Name of store front.
    * @return storeOwner Address of store front owner.
    * @return approvedBy Address of store front approver.
    * @return active Is store front approved or not.
    * @return skuCount Count of available products.
    */  
  function getStoreFrontbyId(uint _storeId) view public returns (string, address,address, bool, uint) {
      return (storeOwnertoStoreFront[_storeId].storeName, 
      storeOwnertoStoreFront[_storeId].storeOwner, 
      storeOwnertoStoreFront[_storeId].approvedBy, 
      storeOwnertoStoreFront[_storeId].active,
      storeOwnertoStoreFront[_storeId].skuCount);
  }
  
   /** @dev Get list of store front ids 
    * @return List of available store ids.
    */  
  function getStoreFrontIds() view public returns (uint[]) {
      return (storeOwnertoStoreIds[msg.sender]);
  }

   /** @dev Get total count of all store fronts 
    * @return count of available store fronts.
    */  
  function getStoreFrontCount() view public returns (uint) {
      return storeFrontCount;
  }
  
   /** @dev Get product information 
    * @param _storeId Unique id of the new store front.
    * @param _sku Unique id of the product.
    * @return name Name of product.
    * @return price Product sales price.
    * @return quantity Product quantity.
    * @return isRemoved boolean for if the product has been removed or not.
    */ 
  function getProductbysku(uint _storeId, uint _sku) view public returns (string ,uint,uint, bool)
  {
    return(storetoProducts[_storeId][_sku].name,
            storetoProducts[_storeId][_sku].price,
            storetoProducts[_storeId][_sku].quantity,
            storetoProducts[_storeId][_sku].isRemoved);
  }

   /** @dev Get product count by store front 
    * @param _storeId Unique id of the new store front.
    * @return count of total available products.
    */ 
  function getProductCountbyStoreId(uint _storeId ) view public returns (uint)
  {
    return(storeOwnertoStoreFront[_storeId].skuCount);
  }

   /** @dev Shopper can purchase a product 
    * @param _storeId Unique id of the new store front.
    * @param _sku Unique id of the product.
    */   
  function purchaseProduct(uint _storeId,uint _sku) public checkMarketStatus payable
  {
    require(msg.sender != storeIdtoStoreOwner[_storeId], "You cannot buy your own product.");
    require(msg.value == storetoProducts[_storeId][_sku].price, "Value transferred is less than the item price.");
    require(storetoProducts[_storeId][_sku].quantity > 0, "This item is sold out.");
    
    //keep track of who purchased which item and from which store
    buyertoStoretoProducts[msg.sender][_storeId].push(_sku);
   
    //add balance to withdraw later
    pendingWithdrawals[storeIdtoStoreOwner[_storeId]] = pendingWithdrawals[storeIdtoStoreOwner[_storeId]] + storetoProducts[_storeId][_sku].price;
    storetoProducts[_storeId][_sku].quantity--; 
    emit productPurchased(_storeId, _sku, storetoProducts[_storeId][_sku].quantity,msg.sender);

  }

   /** @dev Store owner can withdraw balance from their store fronts
    */ 
  function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // preventing re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
       emit amountWithdrawn(amount, msg.sender);
  }

   /** @dev View balance of store front 
    * @return Available balance for all owned store fronts.
    */ 
  function viewStoreBalance() onlyStoreOwner() view public returns(uint)
  {
      return pendingWithdrawals[msg.sender];
  }
  
  /** @dev fallback function.
  */
  function() external payable {

  }
}
