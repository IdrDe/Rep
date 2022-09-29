const asyncHandler = require('../middleware/async')

const Bootcamp=require('../models/Bootcamp')
const ErrorResponse=require('../utils/errorResponse')


exports.getBootcamps = asyncHandler(async (req, res, next) => {
const bootcamps=await Bootcamp.find();

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
