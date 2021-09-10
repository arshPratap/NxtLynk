const mongoose = require('mongoose');
const {getToken,verifyToken} = require('./jwtauth');

const User = mongoose.model('User',new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String
    },
    bankacc:{
        type:String
    }
}));

const Farmer = mongoose.model('Farmer',new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String
    },
    bankacc:{
        type:String
    }
}));

const Insurance = mongoose.model('Insurance',new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String
    },
    bankacc:{
        type:String
    }
}));

const InsScheme = mongoose.model('InsScheme',new mongoose.Schema({
    _id:{
        type:String
    },
    farmId:{
        type:String
    },
    farmName:{
        type:String
    },
    insId:{
        type:String
    },
    insName:{
        type:String
    },
    insPhone:{
        type:String
    },
    status:{
        type:Number
    }
}));

const  initiateConn = function(){
        mongoose.connect('mongodb://localhost:27017/weavy')
        .then(()=>console.log("Connected to MongoDB"))
        .catch(err=>console.error("Error was : ",err));
};
const registerUser = function(req,res){
        if(req.body.hasOwnProperty('farmer')){
            Farmer.findOne({'email':req.body.email,'phone':req.body.phone},function(err,farmer){
                if(err){
                    console.log(err);
                    return;
                }
                if(farmer!==null){
                    console.log("Farmer exists");
                    return;
                }else{
                    console.log("New Farmer");
                    const i = new mongoose.Types.ObjectId().toHexString();
                    const token = getToken(req.body.name,req.body.email,i);
                    const farmer = new Farmer({
                        _id:i,
                        name:req.body.name,
                        password:req.body.pass,
                        email:req.body.email,
                        phone:req.body.phone
                    });
                    farmer.save((err,farmer)=>{
                        if(err){
                            console.log(err);
                            return;
                        }else{
                            res.cookie("jwt",token,{
                                expires:new Date(Date.now()+300000),
                                httpOnly:true
                            });
                            res.cookie("type","farmer",{
                                expires:new Date(Date.now()+300000),
                                httpOnly:true
                            });
                            console.log("Registration Successful");
                            res.redirect("/dash");
                        }
                    })
                }
            })
        }else if(req.body.hasOwnProperty('user')){
            User.findOne({'email':req.body.email,'phone':req.body.phone},function(err,user){
                if(err){
                    console.log(err);
                    return;
                }
                if(user!==null){
                    console.log("User exists");
                    return;
                }else{
                    console.log("New User");
                    const i = new mongoose.Types.ObjectId().toHexString();
                    const token = getToken(req.body.name,req.body.email,i);
                    const user = new User({
                        _id:i,
                        name:req.body.name,
                        password:req.body.pass,
                        email:req.body.email,
                        phone:req.body.phone
                    });
                    user.save((err,user)=>{
                        if(err){
                            console.log(err);
                            return;
                        }else{
                            res.cookie("jwt",token,{
                                expires:new Date(Date.now()+300000),
                                httpOnly:true
                            });
                            res.cookie("type","user",{
                                expires:new Date(Date.now()+300000),
                                httpOnly:true
                            });
                            console.log("Registration Successful");
                            res.redirect("/dash");
                        }
                    })
                }
            })
        }else if(req.body.hasOwnProperty('insurance')){
            Insurance.findOne({'email':req.body.email,'phone':req.body.phone},function(err,insurance){
                if(err){
                    console.log(err);
                    return;
                }
                if(insurance!==null){
                    console.log("Insurance exists");
                    return;
                }else{
                    console.log("New Insurance");
                    const i = new mongoose.Types.ObjectId().toHexString();
                    const token = getToken(req.body.name,req.body.email,i);
                    const insurance = new Insurance({
                        _id:i,
                        name:req.body.name,
                        password:req.body.pass,
                        email:req.body.email,
                        phone:req.body.phone
                    });
                    insurance.save((err,insurance)=>{
                        if(err){
                            console.log(err);
                            return;
                        }else{
                            res.cookie("jwt",token,{
                                expires:new Date(Date.now()+300000),
                                httpOnly:true
                            });
                            res.cookie("type","insurance",{
                                expires:new Date(Date.now()+300000),
                                httpOnly:true
                            });
                            console.log("Registration Successful");
                            res.redirect("/dash");
                        }
                    })
                }
            })
        }else{
            res.redirect("/reg");
        }
};

