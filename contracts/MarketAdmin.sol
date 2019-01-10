pragma solidity ^0.4.24;
import './SafeMath.sol';

/** @title Ownable contract. */
contract Ownable {
    address public owner;

    /** @dev Default constructor stores owner's address   */
    constructor() public {
        owner = msg.sender;
    }

    /** @dev MODIFIER to checks if the msg.sender is the owner of the contract   */
    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    /** @dev Transfers ownership to another address
      * @param newOwner Address of the new owner.
      */
    function transferOwnership(address newOwner) onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

/** @title Stoppable contract. Inherits from Ownable */
contract Stoppable is Ownable
{
    bool stopMarket;

    /** @dev Event to notify about market status change   */
    event marketStopped();

     /** @dev Default constructor sets the default state   */
    constructor() public {
        stopMarket = false;
    }
    
    /** @dev CIRCUIT BREAKER PATTERN: Allows owner to stop the marketplace   */
    function changeMarketState() public onlyOwner {
        stopMarket = !stopMarket;
        emit marketStopped();
    }
    
    /** @dev MODIFIER to check if marketplace is active  */
    modifier checkMarketStatus() {
        if(!stopMarket) _;
    }

    /** @dev Returns current state of market   */
     function getMarketState() public returns(bool){
        return stopMarket;
    }

}

/** @title Market admin contract. Inherits from Ownable and Stoppable */
contract MarketAdmin is Stoppable {
  
  using SafeMath for uint;
  
  /** owner of the marketplace */
  address[] public admins;
  address[] public storeowners;
  mapping (address => bool) public approvedAdmins;
  mapping (address => bool) public approvedStoreOwners;
  
    /**  @dev enum UserType returns 
     * 0 for Market_Owner, 
     * 1 for Admin, 
     * 2 for Store_Owner, 
     * 3 for Shopper
     */
    enum UserType { Market_Owner, Admin, Store_Owner, Shopper }
    
    /**
     *  @dev get type of the user accessing the smart contract
     *  @return UserType 
     *      0 for Market_Owner, 
     *      1 for Admin, 
     *      2 for Store_Owner, 
     *      3 for Shopper
    */
    function getUserType() public constant returns(UserType)
    {
        if(msg.sender == owner)
            return UserType.Market_Owner;
        if(approvedAdmins[msg.sender])
            return UserType.Admin;
        if(approvedStoreOwners[msg.sender])
            return UserType.Store_Owner;
        else
            return UserType.Shopper;
    }
  
    /** @dev MODIFIER that checks if the msg.sender is an admin */
    modifier onlyAdmin () { require (approvedAdmins[msg.sender]); _;}

    /** @dev MODIFIER that checks if the msg.sender is an admin */
    modifier onlyStoreOwner () { require (approvedStoreOwners[msg.sender]); _;}
   
    /** @dev Event to notify about new admin   */
    event adminAdded(address _admin);

   /** @dev Event to notify about new store owner   */
    event storeownerAdded(address _storeowner);
  
    /** @dev Market owner can add other admins for the marketplace*/
    function addAdmin(address _admin) onlyOwner() checkMarketStatus public {
        require(approvedAdmins[_admin] == false);
        approvedAdmins[_admin] = true; 
        admins.push(_admin);
        emit adminAdded(_admin);
    }
  
    /** @dev Market admin and market owner can add new store owners 
      * @param newOwner Address of the new owner.
      */
    function addStoreOwner(address _storeowner) onlyAdmin() checkMarketStatus public {
    require(approvedStoreOwners[_storeowner] == false);
        approvedStoreOwners[_storeowner] = true; 
        storeowners.push(_storeowner);
        emit storeownerAdded(_storeowner);
    }
  
    /** @dev Checks to see if given address is market admin.
      * @param _checkaddress address that needs to be checked.
      * @return boolean. True if it's admin, False if it's not admin.
      */
  function isAdmin(address _checkaddress) public view returns(bool) {
    return(approvedAdmins[_checkaddress]);
  }

    /** @dev Checks to see if given address is market store owner.
      * @param _checkaddress address that needs to be checked.
      * @return boolean. True if it's store owner, False if it's not store owner.
      */
  function isStoreOwner(address _checkaddress) public view returns(bool) {
    return(approvedStoreOwners[_checkaddress]);
  }
  
    /** @dev Gets list of all admins.
      * @return address[]. Array of admins.
      */
  function getAdmins() public view returns(address[]) {
    return(admins);
  }
  
    /** @dev Gets list of all store owners.
      * @return address[]. Array of store owners.
      */
  function getStoreOwners() public view returns(address[]) {
    return(storeowners);
  }
}


