const fs=require('fs');
const mongoose = require('mongoose');
const dotenv=require('dotenv');

//Load env vars
dotenv.config({path:'./config/config.env'});
//Load models
const Bootcamp=require('./models/Bootcamp');
//connect to DB
mongoose.connect(process.env.MONGO_URI,{
             useNewUrlParser: true,
          useUnifiedTopology: true,
         


        });

//read the json files
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

//Import into DB
const importData=async () =>{
    try{
    await Bootcamp.create(bootcamps);
    process.exit();
    }catch(err){
    console.error(err)
    }

}

//Delete data
const deleteData=async () =>{
    try{
    await Bootcamp.deleteMany();
    process.exit();
    }catch(err){
    console.error(err)
    }

}

if(process.argv[2] ==='-i'){
importData()
}
else if(process.argv[2]==='-d')
deleteData()