const loginUser = function(req,res){
    if(req.body.hasOwnProperty('user')){
        User.findOne({'name':req.body.name,'password':req.body.pass},function(err,user){
            if(err){
                console.log(err);
                return;
            }
            if(user !== null){
                console.log("Yes the user exists");
                const token = getToken(user.name,user.email,user._id);
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+300000),
                    httpOnly:true
                });
                res.cookie("type","user",{
                    expires:new Date(Date.now()+300000),
                    httpOnly:true
                });
                res.redirect("/dash");
            }else{
                console.log("The user does not exists");
                return;
            }
        })
    }else if(req.body.hasOwnProperty('farmer')){
        Farmer.findOne({'name':req.body.name,'password':req.body.pass},function(err,farmer){
            if(err){
                console.log(err);
                return;
            }
            if(farmer !== null){
                console.log("Yes the farmer exists");
                const token = getToken(farmer.name,farmer.email,farmer._id);
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+300000),
                    httpOnly:true
                });
                res.cookie("type","farmer",{
                    expires:new Date(Date.now()+300000),
                    httpOnly:true
                });
                res.redirect("/dash");
            }else{
                console.log("The farmer does not exists");
                return;
            }
        })
    }else if(req.body.hasOwnProperty('insurance')){
        Insurance.findOne({'name':req.body.name,'password':req.body.pass},function(err,insurance){
            if(err){
                console.log(err);
                return;
            }
            if(insurance !== null){
                console.log("Yes the insurance exists");
                const token = getToken(insurance.name,insurance.email,insurance._id);
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+300000),
                    httpOnly:true
                });
                res.cookie("type","insurance",{
                    expires:new Date(Date.now()+300000),
                    httpOnly:true
                });
                res.redirect("/dash");
            }else{
                console.log("The insurance does not exists");
                return;
            }
        })
    }else{
        res.redirect("/log");
    }
};

const logoutUser = function(body){
        console.log(body);
};

const getForm = function (req,res) {
    if(req.cookies.jwt){
        Insurance.find({},function(err,ins){
            if(err){
                console.log(err);
            }else{
                console.log(ins);
                const farmer = verifyToken(req.cookies.jwt);
                Farmer.findOne({_id:farmer.sub},function (err,f) {
                    if(err){
                        console.log(err)
                    }else{
                        console.log(f);
                        res.render("insuranceform",{insList:ins,farmerName:f.name,farmerPhone:f.phone});
                    }
                })
            }
        })
    }else{
        console.log("JWT Failed");
    }
}

const submitForm = function (req,res) {
    if(req.cookies.jwt){
        Insurance.findOne({name:req.body.insurance},function(err,ins){
            if(err){
                console.log(err);
            }else{
                const i = new mongoose.Types.ObjectId().toHexString();
                const iId = ins._id;
                const iPhone = ins.phone;
                const fId = verifyToken(req.cookies.jwt).sub;
                const fName = verifyToken(req.cookies.jwt).name;
                const insScheme=InsScheme({
                    _id:i,
                    farmId:fId,
                    farmName:fName,
                    insId:iId,
                    insName:ins.name,
                    insPhone:ins.phone,
                    status:0
                });
                insScheme.save((err,scheme)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added successfully");
                        res.redirect("/insurance");
                    }
                })
            }
        })
    } else {
        console.log("JWT Failed");
    }
}

const getInsuances = function(req,res){
    if(req.cookies.jwt){
        const id = verifyToken(req.cookies.jwt).sub;
        if(req.cookies.type === "farmer"){
            InsScheme.find({farmId:id},function (err,ins) {
                if(err){
                    console.log(err)
                }else{
                    console.log(ins);
                    console.log(req.cookies.type);
                    res.render("insurancelist",{insList:ins,uType:req.cookies.type})
                }
            });
        }else if(req.cookies.type === "insurance"){
            InsScheme.find({insId:id},function (err,ins) {
                if(err){
                    console.log(err);
                }else{
                    console.log(ins);
                    console.log(req.cookies.type);
                    res.render("insurancelist",{insList:ins,uType:req.cookies.type})
                }
            
            });
        }
    }else{
        console.log("JWT Failed");
    }
}

const insuranceDetail = function (req,res) {
    InsScheme.findOne({_id:req.params.insId},function(err,Ins){
        if(err){
            console.log(err);
            res.redirect("/insurance");
        }else{
            console.log(Ins);
            res.render("insurancedetail",{ins:Ins});
        }
    });
}
module.exports.User = User;
module.exports.Farmer = Farmer;
module.exports.Insurance = Insurance;
module.exports.initiateConn = initiateConn;
module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
module.exports.getForm = getForm;
module.exports.submitForm = submitForm;
module.exports.getInsuances = getInsuances;
module.exports.insuranceDetail = insuranceDetail;