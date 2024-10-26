const express = require('express');
const app = express.Router();

const firebase = require('../firebase');
const { getAuth } = require('firebase-admin/auth');
const { async } = require('@firebase/util');
const auth = getAuth(firebase);

const {CarModel} =require("../Models/CarModel")
const {BookingModel}=require("../Models/BookingModel")
const {PastBookingModel}=require("../Models/PastBookingModel");
const { CarMetaData } = require('../Models/CarMetaData');
const {SellerModel}=require('../Models/SellerModel')
const {ReviewModel} = require('../Models/ReviewModel');
const {UserModel} = require('../Models/UserModel');
const {ContactMessage} = require('../Models/ContactMessage');
const {PaymentHistory} = require('../Models/PaymentHistory');
const authenticate = require('../middleware/authenticate'); 

const {transporter}=require('../Mailer/Mail')




app.get('/Dashboard',authenticate,async(req,res)=>
{
    const ListofCars=await CarModel.aggregate([
    {
      $match:
        {
            isverified:false
        }
    },
    {
       $lookup:{
           from:'sellerdetails',
           localField:'sid',
           foreignField:'sid',
           as:'sellerdetails'
       }
    },
    {
        $unwind: "$sellerdetails"
    },
    {
        $project: {
          _id: 1,
          'cardetails.car_no':'$$ROOT.car_no',
          'cardetails.name':'$$ROOT.name',
          'cardetails.img':'$$ROOT.img',
          'cardetails.fuel':'$$ROOT.fuel',
          'cardetails.make':'$$ROOT.make',
          'cardetails.model':'$$ROOT.model',
          'cardetails.type':'$$ROOT.type',
          'cardetails.location':'$$ROOT.location',
          'cardetails.year':'$$ROOT.year',
          'cardetails.price':'$$ROOT.price',
          'sellerdetails.sid': 1,
          'sellerdetails.name': 1,
          'sellerdetails.phone': 1,
        },
    },
    ])
    res.send(ListofCars)
})

