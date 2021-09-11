//import libraries
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {verifyToken} = require('./public/jwtauth');
const DBClient = require('./public/dbclient');
const https = require("https");
const qs = require("querystring");
const checksum_lib = require("./public/Paytm/checksum");
const config = require("./public/Paytm/config");
//configure the app
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(cookieParser());
const dbclient = new DBClient();
//app functions
app.get("/",function(req,res){
    res.render("home");
})

app.get("/apiw/:lat/:long",function(req,res){

    output = 0
    KEY = '154f485ccc97f7cbab902a81814ba8f1'
    LONG = req.params.long
    LAT = req.params.lat
    URL = "https://api.agromonitoring.com/agro/1.0/weather?lat=" + LAT + "&lon=" + LONG + "&appid=" + KEY
    request(URL, function(err,response,body){
        if(response.statusCode == 200){
            console.log(body)
            res.send(body)
        }
    })
    
})

app.get("/db",function(req,res){
    res.render("dbsource");
})
app.post("/db",function(req,res){
    console.log(req.body);
    if(req.body.hasOwnProperty('block')){
        dbclient.setDBSource(req.body.block);
    }
    dbclient.initialize();
    res.redirect("/reg");
})

app.get("/reg",function(req,res){
    res.render("register");
    
})
app.post("/reg",function(req,res){
    console.log(req.body);
    dbclient.register(req,res);
})
app.get("/log",function(req,res){
    res.render("login");
})
app.post("/log",function(req,res){
    console.log(req.body);
    dbclient.login(req,res);
})
app.get("/dash",function(req,res){
    if(req.cookies.jwt){
        let user = verifyToken(req.cookies.jwt);
        if(user){
            res.render('dashboard',{user:user.name});
        }else{
            res.redirect('/reg');
        }
    }else{
        res.redirect('/reg');
    }
})
app.get("/pdts",function (req,res) {
    dbclient.getAllProducts(req,res);
})
app.get("/pdtdetails/:pdtId",function(req,res){
    dbclient.getProduct(req,res);
})

app.get("/addpdt",function(req,res){
    res.render("addproduct");
})
app.post("/addpdt",function(req,res){
    dbclient.addProduct(req,res);
})

app.get("/insurance",function(req,res){
    //res.render("insurancelist");
    dbclient.getInsuranceList(req,res);
})
app.get("/addinsurance",function(req,res){
    dbclient.addInsurance(req,res);
})
app.post("/addinsurance",function(req,res){
    dbclient.submitInsurance(req,res);
})
app.get("/insurancedetails/:insId",function(req,res){
    dbclient.getInsuranceDetail(req,res);
})
app.get("/test",function(req,res) {
    res.render("test");
})
app.post("/paytm",function (req,res) {
    console.log(req.body);
    let paymentDetails = {
        amount : req.body.amt,
        customerId : req.body.name,
        customerEmail : req.body.email,
        customerPhone : req.body.phone
    }
    if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
        res.status(400).send('Payment failed')
    } else {
        var params = {};
        params['MID'] = config.PaytmConfig.mid;
        params['WEBSITE'] = config.PaytmConfig.website;
        params['CHANNEL_ID'] = 'WEB';
        params['INDUSTRY_TYPE_ID'] = 'Retail';
        params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
        params['CUST_ID'] = paymentDetails.customerId;
        params['TXN_AMOUNT'] = paymentDetails.amount;
        params['CALLBACK_URL'] = 'http://localhost:3000/callback';
        params['EMAIL'] = paymentDetails.customerEmail;
        params['MOBILE_NO'] = paymentDetails.customerPhone;
    
    
        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
            var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
            // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
            var form_fields = "";
            for (var x in params) {
                form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
            }
            form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
    
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            //res.redirect("/bought");
            res.end();
        });
    }
});
app.post("/callback", (req, res) => {
    // Route for verifiying payment
    console.log("1");
    var body = '';
    
    console.log(req);
    console.log(req.body);  
       //var html = "";
    var post_data = req.body;
       //console.log("3");
       // received params in callback
    console.log('Callback Response: ', post_data, "\n");
  
       console.log("4");
       // verify the checksum
       var checksumhash = post_data.CHECKSUMHASH;
       // delete post_data.CHECKSUMHASH;
       var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
       console.log("Checksum Result => ", result, "\n");
        
  
       // Send Server-to-Server request to verify Order Status
       var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
        
       console.log("5");
       checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
         params.CHECKSUMHASH = checksum;
         post_data = 'JsonData='+JSON.stringify(params);
  
         var options = {
           hostname: 'securegw-stage.paytm.in', // for staging
           // hostname: 'securegw.paytm.in', // for production
           port: 443,
           path: '/merchant-status/getTxnStatus',
           method: 'POST',
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Content-Length': post_data.length
           }
         };
  
  
         // Set up the request
         var response = "";
         var post_req = https.request(options, function(post_res) {
           post_res.on('data', function (chunk) {
             response += chunk;
           });
  
           post_res.on('end', function(){
             console.log('S2S Response: ', response, "\n");
  
             var _result = JSON.parse(response);
               if(_result.STATUS == 'TXN_SUCCESS') {
                   res.send('payment sucess')
               }else {
                   res.send('payment failed')
               }
             });
         });
  
         // post the data
         post_req.write(post_data);
         post_req.end();
        });
  });
  
app.listen("3000",function(){
    console.log("Server Started");
})
