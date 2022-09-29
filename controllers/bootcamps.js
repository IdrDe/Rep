const asyncHandler = require('../middleware/async')

const Bootcamp=require('../models/Bootcamp')
const ErrorResponse=require('../utils/errorResponse')
const geocoder=require('../utils/geocoder')

exports.getBootcamps = asyncHandler(async (req, res, next) => {
let query;

// copy req.query
const reqQuery = {...req.query};

const removeFields = ['select', 'sort'];

removeFields.forEach(param => delete reqQuery[param]);

// create query string
let queryStr = JSON.stringify(req.query);

queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

query = Bootcamp.find(JSON.parse(queryStr));

// SELECT fields
if(req.query.select){
const fields = req.query.select.split(',').join(' ');
query = query.select(fields);
}

if(req.query.sort){
const sortBy = req.query.sort.split(',').join(' ');
query = query.sort(sortBy);
} else {
query=query.sort('-createedAt');
}

const bootcamps=await query;

res.status(200).
json({success:true,count:bootcamps.length,data:bootcamps});
});


exports.getBootcamp = asyncHandler(async (req, res, next) => {

const bootcamp=await Bootcamp.findById(req.params.id);
if(!bootcamp){
return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404))

}
res.status(200).json({success:true,data:bootcamp});
});

exports.createBootcamps = asyncHandler(async (req, res, next) => {
const bootcamp=await  Bootcamp.create(req.body);
res.status(201).json({
    success: true,
    data: bootcamp
  }); 
});

exports.updateBootcamps = asyncHandler(async (req, res, next) => {
const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{

new:true,
runValidators:true

})
if(!bootcamp)
return  next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404))

res.status(200).json({success:true,data:bootcamp})


});


exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)

if(!bootcamp)
{
    return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404))

}
res.status(200).json({success:true,data:{} });
});



//get bootcamps within a radius 

//Get /api/v1/bootcamps/radius/:zipcode/:distance 

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
 const {zipcode,distance}=req.params;

 const loc =await geocoder.geocode(zipcode);
 const lat=loc[0].latitude;
 const lng=loc[0].longitude;


 //calc radius using radians


 const radius=distance/3963
 const bootcamps=await Bootcamp.find({
    location:{$geoWithin:{$centerSphere :[[lng,lat],radius]}}
    });

res.status(200).json({
success: true,
count: bootcamps.length,
data: bootcamps})
});