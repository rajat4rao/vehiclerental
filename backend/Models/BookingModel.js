const mongoose=require('mongoose')

const Schema=mongoose.Schema(
    {
        sid:String,
        car_no:String,
        uid:String,
        start_date:String,
        drop_date:String,
        amount:String,
        payment_id: mongoose.Schema.Types.ObjectId 
    }
)
const BookingModel=mongoose.model("ActiveBookings",Schema);
module.exports={BookingModel}