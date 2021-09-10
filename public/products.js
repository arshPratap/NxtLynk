const mongoose = require('mongoose');
const {verifyToken} = require('./jwtauth');
const Product = mongoose.model('Products',new mongoose.Schema({
    _id:{
        type:String
    },
    prodId:{
        type:String
    },
    name:{
        type:String
    },
    details:{
        type:String
    },
    price:{
        type:String
    }
}));

const addProduct=function(req,res){
    console.log("Adding products");
    if(req.cookies.jwt){
        let user = verifyToken(req.cookies.jwt);
        console.log(user);
        const product = new Product({
            _id:new mongoose.Types.ObjectId().toHexString(),
            prodId:user.sub,
            name:req.body.head,
            details:req.body.detail,
            price:req.body.price
        });
        product.save((err,product)=>{
            if(err){
                console.log(err);
                res.redirect("/pdts");
            }else{
                console.log("Product Added Successfully");
                res.redirect("/pdts");
            }
        })
    }else{
        console.log("Nope");
        res.redirect("/pdts");
    }
}

const getAllProducts = function(req,res){
    Product.find({},function(err,products){
        if(err){
            console.log(err);
        }else{
            console.log(products);
            if(products.length===0){
                console.log("Add new products");
            }else{
                res.render('products',{pdtList:products})
            }
        }
    });
}

const getProduct = function(req,res){
    Product.findOne({_id:req.params.pdtId},function(err,product){
        if(err){
            console.log(err);
            res.redirect("/pdts");
        }else{
            console.log(product);
            res.render('productdetail',{pdtHead:product.name,pdtDetail:product.details,pdtPrice:product.price})
        }
    });
}

module.exports.Product = Product;
module.exports.addMongoProduct = addProduct;
module.exports.getMongoAllProducts = getAllProducts;
module.exports.getMongoProduct = getProduct;