app.post('/VerifyCar',authenticate,async(req,res)=>
{
    const {car_no,sid}=req.body
    await CarModel.updateOne({car_no:car_no,sid:sid},{$set:{isverified:true}})

    const sellerdetails=await SellerModel.findOne({sid:sid}).select({email:1,name:1})
    const cardetails=await CarModel.findOne({car_no:car_no}).select({name:1,make:1})

    var mailOptions = {
    from: 'balprao@gmail.com',
    to: `${sellerdetails.email}`,
    subject: 'Congratulations! Your Car is Verified',
    html: `
    <div class="container">
    <p>Dear ${sellerdetails.name},</p>

    <p>We are thrilled to inform you that your car listing has been successfully verified. Congratulations! Your vehicle is now ready to be listed and rented by users on our platform.</p>

    <p>Details:</p>
    <table border>
      <tr>
        <th>Car Number</th>
        <th>Car Model</th>
      </tr>
      <tr>
        <td>${car_no}</td>
        <td>${cardetails.make} ${cardetails.name}</td>
      </tr>
    </table>

    <p>You can now proceed to list your car for rent, allowing users to discover and book it for their upcoming journeys. To begin the listing process, log in to your account and navigate to the car management section on our website.</p>

    <p>If you have any questions or need assistance, feel free to reach out to our support team. Thank you for choosing our platform to share your vehicle with others!</p>

    <p>Best regards,<br>
    RentnRide<br>
    balprao@gmail.com<br>
  </div>
        `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
    res.send({action:true})
})

app.post('/DeleteCar',authenticate,async(req,res)=>
{
    const {singlecar,Reason}=req.body

    const sellerdetails=await SellerModel.findOne({sid:singlecar.sid}).select({email:1,name:1})
    const cardetails=await CarModel.findOne({car_no:singlecar.car_no}).select({name:1,make:1,car_no:1})
    await CarModel.deleteOne({car_no:singlecar.car_no,sid:singlecar.sid})

    var mailOptions = {
    from: 'balprao@gmail.com',
    to: `${sellerdetails.email}`,
    subject: 'Your Car Listing Has Been Rejected',
    html: `
        <div class="container">
        <p>Dear ${sellerdetails.name},</p>

        <p>We regret to inform you that your car listing has been rejected due to the following reasons:</p>
        <ul>
            <li>Car Number:${singlecar.car_no}</li>
            <li>Car Details:${cardetails.make} ${cardetails.name}</li>
            <li>Reason:${Reason}</li>
        </ul>

        <p>We understand that this might be disappointing, and we appreciate your effort in listing your car on our platform. To enhance your chances of approval, please review the provided reasons and make the necessary adjustments to your listing.</p>

        <p>If you have any questions or need further clarification, don't hesitate to reach out to our support team. We are here to assist you in creating a successful car listing.</p>

        <p>Thank you for your understanding and cooperation.</p>

    <p>Best regards,<br>
    RentnRide<br>
    balprao@gmail.com<br>
  </div>
     `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
    res.send({action:true})
})

app.get('/ActiveCount',authenticate,async(req,res)=>
{
    const verified=await CarModel.find({isverified:true}).count()
    const unverified=await CarModel.find({isverified:false}).count()
    const total=verified+unverified
    const Bookings=await BookingModel.find().count() + await PastBookingModel.find().count()
    res.send({verified,unverified,total,Bookings})
}) 

app.get("/FiltersMetaData",authenticate,async(req,res)=>{
    const FiltersMetaData=await CarMetaData.find({})
    res.send(FiltersMetaData)
})

app.post('/UpdateMetaData',authenticate,async(req,res)=>
{
    const {Fuel,Make,Model,Type,FormDetails}=req.body
    if(FormDetails.Fuel!=='')
    {
        const fuels={fuel:FormDetails.Fuel,id:Fuel[Fuel.length-1].id+1}
        Fuel.push(fuels)
    }
    if(FormDetails.Make!=='')
    {
        const makes={make:FormDetails.Make,id:Make[Make.length-1].id+1}
        Make.push(makes)
    }
    if(FormDetails.Model!=='')
    {
        const models={model:FormDetails.Model,id:Model[Model.length-1].id+1}
        Model.push(models)
    }
    if(FormDetails.Type!=='')
    {
        const types={type:FormDetails.Type,id:Type[Type.length-1].id+1}
        Type.push(types)
    }
  await CarMetaData.updateMany({
      $set: {
          Fuel: Fuel,
          Model: Model,
          Make: Make,
          Type: Type,
      },
  });
  res.send({action:true})
})

app.get('/rental-history',authenticate, async (req, res) => {
  try {
      const { page, pageSize } = req.query; 

      const skip = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const rentalHistory = await PastBookingModel.aggregate([
        { $lookup: { from: 'userdetails', localField: 'uid', foreignField: 'uid', as: 'userdetails' } },
        { $unwind: '$userdetails' },
        { $lookup: { from: 'cardetails', localField: 'car_no', foreignField: 'car_no', as: 'cardetails' } },
        { $unwind: '$cardetails' },
        { $lookup: { from: 'sellerdetails', localField: 'sid', foreignField: 'sid', as: 'sellerdetails' } },
        { $unwind: '$sellerdetails' },

      ]).sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

      const totalCount = await PastBookingModel.countDocuments({}); 

      res.json({ rentalHistory, totalCount });
  } catch (error) {
      console.error("Error fetching rental history:", error);
      res.status(500).json({ error: "Failed to fetch rental history" });
  }
});

app.get('/active-rentals',authenticate, async (req, res) => {
    try {
        const { page, pageSize } = req.query; 
  
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);
  
        const rentalHistory = await BookingModel.aggregate([
          { $lookup: { from: 'userdetails', localField: 'uid', foreignField: 'uid', as: 'userdetails' } },
          { $unwind: '$userdetails' },
          { $lookup: { from: 'cardetails', localField: 'car_no', foreignField: 'car_no', as: 'cardetails' } },
          { $unwind: '$cardetails' },
          { $lookup: { from: 'sellerdetails', localField: 'sid', foreignField: 'sid', as: 'sellerdetails' } },
          { $unwind: '$sellerdetails' },
  
        ]).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
  
        const totalCount = await BookingModel.countDocuments({}); 
  
        res.json({ rentalHistory, totalCount });
    } catch (error) {
        console.error("Error fetching rental history:", error);
        res.status(500).json({ error: "Failed to fetch rental history" });
    }
  });

app.get('/unmoderated-reviews',authenticate, async (req, res) => {
  try {
      const reviews = await ReviewModel.find({ moderated: false });

      const populatedReviews = await Promise.all(reviews.map(async review => {

          const userDetails =await UserModel.findOne({ uid: review.uid }).select('name email');

          const carDetails = await CarModel.findOne({ car_no: review.car_no }).select('sid car_no');

          const sellerDetails = await SellerModel.findOne({ sid: carDetails.sid }).select('name email');

          return {
              _id: review._id,
              review_text: review.car_review,
              rating: review.car_rating,

              userdetails: userDetails,
              sellerdetails: sellerDetails,
              cardetails: carDetails,
          };
      }));

      res.json(populatedReviews);

  } catch (error) {
      console.error("Error fetching unmoderated reviews:", error);
      res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

app.delete('/reviews/:reviewId', authenticate,async (req, res) => {
  try {
      const reviewId = req.params.reviewId;
      const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

      if (!deletedReview) {
          return res.status(404).json({ message: 'Review not found' });
      }

      res.json({ message: 'Review deleted successfully' }); 
  } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: 'Failed to delete review' });
  }
});

app.patch('/reviews/:reviewId',authenticate, async (req, res) => {
  try {
      const reviewId = req.params.reviewId;
      const updatedReview = await ReviewModel.findByIdAndUpdate(reviewId, { moderated: true }, { new: true });

      if (!updatedReview) {
          return res.status(404).json({ message: 'Review not found' });
      }
      res.json({ message: 'Review kept and marked as moderated' });
  } catch (error) {
      console.error("Error keeping review:", error);
      res.status(500).json({ message: 'Failed to keep review' });
  }
});

app.get('/user-list', authenticate,async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalUsers = await UserModel.countDocuments(); 
      const users = await UserModel.find().select('name email phone').skip(skip).limit(limit); 

      res.json({
          users: users,
          total: totalUsers,
          currentPage: page,
          pageSize: limit
      });
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to load users" });
  }
});

