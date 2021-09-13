const Eth = require('web3-eth');
const eth =  new Eth('http://127.0.0.1:7545');
const {ADDRESS,ABI} = require('./metadata');
const {cryptoHash,getToken, verifyToken} = require('./jwtauth');

const contractInstance = new eth.Contract(ABI,ADDRESS);

const getTypeCode = function (body) {
    console.log(body.type);
    if(body.type === "Farmer"){
        return 0;
    }else if (body.type ==='Insurance'){
        return 2;
    }else{
        return 1;
    }
}
const getOGCode = function (code) {
    if(code===0){
        return 'Farmer';
    }else if (code === 2){
        return 'Insurance';
    }else{
        return 'Customer';
    }
}
const loginBlockchain = function(req,res){
    let x = cryptoHash(req.body.name,req.body.pass);
    contractInstance.methods.signIn(x).
    call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).then(
        function(result){
            if(result){
                res.cookie("blockhash",x,{
                    httpOnly:true
                });
                res.cookie("jwt",getToken(req.body.name,req.body.email,x),{
                    httpOnly:true
                });
                res.cookie("type",getOGCode(getTypeCode(req.body)),{
                    httpOnly:true
                });
                res.redirect("/dash");
            }else{
                res.redirect("/reg");
            }
        }
    )
}

