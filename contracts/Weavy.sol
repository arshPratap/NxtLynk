pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;
contract Weavy{
    struct User{
        string id;
        string name;
        string password;
        string email;
        string phone;
    }

    struct Farmer{
        string id;
        string name;
        string password;
        string email;
        string phone;
    }

    struct Insurance{
        string id;
        string name;
        string password;
        string email;
        string phone;
    }

    struct Product{
        string id;
        string pdtId;
        string name;
        string detail;
        string price;
    }

    struct InsScheme{
        string id;
        string farmName;
        string insName;
        string insPhone;
        uint8 status;
    }

    mapping(string=>bool) public regAuth;
    mapping(string=>bool) public logAuth;
    User[] public users;
    Farmer[] public farmers;
    Insurance[] public insurances;
    Product[] public products;
    InsScheme[] public schemes; //temporary

    mapping(string=>uint16) public pdtKey;
    mapping(string=>uint16) public farmKey;
    mapping(string=>uint16) public userKey;
    mapping(string=>uint16) public insKey;
    
    mapping(string=>Product[]) public userProducts;
    mapping(string=>InsScheme[]) public userInsSchemes;
    mapping(string=>uint16) public schemeKey;

    uint16 public lengthofProducts = 0;
    uint16 public numofIns = 0;
    uint16 public numofUsers = 0;
    uint16 public numofFarmers = 0;
    uint16 public numofSchemes = 0;

    function signUp(string memory reg,string memory log,string memory _name,string memory _password,string memory  _email,string memory _phone,uint8 uType) public returns(bool) {
            if(!regAuth[reg]){
                regAuth[reg] = true;
                logAuth[log] = true;
                if(uType == 0){
                    farmers.push(Farmer(log,_name,_password,_email,_phone));
                    farmKey[log] = numofFarmers;
                    numofFarmers ++;
                } else if (uType == 1) {
                    users.push(User(log,_name,_password,_email,_phone));
                    userKey[log] = numofUsers;
                    numofUsers ++;
                } else {
                    insurances.push(Insurance(log,_name,_password,_email,_phone));
                    insKey[log] = numofIns;
                    numofIns ++;
                }
                return true;
            }
            else{
                return false;
            }
    }

    function signIn(string memory log) public view returns(bool) {
        return (logAuth[log]);
    }

    function addProduct(string memory id,string memory log,string memory _name,string memory _detail,string memory _price) public returns (bool){
        if(logAuth[log]){
            products.push(Product(id,log,_name,_detail,_price));
            userProducts[log].push(Product(id,log,_name,_detail,_price));
            pdtKey[id] = lengthofProducts;
            lengthofProducts ++;
            return true;
        }else{
            return false;
        }
    }
    function returnProducts() public view returns (Product[] memory){
        return products;
    }

    function returnProduct(string memory id) public view returns (Product memory){
        return products[pdtKey[id]];
    }

    function getUserProduct(string memory id) public view returns(Product[] memory){
        return userProducts[id];
    }

    function returnInsurances() public view returns (Insurance[] memory){
        return insurances;
    }
    function returnInsurance(string memory id) public view returns (Insurance memory){
        return insurances[insKey[id]];
    }

    function returnInsurancebyName(string memory name) public view returns (Insurance memory) {
        Insurance memory temp;
        for(uint16 i =0;i<numofIns;i++){
            if(keccak256(abi.encodePacked((insurances[i].name))) == keccak256(abi.encodePacked((name)))){
                temp = insurances[i];
                break;
            }else{
                if(i==(numofIns-1)){
                    temp=Insurance('','','','','');
                } else {
                    continue;
                }
            }
        }
        return temp;
    }

    function returnFarmer(string memory id) public view returns (Farmer memory){
        return farmers[farmKey[id]];
    }

    function addInsScheme(string memory id,string memory fId,string memory iId,string memory fName,string memory iName,string memory iPhone,uint8 status) public returns (bool) {
        if(logAuth[fId]){
            userInsSchemes[fId].push(InsScheme(id,fName,iName,iPhone,status));
            userInsSchemes[iId].push(InsScheme(id,fName,iName,iPhone,status));
            schemes.push(InsScheme(id,fName,iName,iPhone,status));
            schemeKey[id] = numofSchemes;
            numofSchemes ++;
            return true;
        }else{
            return false;
        }
    }

    function getInsSchemes(string memory log) public view returns (InsScheme[] memory){
        return userInsSchemes[log];
    }

    function getInsScheme(string memory Id) public view returns (InsScheme memory){
        return schemes[schemeKey[Id]];
    }
}