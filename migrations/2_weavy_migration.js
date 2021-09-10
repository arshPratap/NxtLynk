const Weavy = artifacts.require("Weavy");
const fs = require("fs");
const path = '/../public/metadata.js';
module.exports = function (deployer){
    deployer.deploy(Weavy).then(()=>{
        fs.writeFile(
            __dirname+path,
            'const ADDRESS = ' + "'"+Weavy.address+"';",
            (err)=>{
                if(err){
                    console.log(err)
                }else{

                }
            },
        )
        fs.appendFile(
            __dirname+path,
            '\nconst ABI = ' + JSON.stringify(Weavy.abi)+';',
            (err) =>{
                if(err){
                    console.log(err)
                } else {
                    fs.appendFile(
                        __dirname+path,
                        '\nmodule.exports = {ADDRESS,ABI};',
                        (err)=>{
                            if(err){
                                console.log(err)
                            }
                        },
                    )
                }
            },
        )
    })
}