const regBlockchain = function (req,res) {
    console.log(req.body);
    eth.getBalance('0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe').then(
        console.log
    );
    let x = cryptoHash(req.body.email,req.body.phone);
    let y = cryptoHash(req.body.name,req.body.pass);
    let code = getTypeCode(req.body);
    contractInstance.methods.signUp(x,y,req.body.name,req.body.pass,req.body.email,req.body.phone,code).
    send({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe',gas:3000000}).
    then(function(reciept) {
     
        console.log(reciept);
        res.cookie("jwt",getToken(req.body.name,req.body.email,y),{
            httpOnly:true
        });
        res.cookie("blockhash",y,{
            httpOnly:true
        });
        res.cookie("type",getOGCode(code),{
            httpOnly:true
        });
        res.redirect("/dash");
    });
}

const addProduct = function(req,res) {
    if(req.cookies.jwt){
        if(req.cookies.blockhash){
            const x = req.cookies.blockhash;
            const id = cryptoHash(req.body.head,req.body.detail,req.body.price);
            contractInstance.methods.addProduct(id,x,req.body.head,req.body.detail,req.body.price).
            send({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe',gas:3000000}).
            then(
                function (reciept) {
                    console.log(reciept);
                    res.redirect("/pdts");
                }  
            )
        }
    }else{
       console.log("No jwt");
    }
}
const parseProducts = function(bproducts) {
    let pdtList=[];
    if(bproducts.length > 0){
        bproducts.forEach(product => {
        //    console.log(product['name']);
            pdtList.push({
              _id:product['id'],
             prodId:product['pdtId'],
               name:product['name'],
               details:product['detail'],
               price:product['price'], 
            })
        });
    }
    return pdtList;
}
const getProducts = function(req,res) {
    if(req.cookies.jwt){
        if(req.cookies.blockhash){
            const name = verifyToken(req.cookies.jwt).name;
            contractInstance.methods.returnProducts().
            call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).
            then(
                function (result) {
                    //console.log(result);
                    const pdts=parseProducts(result);
                    if(result.length===0){
                        res.render("products",{pdtList:[{
                            _id: '6137ea03d61cad779e15b52f',
                            prodId: '6137dd1e91499284e978c6e7',
                            name: 'qwerty',
                            details: 'qwerty',
                            price:'2000',
                            __v: 0
                          }],type:req.cookies.type,user:name});
                    }else{
                        res.render("products",{pdtList:pdts,type:req.cookies.type,user:name});
                    }
                }
            )
        }
    }else{
        console.log("No JWT");
    }
}

const getProduct = function(req,res){
    if(req.cookies.jwt){
        if(req.cookies.blockhash){
            const name = verifyToken(req.cookies.jwt).name; 
            contractInstance.methods.returnProduct(req.params.pdtId).
            call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).
            then(
                function(result){
                    res.render("productdetail",{pdtHead:result['name'],pdtDetail:result['detail'],pdtPrice:result['price'],type:req.cookies.type,name:name});
                }
            )

        }
    }else{
        console.log("No JWT");
    }
}

const parseInsurances=function(result){
    let insList = [];
    if(result.length > 0) {
        result.forEach(ins => {
            insList.push({
             name:ins['name'],
            })
        });
    }
    return insList;
}

const getForm = function(req,res){
    if(req.cookies.jwt){
        if(req.cookies.blockhash){
            contractInstance.methods.returnInsurances().
            call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).
            then(
                function(result){
                    const ins = parseInsurances(result);
                    contractInstance.methods.returnFarmer(req.cookies.blockhash).
                    call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).
                    then(
                        function (farmer) {
                            res.render("insuranceform",{insList:ins,farmerName:farmer['name'],farmerPhone:farmer['phone']});
                        }
                    )
                }
            )
        }
    }else{
        console.log("No JWT");
    }
}
const submitForm = function(req,res){
    if(req.cookies.jwt){
        if(req.cookies.blockhash){
            const token = cryptoHash(req.body.name,req.body.insurances,Date.now().toString());
            contractInstance.methods.returnInsurancebyName(req.body.insurances).
            call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).
            then(
                function(result){
                    //console.log("I am here");
                    console.log(result);
                    contractInstance.methods.addInsScheme(token,req.cookies.blockhash,result['id'],req.body.name,req.body.insurances,result['phone'],0).
                    send({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe',gas:3000000}).
                    then(
                        function(reciept){
                            console.log(reciept);
                            res.redirect("/insurance");
                        }
                    )
                }
            )
        }
    }else{
        console.log("No JWT");
    }
}

const parseSchemes = function(result){
    let schemeList = [];
    if(result.length > 0) {
        result.forEach(scheme => {
            schemeList.push({
             _id:scheme['id'],
             farmName:scheme['farmName'],
             insName:scheme['insName']
            })
        });
    }
    return schemeList;
}

const getInsurances = function (req,res) {
    if(req.cookies.jwt){
        if(req.cookies.blockhash){
            const name = verifyToken(req.cookies.jwt).name;
            contractInstance.methods.getInsSchemes(req.cookies.blockhash).
            call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).
            then(
                function(result){
                    const ins = parseSchemes(result);
                    res.render("insurancelist",{insList:ins,uType:req.cookies.type,user:name});
                }
            )
        }
    }else{
        console.log("no Jwt");
    }
}
const insuranceDetail = function (req,res) {
    if(req.cookies.jwt){
        const name =verifyToken(req.cookies.jwt).name;
        if(req.cookies.blockhash){
            contractInstance.methods.getInsScheme(req.params.insId).
            call({from:'0x5c5DAedc0c4f926b1563379Bc1E30A71268516fe'}).
            then(
                function (result) {
                    const INS = {
                        insName:result.insName,
                        farmName:result.farmName,
                        status:result.status
                    };
                    res.render("insurancedetail",{ins:INS,user:name,uType:req.cookies.type});
                }
            )
        }
    }else{
        console.log("no Jwt");
    }
}
module.exports.contractInstance = contractInstance;
module.exports.regBlockchain = regBlockchain;
module.exports.loginBlockchain = loginBlockchain;
module.exports.getBlockProducts = getProducts;
module.exports.getBlockProduct = getProduct;
module.exports.addBlockProduct = addProduct;
module.exports.getBlockForm = getForm;
module.exports.submitBlockForm = submitForm;
module.exports.getBlockInsurances = getInsurances;
module.exports.insuranceBlockDetail = insuranceDetail;

