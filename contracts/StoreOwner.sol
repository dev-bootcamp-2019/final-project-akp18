pragma solidity ^0.4.24;

import "./MarketAdmin.sol";
import { HelperLibrary } from "./HelperLibrary.sol";

contract StoreOwner is MarketAdmin {

  uint storeFrontCount;
  mapping(address => uint[]) public storeOwnertoStoreIds;
  mapping(uint => address) public storeIdtoStoreOwner;
  mapping(uint => Product[]) public storetoProducts;
  mapping(uint => StoreFront) public storeOwnertoStoreFront;
  mapping (address => uint) pendingWithdrawals;
  mapping(address => mapping(uint => uint[])) public buyertoStoretoProducts;
  
  /**
    Event for new store creation 
   **/
  event storeFrontCreated(uint _storeId, string _storeName);
  
   /**
    Event for when a store front gets approval
   **/
  event storeFrontApproved(uint _storeId, address _approvedBy);
  
   /**
    Event for when a new product gets added to a store
   **/
  event productAdded(uint _storeId, uint _sku);
  
   /**
    Event for when a product is removed from a store
   **/
  event productRemoved(uint _storeId,uint _sku);
  
   /**
    Event for when a product gets updated from a StoreFront
   **/
  event productUpdated(uint _storeId,uint _sku);
  
   /**
    Event for when a product is purchased by someone
   **/
  event productPurchased(uint _storeId, uint _sku, uint _quantity, address _purchasedBy);
  
   /**
    Event for when pending balance is wwithdrawn by the store owner 
   **/
  event amountWithdrawn(uint _amount, address _withdrawnBy);
  
   /**
    Struct for capturing store fronmt information
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
    Struct for capturing product information
   **/  
  struct Product
  {
    string name;
    uint sku;
    uint price;
    uint quantity;
    bool isRemoved;
  }  
  
  modifier verifyStoreOwner (uint _storeId) { require(storeIdtoStoreOwner[_storeId] == msg.sender); _;}
  
  function createStoreFront(string _storename) onlyStoreOwner() checkMarketStatus public returns (uint _storeId) 
  {
        _storeId = addStoreFront(_storename);
        emit storeFrontCreated(_storeId, _storename);
  }
  
  /** Storer owner can add new store fronts*/
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
  
  function approveStoreFront(uint _storeId) checkMarketStatus public
  {
      require(super.isAdmin(msg.sender));
      storeOwnertoStoreFront[_storeId].approvedBy = msg.sender;
      storeOwnertoStoreFront[_storeId].active = true;
      emit storeFrontApproved(_storeId, msg.sender);
  }
  
  function addProduct(uint _storeId,string _name, uint _price,uint _quantity) verifyStoreOwner(_storeId) checkMarketStatus public 
  {
    require(storeOwnertoStoreFront[_storeId].active == true);
    //get next available sku
    uint _sku = storeOwnertoStoreFront[_storeId].skuCount;

    //add the new prooduct
    //storetoProducts[_storeId][_sku] = Product({name: _name, sku: _sku, price: _price, quantity: _quantity,isRemoved: false});
    storetoProducts[_storeId].push(Product( _name,  _sku,  _price,  _quantity, false));
    storeOwnertoStoreFront[_storeId].skuCount += 1;
    emit productAdded(_storeId, _sku);
  }
  
  function updateProduct(uint _storeId,uint _sku,string _name, uint _price,uint _quantity) verifyStoreOwner(_storeId) checkMarketStatus public returns(bool)
  {
    storetoProducts[_storeId][_sku].name = _name;
    storetoProducts[_storeId][_sku].price = _price;
    storetoProducts[_storeId][_sku].quantity = _quantity;
    emit productUpdated(_storeId, _sku);
    return true;
  }
  
  function removeProduct(uint _storeId,uint _sku) verifyStoreOwner(_storeId) checkMarketStatus public returns(bool)
  {
    storetoProducts[_storeId][_sku].isRemoved = true;
    emit productRemoved(_storeId, _sku);
    return true;
  }

  function getStoreFrontbyId(uint _storeId) view public returns (string, address,address, bool, uint) {
      return (storeOwnertoStoreFront[_storeId].storeName, 
      storeOwnertoStoreFront[_storeId].storeOwner, 
      storeOwnertoStoreFront[_storeId].approvedBy, 
      storeOwnertoStoreFront[_storeId].active,
      storeOwnertoStoreFront[_storeId].skuCount);
  }
  
  function getStoreFrontIds() view public returns (uint[]) {
      return (storeOwnertoStoreIds[msg.sender]);
  }
  
  function getStoreFrontCount() view public returns (uint) {
      return storeFrontCount;
  }
  
  function getProductbysku(uint _storeId, uint _sku) view public returns (string ,uint,uint, bool)
  {
    return(storetoProducts[_storeId][_sku].name,
            storetoProducts[_storeId][_sku].price,
            storetoProducts[_storeId][_sku].quantity,
            storetoProducts[_storeId][_sku].isRemoved);
  }

  function getProductCountbyStoreId(uint _storeId ) view public returns (uint)
  {
    return(storeOwnertoStoreFront[_storeId].skuCount);
  }
  
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
  
  function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // preventing re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
       emit amountWithdrawn(amount, msg.sender);
  }
  
  function viewStoreBalance() onlyStoreOwner() view public returns(uint)
  {
      return pendingWithdrawals[msg.sender];
  }
  
  /**  fallback function.
  */
  function() external payable {

  }
}
