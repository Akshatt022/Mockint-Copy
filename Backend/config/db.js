const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURI).then(()=>{
    console.log("connected mongo DB");
});

module.exports =mongoose.Connection;
