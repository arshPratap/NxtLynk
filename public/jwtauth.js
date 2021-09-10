const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const generateAuthToken = function(name,email,id){
    const token = jwt.sign({
        iss:"8121b173-02e2-471d-9447-80926b9a2773",
        sub:id,
        name:name,
        email:email
    },"CV6:cxBRGs[bBVPdg3yGzf09ZTKn7eP=",{expiresIn:'300000'});
    return token;
}


const verifyToken = function(token){
    try{
        user=jwt.verify(token,"CV6:cxBRGs[bBVPdg3yGzf09ZTKn7eP=");
        return user;
    }catch(err){
        console.log(err);
    }
}

const cryptoHash = (...inputs)=>{
    const hash = crypto.createHash('sha256');
    hash.update(inputs.join(''));
    return hash.digest('hex');
}

module.exports.getToken = generateAuthToken;
module.exports.verifyToken = verifyToken;
module.exports.cryptoHash = cryptoHash;