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
        console.log(req.body);
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
                if(req.cookies.jwt){
                    if(req.cookies.type){
                        console.log(req.cookies.type);
                        let user = verifyToken(req.cookies.jwt);
                        res.render('products',{pdtList:products,type:req.cookies.type,user:user.name});
                    }else{
                        res.redirect('/reg');
                    }
                } else{
                    res.redirect("/reg");
                }
            }
        }
    });
}

const getProduct = function(req,res){
    Product.findOne({_id:req.params.pdtId},function(err,product){
        if(err){
            console.log(err);
            res.redirect("/pdts");
        }
        else if(product === null){
            //console.log();
            res.redirect("/pdts");
        }
        else{
            console.log(product);
            if(req.cookies.jwt){
                if(req.cookies){
                    console.log(req.cookies.type);
                    let user = verifyToken(req.cookies.jwt);
                    res.render('productdetail',{pdtHead:product.name,pdtDetail:product.details,pdtPrice:product.price,type:req.cookies.type,user:user.name});
                }else{
                    res.redirect('/reg');
                }
            } else{
                res.redirect("/reg");
            }
        }
    });
}
module.exports.Product = Product;
module.exports.addMongoProduct = addProduct;
module.exports.getMongoAllProducts = getAllProducts;
module.exports.getMongoProduct = getProduct;