app.get('/contactMessages',authenticate, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = status ? { status } : {}; 

        const skip = (page - 1) * limit;
        const messages = await ContactMessage.find(filter).skip(skip).limit(parseInt(limit));

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.patch('/contactMessages/:messageId',authenticate, async (req, res) => {
    try {
        const { messageId } = req.params;
        const { status } = req.body;  

        if (!['open', 'inprogress', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const updatedMessage = await ContactMessage.findByIdAndUpdate(
            messageId,
            { status },
            { new: true } 
        );

        if (!updatedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json({ message: updatedMessage }); 
    } catch (error) {
        console.error('Error updating contact message:', error);
        res.status(500).json({ error: 'Failed to update message' });
    }
});

app.get('/payment-history',authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query =  PaymentHistory.find()
            .skip(skip)
            .limit(limit)
            .sort({ _id: -1 });
            const payments = await query.exec();

        const paymentsWithBookingDetails = await Promise.all(
            payments.map(async (payment) => {

                const booking = await BookingModel.findOne({ payment_id: payment._id })
                    .select('start_date drop_date uid sid') 
                    .lean() 
                    .exec();
                return { ...payment, booking }; 
            })
        );

        const pastpaymentsWithBookingDetails = await Promise.all(
            paymentsWithBookingDetails.map(async (payment) => {
                console.log(payment);
                const pastbooking = await PastBookingModel.findOne({ payment_id: payment._id })
                    .select('start_date drop_date uid sid') 
                    .lean() 
                    .exec();

                return { ...payment, pastbooking }; 
            })
        );

        const paymentDetailswithUsername = await Promise.all(
            pastpaymentsWithBookingDetails.map(async (payment) => {
                console.log(payment._doc.uid);
                const userdetails = await UserModel.findOne({ uid: payment._doc.uid })
                    .select('name email') 
                    .lean() 
                    .exec();
                return { ...payment, userdetails }; 
            })
        );

        const fulldetails = await Promise.all(
            paymentDetailswithUsername.map(async (payment) => {
              const newPayment = { ...payment }; 
              newPayment.bookingDetails = null
              if (payment.booking) {
                newPayment.bookingDetails = payment.booking;           
              } else if (payment.pastbooking) {
                newPayment.bookingDetails = payment.pastbooking;
              }
              delete newPayment.booking;
              delete newPayment.pastbooking;

              if(newPayment.bookingDetails === null){
                newPayment.bookingDetails = {
                    start_date : "Canceled",
                    drop_date : "Canceled"
                }
              }

              return newPayment;
            })
          );

        console.log(fulldetails);

        const totalCount = await PaymentHistory.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            payments: fulldetails,
            totalPages: totalPages,
            currentPage: page
        });

    } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).json({ error: 'Error fetching payment history' });
    }
});

module.exports = app;
