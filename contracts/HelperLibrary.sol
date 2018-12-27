pragma solidity ^0.4.24;

library HelperLibrary {
    /** 
     * returns true if input parameter is empty, returns false if input parameter is not empty 
     */
    function IsEmptyString(string inputstr) public pure returns(bool)
    {
        // Uses memory to check string
        bytes memory tmpstr = bytes(inputstr); 
        if (tmpstr.length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
}
