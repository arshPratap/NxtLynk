const https = require("https");
const { verifyToken } = require("./jwtauth");

const getWeather = function(req,res){
    const endpoint="https://api.openweathermap.org/data/2.5/weather?";
    const api = "14ce206d5789e216af7642d526bf8372";
    const units = "metric";
    const city = req.body.city;
    const URL = endpoint+"q="+city+"&appid="+api+"&units="+units;
    https.get(URL,function(response){
        //console.log(response.statusCode);
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            if(req.cookies.jwt){
                if(req.cookies.type){
                    const name = verifyToken(req.cookies.jwt).name;
                    const weather = weatherData.main;
                    res.render("weather",{uType:req.cookies.type,user:name,weather:weather,city:city});
                }else{
                    res.render("reg");
                }
            } else{
                res.render("reg");
            }
        })
    });
}


const getAirQuality = function (req,res) {
    const endpoint = "https://api.ambeedata.com/latest/by-city?";
    const apikey = "f38dbb17c022062f77cd6387f5f672891524b0bc1c84a0b9eb27ddf5fbedb78f";
    const city = req.body.city;
    const URL = endpoint+"city="+city;
    console.log(URL);
    const options = {
        "headers":{
            "x-api-key": apikey,
            "Content-type": "application/json"
        }
    }
    https.get(URL,options,function (response) {
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            if(req.cookies.jwt){
                if(req.cookies.type){
                    const name = verifyToken(req.cookies.jwt).name;
                    //const weather = weatherData.main;
                    res.render("airquality",{uType:req.cookies.type,user:name,air:weatherData.stations[0],city:city});
                }else{
                    res.render("reg");
                }
            } else{
                res.render("reg");
            }
        })
    })
}
/*
const getPollenForecast = function(req,res) {
    const endpoint = "https://api.ambeedata.com/forecast/pollen/by-place?";
    const apikey = "7a69bac9921bcf3205b84686d01649f931a80b79da35a39e52671ff7be0f2334";
    const city = req.body.city;
    const URL = endpoint+"place="+city;
    console.log(URL);
    const options = {
        "headers":{
            "x-api-key": apikey,
            "Content-type": "application/json"
        }
    }
    https.get(URL,options,function (response) {
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            res.redirect("/dash");
        })
    })
}*/

const getSoilData = function(req,res) {
    const endpoint = "https://api.ambeedata.com/soil/latest/by-lat-lng?";
    const apikey = "f38dbb17c022062f77cd6387f5f672891524b0bc1c84a0b9eb27ddf5fbedb78f";
    const lat = req.body.lat;
    const lng = req.body.lng;
    const URL = endpoint+"lat="+lat+"&lng="+lng;
    console.log(URL);
    const options = {
        "headers":{
            "x-api-key": apikey,
            "Content-type": "application/json"
        }
    }
    https.get(URL,options,function (response) {
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            if(req.cookies.jwt){
                if(req.cookies.type){
                    const name = verifyToken(req.cookies.jwt).name;
                    //console.log(name);
                    //const weather = weatherData.main;
                    res.render("soildata",{uType:req.cookies.type,user:name,soil:weatherData.data[0]});
                }else{
                    res.render("reg");
                }
            } else{
                res.render("reg");
            }
        })
    })
}

const getFireData = function (req,res) {
    const endpoint = "https://api.ambeedata.com/latest/fire?";
    const apikey = "f38dbb17c022062f77cd6387f5f672891524b0bc1c84a0b9eb27ddf5fbedb78f";
    const lat = req.body.lat;
    const lng = req.body.lng;
    const URL = endpoint+"lat="+lat+"&lng="+lng;
    console.log(URL);
    const options = {
        "headers":{
            "x-api-key": apikey,
            "Content-type": "application/json"
        }
    }
    https.get(URL,options,function (response) {
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            if(req.cookies.jwt){
                if(req.cookies.type){
                    const name = verifyToken(req.cookies.jwt).name;
                    //console.log(name);
                    //const weather = weatherData.main;
                    res.render("firedata",{uType:req.cookies.type,user:name,weather:weatherData.data[0]});
                }else{
                    res.render("reg");
                }
            } else{
                res.render("reg");
            }
        })
    })
}


module.exports.getWeather = getWeather;
module.exports.getAirQuality = getAirQuality;
//module.exports.getPollenForecast = getPollenForecast;
module.exports.getSoilData = getSoilData;
module.exports.getFireData = getFireData;
