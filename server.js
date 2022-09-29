const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB=require('./config/db')
const errorHandler=require('./middleware/error')

//Route files


dotenv.config({ path: './config/config.env'});
connectDB()
const bootcamps=require('./routes/bootcamps')
const app = express();
//body parser
app.use(express.json())


// dev logging middleware
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps',bootcamps)
app.use(errorHandler)



const PORT = process.env.PORT || 5000;

const server =app.listen(
PORT, 
console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


process.on('unhandledRejection',(err,promise)=>{

console.log(`Error: ${err.message}`)
server.close(()=>process.exit(1) )
})