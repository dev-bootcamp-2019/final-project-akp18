pragma solidity ^0.4.24;
import './SafeMath.sol';

contract Ownable {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

  /** Create a modifer that checks if the msg.sender is the owner of the contract */
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }


    function transferOwnership(address newOwner) onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

contract Stoppable is Ownable
{
    bool stopMarket;
    
    constructor() public {
        stopMarket = false;
    }

    event marketStopped();
    
    /** CIRCUIT BREAKER PATTERN: Allows owner to stop the marketplace  */
    function changeMarketState() public onlyOwner {
        stopMarket = !stopMarket;
        emit marketStopped();
    }
    
    /** MODIFIER to check if marketplace is active  */
    modifier checkMarketStatus() {
        if(!stopMarket) _;
    }

}

contract MarketAdmin is Stoppable {
  
  using SafeMath for uint;
  
  /** owner of the marketplace */
  address[] public admins;
  address[] public storeowners;
  mapping (address => bool) public approvedAdmins;
  mapping (address => bool) public approvedStoreOwners;
  
    /** enum USER_TYPE returns 
     * 0 for Market_Owner, 
     * 1 for Admin, 
     * 2 for Store_Owner 
     * 3 for Shopper
     */
    enum UserType { Market_Owner, Admin, Store_Owner, Shopper }
    
    /**
     * get type of the user accessing the smart contract
     * returns 0, 1, 2 or 3
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
  
  /** Create a modifer that checks if the msg.sender is an admin */
  modifier onlyAdmin () { require (approvedAdmins[msg.sender]); _;}

 /** Create a modifer that checks if the msg.sender is an admin */
  modifier onlyStoreOwner () { require (approvedStoreOwners[msg.sender]); _;}
  
  event adminAdded(address _admin);
  event storeownerAdded(address _storeowner);
  
/** Market owner can add other admins for the marketplace*/
  function addAdmin(address _admin) onlyOwner() checkMarketStatus public {
    require(approvedAdmins[_admin] == false);
    approvedAdmins[_admin] = true; 
    admins.push(_admin);
    emit adminAdded(_admin);
  }
  
  /** Market admin and market owner can add new store owners */
  function addStoreOwner(address _storeowner) onlyAdmin() checkMarketStatus public {
   require(approvedStoreOwners[_storeowner] == false);
    approvedStoreOwners[_storeowner] = true; 
    storeowners.push(_storeowner);
    emit storeownerAdded(_storeowner);
  }
  
  /** Checks to see if given address is market admin*/
  function isAdmin(address _checkaddress) public view returns(bool) {
    return(approvedAdmins[_checkaddress]);
  }

  /** Checks to see if given address is market store owner*/
  function isStoreOwner(address _checkaddress) public view returns(bool) {
    return(approvedStoreOwners[_checkaddress]);
  }
  
  /** Gets list of all store admins*/
  function getAdmins() public view returns(address[]) {
    return(admins);
  }
  
  /** Gets list of all store owners*/
  function getStoreOwners() public view returns(address[]) {
    return(storeowners);
  }
}


