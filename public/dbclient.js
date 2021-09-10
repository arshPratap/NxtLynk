const {initiateConn,registerUser,loginUser,logoutUser,User,Farmer,Insurance,getForm,submitForm,getInsuances,insuranceDetail} = require("./mongoclient");
const {contractInstance,loginBlockchain,regBlockchain,getBlockProducts,getBlockProduct,addBlockProduct,getBlockForm,submitBlockForm,getBlockInsurances,insuranceBlockDetail} = require("./blockchainclient");
const {addMongoProduct,Product,getMongoAllProducts,getMongoProduct} = require('./products');
class DBClient{
    constructor(dbsource){
        this.dbsource = "MONGO";
        console.log('DB Client Initalized');
    }
    initialize(){
        if(this.dbsource === "MONGO"){
            initiateConn();
        }
    }
    setDBSource(dbsource){
        this.dbsource = dbsource;
    }
    register(req,res){
        if(this.dbsource === "MONGO"){
            registerUser(req,res);
        } else if(this.dbsource === "BLOCKCHAIN"){
            regBlockchain(req,res);
        }
    }
    login(req,res){
        if(this.dbsource === "MONGO"){
            loginUser(req,res);
        } else if(this.dbsource === "BLOCKCHAIN"){
            loginBlockchain(req,res);
        }
    }

    getAllProducts(req,res){
        if(this.dbsource === "MONGO"){
            getMongoAllProducts(req,res);
        } else if(this.dbsource === "BLOCKCHAIN"){
            getBlockProducts(req,res);
        }
    }

    getProduct(req,res){
        if(this.dbsource === "MONGO"){
            getMongoProduct(req,res);
        }else if(this.dbsource === "BLOCKCHAIN"){
            getBlockProduct(req,res);
        }
    }

    addProduct(req,res){
        if(this.dbsource === "MONGO"){
            addMongoProduct(req,res);
        } else if(this.dbsource === "BLOCKCHAIN"){
            addBlockProduct(req,res);
        }
    }

    addInsurance(req,res){
        if(this.dbsource === "MONGO"){
            getForm(req,res);
            //res.render("insuranceform");
        }else{
            getBlockForm(req,res);
        }
    }

    submitInsurance(req,res){
        if(this.dbsource === "MONGO"){
            submitForm(req,res);
        }else{
            submitBlockForm(req,res);
        }
    }

    getInsuranceList(req,res){
        if(this.dbsource === "MONGO"){
            getInsuances(req,res);
        }else{
            getBlockInsurances(req,res);
        }
    }
    getInsuranceDetail(req,res){
        if(this.dbsource === "MONGO"){
            insuranceDetail(req,res);
        }else{
            insuranceBlockDetail(req,res);
        }
    }

}

module.exports = DBClient;