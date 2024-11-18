const express = require('express');
const app = express.Router();
const fs = require("fs");
const path = require("path");

const {ExtendTripCars}=require('../Models/ExtendTripCars')
const {findAvailableCars}=require("../Models/BookAvailableCars");
const { FindListCars } = require('../Models/ListAvailableCars');
const xlsx=require('xlsx')
const bcrypt = require('bcrypt')
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const {transporter}=require('../Mailer/Mail')

const { UserModel } = require('../Models/UserModel');
const {CarModel} =require('../Models/CarModel');
const {BookingModel}=require('../Models/BookingModel')
const {CarMetaData}=require("../Models/CarMetaData")
const {ReviewModel}=require('../Models/ReviewModel')
const {PastBookingModel}=require('../Models/PastBookingModel')
const {MissedBookingModel}=require('../Models/MissedBooking')
const {DescriptionModel}=require('../Models/CarDescription')
const {SellerModel}=require('../Models/SellerModel')
const {PaymentHistory} = require('../Models/PaymentHistory'); 
const {ContactMessage} = require('../Models/ContactMessage');
const authenticateold = require('../middleware/authenticate'); 
const authenticate = require('../middleware/authenticatejwt');
const carUploadStorage = require('../middleware/multer'); 

const firebase = require('../firebase');
const { getAuth } = require('firebase-admin/auth');
const { async } = require('@firebase/util');
const { start } = require('repl');
const auth = getAuth(firebase);
const PDFDocument = require('pdfkit');

async function hashPassword(password) {
  const saltRounds = 10; 
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
}

function generateRandomAlphanumericSecure(length) {
  const bytes = crypto.randomBytes(length);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[bytes[i] % characters.length];
  }
  return result;
}

app.post("/CreateUser",async(req,res)=>
{
  const {name,email,password,phone,location}=req.body
  try
  {
    const userDetails=await UserModel.find({phone})
    if(userDetails.length>0)
    {
      res.send({status:"The phone number you entered is already registered",action:false})
    }
    else
    {
      const { salt, hash } = await hashPassword(password);
      //const acc = await auth.createUser({email,password});
      const uid = generateRandomAlphanumericSecure(30);
      await UserModel.insertMany({uid:String(uid),name:name.charAt(0).toUpperCase()+name.slice(1),email:email,password:hash,salt:salt,phone:phone,location:location.charAt(0).toUpperCase()+location.slice(1),gender:'',address:''})
      res.send({status:"Profile Created Successfully",action:true})  
    }
    }
  catch(err)
  {
    console.log(err)
    res.send({status:"The email address you provided is already registered",action:false})
  }
})

async function checkPassword(password, storedHash) {
  try {
      const match = await bcrypt.compare(password, storedHash);
      return match; 
  } catch (error) {
      console.error("Error comparing passwords:", error);
      return false; 
  }
}

app.post('/login', async (req, res) => { 
  const { email, password } = req.body;  
  const user=await UserModel.findOne({email:email}).select({password:1,email:1,uid:1})
  if (!user) {
    return res.status(401).json({ error: 'Invalid Credentials' });
  }
  const passwordMatches = await checkPassword(password, user.password);

  if (passwordMatches) {
      const payload = { uid: user.uid, email: user.email, user:true };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

      res.cookie('jwt', token, { 
        httpOnly: true,  
        maxAge: 360000000, 
        sameSite: 'none',  
        secure: true,
        domain: 'rentnride-user.netlify.app'
    });

      const response = {uid: user.uid}
      res.json(response);
  } else {
      res.status(401).json({ error: 'Invalid Credentials'});
  }
});

app.post('/logout', authenticate, (req, res) => {
  res.clearCookie('jwt', { 
      httpOnly: true,  
  });

  res.sendStatus(200); 
});

app.get('/check-auth-status', authenticate, (req, res) => {  

  if(req.user.user){
    res.json({ isAuthenticated: true, user: req.user });  
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
     
});



app.post("/findUser",authenticate,async(req,res)=>{

    const {uid}=req.body
    try
    {
      const response=await UserModel.findOne({uid}).select({uid:1,location:1})
      res.json(response)
    }
    catch(err)
    {
       console.log("Invalid Email")
    }

})

app.post('/forgotPassword',async(req,res)=>
{
    try {
      const {token,Password}=req.body
      const decodedUid = Buffer.from(token, 'base64').toString('utf8');
      const { salt, hash } = await hashPassword(Password);
      console.log(decodedUid)
      await UserModel.updateOne({uid:decodedUid},{$set:{password:hash, salt:salt}})
      res.send({action:true})
    } catch (error) {
      console.log(error)
      res.send({action:false})
    }
})


app.post("/sendPasswordReset",async(req,res)=>{

  const {email}=req.body
  const {uid}=await UserModel.findOne({email:email}).select({uid:1});


  const encodedUid = Buffer.from(uid).toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');


  var mailOptions = {
      from: 'balprao@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div>
          <h1>Dear Customer,</h1>
          <p>Click the following link to reset your password</p>
          ${process.env.USER_URL}/forgotPassword?token=${encodedUid},

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

app.get("/findCars",async(req,res)=>
{
    const CarList = await CarModel.find({isverified:true});
    const ListofCarsWithImages = await Promise.all(
      CarList.map(async (car) => {
        const userDir = `uploads/${car.sid}/${car.car_no}`;
        try {
          const files = await fs.promises.readdir(userDir); 
          const imageUrls = files
            .filter((file) => file.startsWith("img"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
          const extraimageUrls = files
            .filter((file) => file.startsWith("extraImages"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
          return { ...car._doc, imageUrls, extraimageUrls }; 
        } catch (error) {
          console.error("Error getting images for car:", car.car_no, error);
          return { ...car._doc, imageUrls: [], extraimageUrls: [] };  
        }
      })
    );
    res.send(ListofCarsWithImages)
})

app.post("/findAvailableCars",async(req,res)=>
{
    const {uid,start_date,drop_date,status,Fuel,price,Model,Make,Location,Type,ratings}=req.body

    var startdate=Number(start_date.split("-")[2]);
    var dropdate=Number(drop_date.split("-")[2]);
    var startmonth=Number(start_date.split("-")[1]);
    var dropmonth=Number(drop_date.split("-")[1])
    var startyear=Number(start_date.split("-")[0])
    var dropyear=Number(drop_date.split("-")[0]) 

    const bookingDetails=await BookingModel.find({})

    var {newdata,bookeddata}=await findAvailableCars(bookingDetails,{startdate,dropdate,startmonth,dropmonth,startyear,dropyear})

    const CarList = await CarModel.find({$and:[{car_no: { $nin: [...bookeddata, ...newdata]} },{isverified:true}]}).select({car_no: 1});

    for (let i = 0; i < CarList.length; i++)    
    {
        if(!newdata.includes(CarList[i].car_no) && !bookeddata.includes(CarList[i].car_no))
        {
            const obj = await FindListCars(newdata, bookeddata, CarList[i], {startdate, dropdate, startmonth, dropmonth, startyear, dropyear}, "RemainingCars");
            newdata=obj.newdata
        }
    }

    if(status==="BookingDetails")
    {
        var ListofCars=await CarModel.find({car_no:newdata})
        var ListofCarsWithImages = await Promise.all(
          ListofCars.map(async (car) => {
            const userDir = `uploads/${car.sid}/${car.car_no}`;
            try {
              const files = await fs.promises.readdir(userDir); 
              const imageUrls = files
                .filter((file) => file.startsWith("img"))
                .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
              const extraimageUrls = files
                .filter((file) => file.startsWith("extraImages"))
                .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);

              return { ...car._doc, imageUrls, extraimageUrls }; 
            } catch (error) {
              console.error("Error getting images for car:", car.car_no, error);
              return { ...car._doc, imageUrls: [], extraimageUrls: [] };  
            }
          })
        );
    } 
    else
    {
        var query = { car_no: { $in: newdata } };

        if (Location && Location.length > 0) {
            query.location = { $in: Location }; 
        }

        if (Model && Model.length > 0) {
            query.model = { $in: Model }; 
        }
        if(Type && Type.length>0)
        {
            query.type={$in:Type}
        }

        if (Make && Make.length > 0) {
            query.make = { $in: Make };
        } 

        if (Fuel && Fuel.length > 0) {
            query.fuel = { $in: Fuel };
        }

        if(price && price.length>0)
        {
                query.price = {
                    $gte: parseInt(price[0], 10),
                    $lte: parseInt(price[1], 10)
                };           

        }
        if(ratings)
        {
            query.ratings={
                $gte:parseInt(ratings,10)
            }
        }

        var ListofCars = await CarModel.find(query);
        var ListofCarsWithImages = await Promise.all(
          ListofCars.map(async (car) => {
            const userDir = `uploads/${car.sid}/${car.car_no}`;
            try {
              const files = await fs.promises.readdir(userDir); 
              const imageUrls = files
                .filter((file) => file.startsWith("img"))
                .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
              const extraimageUrls = files
                .filter((file) => file.startsWith("extraImages"))
                .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);

              return { ...car._doc, imageUrls, extraimageUrls }; 
            } catch (error) {
              console.error("Error getting images for car:", car.car_no, error);
              return { ...car._doc, imageUrls: [], extraimageUrls: [] };  
            }
          })
        );

    }

    if(ListofCarsWithImages.length>0) 
    {
        res.json(ListofCarsWithImages) 
    }
    else
    {
        if(status==="BookingDetails")
        {
            res.send({
                "status": "We're sorry, but there are no cars available for the selected date.",
                "message": "Please consider the following options:",
                "options": [
                  "Try a different date or time range.",
                  "Check for availability on nearby dates.",
                  "Contact our support team for assistance."
                ]
              }
              )
        }
        else
        {
           res.send({
                "status": "We're sorry, but there are no cars available for the selected date.",
                "message": "Please consider the following options:",
                "options": [ 
                  "Try a different Filters.",
                  "Check for availability on nearby dates.",
                  "Contact our support team for assistance."
                ]
              }
              )
        }
    }
})

app.get("/FiltersMetaData",async(req,res)=>{

    const FiltersMetaData=await CarMetaData.find({})
    const Locations=await CarModel.find().select({location : 1})

    const uniqueLocations = [...new Set(Locations.map(loc => loc.location))];

    const locationObjects = uniqueLocations.map((location) => ({
      value: location,  
      label: location,  
    }));

const responseMetaData = JSON.parse(JSON.stringify(FiltersMetaData)); 

if (responseMetaData.length > 0) {
    responseMetaData[0].Location = locationObjects;
} else {
    responseMetaData.push({ Location: locationObjects }); 
}

    res.send(responseMetaData)
})

app.post("/findsinglecar",async(req,res)=>{

    const {car_no}=req.body;
    const cardetails= await CarModel.findOne({car_no})

        const userDir = `uploads/${cardetails.sid}/${cardetails.car_no}`;

        try {
          const files = await fs.promises.readdir(userDir); 
          const imageUrls = files
            .filter((file) => file.startsWith("img"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
            return res.send({...cardetails._doc, imageUrls})

        } catch (error) {
          return res.send({cardetails})
        }

})

app.post("/findReviews",async(req,res)=>
{
    const {car_no}=req.body
    ReviewModel.aggregate([
        {
            $match:{
                car_no:car_no
            }
        },
        {
            $lookup:{
                from:'userdetails',
                localField:"uid",
                foreignField:"uid",
                as:"userdetails"
            }
        },
        {
            $unwind:'$userdetails'
        },
        {
            $project:{
                _id:1,
                name: '$userdetails.name', 
                car_rating:1,
                car_review:1
            }
        },
        {
            $sort:{
                car_rating:-1
            }
        }
    ])
    .then((result)=>res.send(result))
    .catch((err)=>{
        console.log(err)
     })

})

app.post("/ActiveBookings",authenticate,async(req,res)=>{

    const {uid}=req.body;
    try {
      const bookings = await BookingModel.aggregate([
          {
            $match: {
                  uid: uid
          }
        },
          {
            $lookup: {
              from: 'sellerdetails',
              localField: 'sid',
              foreignField: 'sid',
              as: 'sellerdetails',
            },
          },

          {
                $lookup: {
                    from: "cardetails",
                    localField: "car_no",
                    foreignField: "car_no",
                    as: "cardetails"
                }
        },
        {
            $unwind: "$cardetails"
        },
        {
          $unwind: "$sellerdetails",
        },
        {
          $project: {
            _id: 1,
            'bookingDetails.uid': '$$ROOT.uid',
            'bookingDetails.car_no': '$$ROOT.car_no',
            'bookingDetails.sid': '$$ROOT.sid',
            'bookingDetails.start_date': '$$ROOT.start_date',
            'bookingDetails.drop_date': '$$ROOT.drop_date',
            'bookingDetails.amount': '$$ROOT.amount',
            'sellerdetails.name': 1,
            'sellerdetails.phone': 1,
            'cardetails.name':1,
            'cardetails.img':1,
            'cardetails.fuel':1,
            'cardetails.make':1,
            'cardetails.model':1,
            'cardetails.type':1,
            'cardetails.location':1,
            'cardetails.year':1,
            'cardetails.price':1,

          },
        },
      ]);

      const bookingsWithCarImages = await Promise.all(
        bookings.map(async (booking) => {
          const car = booking.bookingDetails; 
          const userDir = `uploads/${car.sid}/${car.car_no}`;

          try {
            const files = await fs.promises.readdir(userDir); 
            const imageUrls = files
              .filter((file) => file.startsWith("img"))
              .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
            const extraimageUrls = files
              .filter((file) => file.startsWith("extraImages"))
              .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);

            return {
              ...booking,
              cardetails:{...booking.cardetails, imageUrls, extraimageUrls},  
            };
          } catch (error) {
            console.error("Error getting images for car:", car.car_no, error);
            return {
              ...booking,
              cardetails:{...booking.cardetails, imageUrls: [], extraimageUrls: []}, 
            };
          }
        })
      );
      res.send(bookingsWithCarImages);
    } catch(error) {
      console.error(error);
    }

})  

app.post("/PastBookings",authenticate,async(req,res)=>{

    const {uid}=req.body
    try {
      const bookings = await PastBookingModel.aggregate([
        {
            $match:{
                uid:uid
            }
        },
        {
          $lookup: {
            from: 'sellerdetails',
            localField: 'sid',
            foreignField: 'sid',
            as: 'sellerdetails',
          },
        },

        {
              $lookup: {
                  from: "cardetails",
                  localField: "car_no",
                  foreignField: "car_no",
                  as: "cardetails"
              }
      },
      {
          $unwind: "$cardetails"
      },
      {
          $unwind: "$sellerdetails",
        },
        {
          $project:{
              _id:1,
              'bookingDetails.sid': '$$ROOT.sid',
              'bookingDetails.car_no': '$$ROOT.car_no',
              'bookingDetails.uid': '$$ROOT.uid',
              'bookingDetails.start_date': '$$ROOT.start_date',
              'bookingDetails.drop_date': '$$ROOT.drop_date',
              'bookingDetails.amount': '$$ROOT.amount',
              'sellerdetails.name': 1,
              'sellerdetails.phone': 1,
              'cardetails.name':1,
              'cardetails.img':1,
              'cardetails.fuel':1,
              'cardetails.make':1,
              'cardetails.model':1,
              'cardetails.type':1,
              'cardetails.location':1,
              'cardetails.year':1,
              'cardetails.price':1,
          }
      }

    ]);
    const bookingsWithCarImages = await Promise.all(
      bookings.map(async (booking) => {
        const car = booking.bookingDetails; 
        const userDir = `uploads/${car.sid}/${car.car_no}`;

        try {
          const files = await fs.promises.readdir(userDir); 
          const imageUrls = files
            .filter((file) => file.startsWith("img"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
          const extraimageUrls = files
            .filter((file) => file.startsWith("extraImages"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);

          return {
            ...booking,
            cardetails:{...booking.cardetails, imageUrls, extraimageUrls},  
          };
        } catch (error) {
          console.error("Error getting images for car:", car.car_no, error);
          return {
            ...booking,
            cardetails:{...booking.cardetails, imageUrls: [], extraimageUrls: []}, 
          };
        }
      })
    );
    res.send(bookingsWithCarImages);
  } catch (errror) {
    console.error(error);
  }

})

app.post("/EndTrip",authenticate,async(req,res)=>{

    const {car_no,start_date,drop_date,uid}=req.body
    const bookingDetails=await BookingModel.findOne({car_no:car_no,start_date:start_date,drop_date:drop_date,uid:uid})
    await PastBookingModel.insertMany({sid:bookingDetails.sid,car_no:bookingDetails.car_no,uid:bookingDetails.uid,start_date:bookingDetails.start_date,drop_date:bookingDetails.drop_date,amount:bookingDetails.amount,payment_id:bookingDetails.payment_id})
    await BookingModel.deleteOne({car_no:car_no,start_date:start_date,drop_date:drop_date,uid:uid})

    const {email}=await UserModel.findOne({uid:uid}).select({email:1})

    var mailOptions = {
        from: 'balprao@gmail.com',
        to: email,
        subject: 'Thank You for Choosing Us!',
        html: `
          <div>
            <h1>Dear Customer,</h1>
            <p>We hope you had a fantastic journey with Us. Thank you for choosing us for your recent trip. Your satisfaction is our top priority, and we appreciate the trust you've placed in us.</p>

            <p>Your feedback is valuable to us, so if you have a moment, please share your thoughts about your experience. We are always looking for ways to enhance our services and ensure your future journeys are even more enjoyable.</p>

            <p>We look forward to serving you again and providing you with the same excellent service on your next adventure.</p>

            <p>Safe travels!</p>

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

app.post("/CancelTrip",authenticate,async(req,res)=>
{
    const {singlecar,Reason}=req.body
    await BookingModel.deleteOne({car_no:singlecar.car_no,start_date:singlecar.start_date,drop_date:singlecar.drop_date,uid:singlecar.uid})
    const sellerdetails=await SellerModel.findOne({sid:singlecar.sid}).select({email:1,name:1})
    const cardetails=await CarModel.findOne({car_no:singlecar.car_no}).select({name:1,make:1})

    var mailOptions = {
        from: 'balprao@gmail.com',
        to: sellerdetails.email,
        subject: 'Booking Cancellation Notification',
        html: `
        <div class="container">
        <p>Dear ${sellerdetails.name},</p>

    <p>We wanted to inform you that a booking for the car you hosted has been canceled by the user. Here are the details:</p>

    <table border>
    <tr>
        <th>Car Number</th>
        <th>Car </th>
        <th>Reason</th>
    </tr> 
    <tr>
        <td>${singlecar.car_no}</td>
        <td>${cardetails.make} ${cardetails.name} </td>
        <td>${Reason}</td>
        </tr>
    </table>

    <p>The user has canceled their reservation, and we wanted to keep you informed. If you have any questions or concerns, please don't hesitate to contact our support team.</p>

    <p>We appreciate your cooperation and understanding.</p>

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

app.put("/ExtendTrip",authenticate,async(req,res)=>
{
    const {singlecar}=req.body

    var startdate=Number(singlecar.start_date.split("-")[2]);
    var dropdate=Number(singlecar.drop_date.split("-")[2]);
    var startmonth=Number(singlecar.start_date.split("-")[1]);
    var dropmonth=Number(singlecar.drop_date.split("-")[1])
    var startyear=Number(singlecar.start_date.split("-")[0])
    var dropyear=Number(singlecar.drop_date.split("-")[0]) 

    await BookingModel.updateOne({car_no:singlecar.car_no,start_date:singlecar.start_date,uid:singlecar.uid},{$set:{drop_date:singlecar.drop_date,amount:singlecar.amount}})

    const bookingDetails=await BookingModel.find({car_no:singlecar.car_no})

    const bookeddata=await ExtendTripCars(bookingDetails,{startdate,dropdate,startmonth,dropmonth,startyear,dropyear},singlecar.uid)
    if(bookeddata.length>0)
    {
        await MissedBookingModel.insertMany({sid:bookeddata[0].sid,car_no:bookeddata[0].car_no,uid:bookeddata[0].uid,start_date:bookeddata[0].start_date,drop_date:bookeddata[0].drop_date})
        await BookingModel.deleteOne({sid:bookeddata[0].sid,car_no:bookeddata[0].car_no,uid:bookeddata[0].uid,start_date:bookeddata[0].start_date,drop_date:bookeddata[0].drop_date})
    }
    res.send({action:true})

})

app.post('/Reviews',authenticate,async(req,res)=>
{
    const {car_no,uid,car_review,overall_rating,general_review,ratings}=req.body

    await ReviewModel.insertMany({uid:uid,car_no:car_no,overall_rating:overall_rating,car_review:car_review,general_review:general_review,car_rating:ratings})

    const oldrating=await CarModel.findOne({car_no}).select({_id:0,ratings:1})
    if(oldrating.ratings==="0")
    {
        var newratings=ratings
    }   
    else
    {
        var newratings=(Number(oldrating.ratings)+Number(ratings))/2

    } 
    await CarModel.updateOne({car_no:car_no},{$set:{ratings:String(newratings)}})    

    res.send({action:true})
})

app.post("/Pay",authenticate,async(req,res)=>
{
    const {Card_number,CVV,Biller_name,expiry_date,start_date,drop_date,car_no,amount,uid,sid}=req.body

    var startdate=Number(start_date.split("-")[2]);
    var dropdate=Number(drop_date.split("-")[2]);
    var startmonth=Number(start_date.split("-")[1]);
    var dropmonth=Number(drop_date.split("-")[1])
    var startyear=Number(start_date.split("-")[0])
    var dropyear=Number(drop_date.split("-")[0]) 

    const userdetails=await UserModel.findOne({uid:uid}).select({email:1,name:1,phone:1})
    const cardetails=await CarModel.findOne({car_no:car_no})
    const sellerdetails=await SellerModel.findOne({sid:sid}).select({email:1,address:1,phone:1,name:1})

    var usermailOptions = {
        from: 'balprao@gmail.com',
        to: userdetails.email,
        subject: 'Booking Details',
        html:`
        <div class="container">
        <h1>Your Booking Details</h1>

        <table border>
        <tr>
            <th>CarNumber</th>
            <th>Car</th>
            <th>Host</th>
            <th>Address</th>
            <th>Contact No</th>
            <th>Pickup Date</th>
            <th>Return Date</th>
            <th>Total Fair</th>
        </tr>
        <tr>
            <td>${cardetails.car_no}</td>
            <td>${cardetails.make} ${cardetails.name} </td>
            <td>${sellerdetails.name}</td>
            <td>${sellerdetails.phone}</td>
            <td>${sellerdetails.address}</td>
            <td>${startdate}-${startmonth}-${startyear}</td>
            <td>${dropdate}-${dropmonth}-${dropyear}</td>
            <td>&#8377;${amount}</td>
            </tr>
        </table>

        <p>Thank you for choosing us! We look forward to serving you on your upcoming trip. If you have any questions or need further assistance, feel free to contact us.</p>

        <p>Safe travels!</p>

        <p>Best regards,<br>
        RentnRide<br>
        balprao@gmail.com<br>
        `,
    };
    var sellermailOptions = {
        from: 'balprao@gmail.com',
        to: sellerdetails.email,
        subject: 'Booking Details',
        html:`
        <div class="container">
        <h1>Your Booking Details</h1>

        <table border>
        <tr>
            <th>CarNumber</th>
            <th>Car</th>
            <th>Customer</th>
            <th>Contact No</th>
            <th>Pickup Date</th>
            <th>Return Date/th>
            <th>Total Fair</th>
        </tr>
        <tr>
            <td>${cardetails.car_no}</td>
            <td>${cardetails.make} ${cardetails.name} </td>
            <td>${userdetails.name}</td>
            <td>${userdetails.phone}</td>
            <td>${startdate}-${startmonth}-${startyear}</td>
            <td>${dropdate}-${dropmonth}-${dropyear}</td>
            <td>&#8377;${amount}</td>
            </tr>
        </table>

        <p>Thank you for choosing us! We look forward to serving you on your upcoming trip. If you have any questions or need further assistance, feel free to contact us.</p>

        <p>Safe travels!</p>

        <p>Best regards,<br>
        RentnRide<br>
        balprao@gmail.com<br>
        `,
    };

    const bookingDetails=await BookingModel.find({car_no:car_no})

    var {newdata,bookeddata}=await findAvailableCars(bookingDetails,{startdate,dropdate,startmonth,dropmonth,startyear,dropyear})
    if(bookingDetails.length===0)
    {
        if(newdata.length==0 && bookeddata.length===0)
        {
            await BookingModel.insertMany({sid:sid,uid:uid,car_no:car_no,start_date:start_date,drop_date:drop_date,amount:amount})

              transporter.sendMail(usermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              transporter.sendMail(sellermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.send({status:"Successfully booked",action:true})
        }
        else
        {
            res.send({status:"sorry booked now",action:false})

        }
    }
    else
    {
        if(!bookeddata.includes(car_no) && newdata.includes(car_no))
        {
            await BookingModel.insertMany({sid:sid,uid:uid,car_no:car_no,start_date:start_date,drop_date:drop_date,amount:amount})

              transporter.sendMail(usermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

              transporter.sendMail(sellermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.send({status:"Successfully booked",action:true})

        }
        else
        {
            res.send({status:"sorry booked now",action:false})

        }
   }
})

app.get("/Counts",authenticate,async(req,res)=>
{
        var usercount=await UserModel.count()
        var hostcount=await SellerModel.count()
        var carcount=await CarModel.count()
        var Activebookingcount=await BookingModel.count();
        var Pastbookingscount=await PastBookingModel.count();
        Activebookingcount=Activebookingcount+Pastbookingscount

        res.send({usercount,hostcount,carcount,Activebookingcount}) 
})

app.post('/findDescription',async(req,res)=>
{
    const {car_no}=req.body;
    const Description=await DescriptionModel.findOne({car_no:car_no })
    res.send(Description)
})

app.post('/findBookingsCount',authenticate,async(req,res)=>{

    const {uid}=req.body
    var pastcnt=await PastBookingModel.find({uid:uid});
    var Activebookingcount=await BookingModel.find({uid}).count()
    res.send({pastcnt,Activebookingcount})

})

  app.post('/findUserProfile',authenticate,async(req,res)=>{
    const {uid}=req.body

    const ProfileDetails=await UserModel.findOne({uid})
    let ProfileDetailsWithImages;
    const userDir = `uploads/user_images/${uid}`;
    try {
      const files = await fs.promises.readdir(userDir); 
      const imageUrls = files
        .filter((file) => file.startsWith("img"))
        .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
        ProfileDetailsWithImages = { ...ProfileDetails._doc, imageUrls}; 
    } catch (error) {
      console.error("Error getting images for car:", uid, error);
      return { ...ProfileDetails._doc, imageUrls: [] };  
    }

    res.send(ProfileDetailsWithImages)

  })

  app.post('/UpdateProfileDetails',authenticate,carUploadStorage,async(req,res)=>
  {
    const {uid,name,gender,email,phone,location,address}=req.body
    if(gender==='' && address==='')
    {
        await UserModel.updateOne({uid:uid},{$set:{
            location:location,
            phone:phone
        }})

    }
    else if(address==='')
    {
        await UserModel.updateOne({uid:uid},{$set:{
            location:location,
            phone:phone,
            gender:gender
        }})

    }
    else if(gender==='')
    {
        await UserModel.updateOne({uid:uid},{$set:{
        location:location,
        phone:phone,
        address:address
    }})

    }
    else  
    {await UserModel.updateOne({uid:uid},{$set:{
        location:location,
        phone:phone,
        gender:gender,
        address:address
    }}) 
}

    res.send({action:true})

})

app.post('/findusername',authenticate,async(req,res)=>{
    const {uid}=req.body

    const uname=await UserModel.findOne({uid:uid}).select({name:1})
    res.send(uname)
})

app.post('/FindNameandEmail',authenticate,async(req,res)=>{
    const {uid}=req.body

    const detail=await UserModel.findOne({uid:uid}).select({name:1,email:1})
    res.send(detail)
})

app.post('/ContactUs', authenticate,async (req, res) => {
  try {
      const { uid, subject, message } = req.body;
      const newMessage = new ContactMessage({ uid, subject, message });
      await newMessage.save();
      res.json({ action: true });
  } catch (error) {
      console.error("Error saving contact message:", error);
      res.status(500).json({ action: false, error: 'Failed to save message' });
  }
});

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',

  appInfo: {
    name: 'RentnRideUser',
    version: '0.0.1',
  },
});

app.post('/create-payment-intent',authenticate,async (req, res) => {

    try {
      const { amount, carDetails, bookingDetails, uid, sid } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'inr',  
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          car_no: carDetails.car_no,
          start_date: bookingDetails.start_date,
          drop_date: bookingDetails.drop_date,
          uid: uid,
          sid: sid,
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
        metadata : {
          car_no: carDetails.car_no,
          start_date: bookingDetails.start_date,
          drop_date: bookingDetails.drop_date,
          uid: uid,
          sid: sid,
        },
      });
    } catch (error) {

        console.error('Error creating PaymentIntent:', error);
        res.status(500).send({ error: 'Could not create PaymentIntent' });

    }
  });

const endpointSecret = 'whsec_188ab47e7887666a62907b8079b9204864f22e3b95e473ac0fc1298508834df4'; 

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => { 
  const sig = request.headers['stripe-signature']; 

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret); 
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      console.log('PaymentIntent was successful!',paymentIntent);

      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

app.post("/Payment",authenticate,async(req,res)=>
  {
    const { paymentIntent } = req.body; 
    const { metadata, amount} = paymentIntent; 
    const actualamount = amount/100;
    const startDate = metadata.carDetails.start_date;
    const dropDate = metadata.carDetails.drop_date;

    var startdate=Number(metadata.carDetails.start_date.split("-")[2])
    var dropdate=Number(metadata.carDetails.drop_date.split("-")[2])
    var startmonth=Number(metadata.carDetails.start_date.split("-")[1])
    var dropmonth=Number(metadata.carDetails.drop_date.split("-")[1])
    var startyear=Number(metadata.carDetails.start_date.split("-")[0])
    var dropyear=Number(metadata.carDetails.drop_date.split("-")[0]) 
    const uid = metadata.uid;
    const sid = metadata.sid;
    const car_no = metadata.carDetails.car_no;

    const paymentHistory = new PaymentHistory({
        uid: metadata.uid,
        car_no:metadata.carDetails.car_no,
        amount: actualamount, 
        currency: paymentIntent.currency,
        payment_intent_id: paymentIntent.id, 

    });

    const savedPayment = await paymentHistory.save();
    const paymentId = savedPayment._id;

      const userdetails=await UserModel.findOne({uid:uid}).select({email:1,name:1,phone:1})
      const cardetails=await CarModel.findOne({car_no:car_no})
      const sellerdetails=await SellerModel.findOne({sid:sid}).select({email:1,address:1,phone:1,name:1})

      var usermailOptions = {
          from: 'balprao@gmail.com',
          to: userdetails.email,
          subject: 'Booking Details',
          html:`
          <div class="container">
          <h1>Your Booking Details</h1>

          <table border>
          <tr>
              <th>CarNumber</th>
              <th>Car</th>
              <th>Host</th>
              <th>Contact No</th>
              <th>Pickup Date</th>
              <th>Return Date</th>
              <th>Total Fair</th>
          </tr>
          <tr>
              <td>${cardetails.car_no}</td>
              <td>${cardetails.make} </td>
              <td>${cardetails.name} </td>
              <td>${sellerdetails.phone}</td>
              <td>${startdate}-${startmonth}-${startyear}</td>
              <td>${dropdate}-${dropmonth}-${dropyear}</td>
              <td>&#8377;${actualamount}</td>
              </tr>
          </table>

          <p>Thank you for choosing us! We look forward to serving you on your upcoming trip. If you have any questions or need further assistance, feel free to contact us.</p>

          <p>Safe travels!</p>

          <p>Best regards,<br>
          RentnRide<br>
          balprao@gmail.com<br>
          `,
      };
      var sellermailOptions = {
          from: 'balprao@gmail.com',
          to: sellerdetails.email,
          subject: 'Booking Details',
          html:`
          <div class="container">
          <h1>Your Booking Details</h1>

          <table border>
          <tr>
              <th>CarNumber</th>
              <th>Car</th>
              <th>Customer</th>
              <th>Contact No</th>
              <th>Pickup Date</th>
              <th>Return Date</th>
              <th>Total Fair</th>
          </tr>
          <tr>
              <td>${cardetails.car_no}</td>
              <td>${cardetails.make} ${cardetails.name} </td>
              <td>${userdetails.name}</td>
              <td>${userdetails.phone}</td>
              <td>${startdate}-${startmonth}-${startyear}</td>
              <td>${dropdate}-${dropmonth}-${dropyear}</td>
              <td>&#8377;${actualamount}</td>
              </tr>
          </table>

          <p>Thank you for choosing us! We look forward to serving you on your upcoming trip. If you have any questions or need further assistance, feel free to contact us.</p>

          <p>Safe travels!</p>

          <p>Best regards,<br>
          RentnRide<br>
          balprao@gmail.com<br>
          `,
      };

      const bookingDetails=await BookingModel.find({car_no:car_no})

      var {newdata,bookeddata}=await findAvailableCars(bookingDetails,{startdate,dropdate,startmonth,dropmonth,startyear,dropyear})
      if(bookingDetails.length===0)
      {
          if(newdata.length==0 && bookeddata.length===0)
          {
              await BookingModel.insertMany({sid:sid,uid:uid,car_no:car_no,start_date:startDate,drop_date:dropDate,amount:actualamount,payment_id:paymentId})

                transporter.sendMail(usermailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
                transporter.sendMail(sellermailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

              res.send({status:"Successfully booked",action:true})
          }
          else
          {
              res.send({status:"sorry booked now",action:false})

          }
      }
      else
      {
          if(!bookeddata.includes(car_no) && newdata.includes(car_no))
          {
              await BookingModel.insertMany({sid:sid,uid:uid,car_no:car_no,start_date:startDate,drop_date:dropDate,amount:actualamount,payment_id:paymentId})

                transporter.sendMail(usermailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

                transporter.sendMail(sellermailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

              res.send({status:"Successfully booked",action:true})

          }
          else
          {
              res.send({status:"sorry booked now",action:false})

          }
     }
  })

  app.get('/payment-history/:uid', authenticate,async (req, res) => {
    try {
      const uid = req.params.uid;
      const paymentHistory = await PaymentHistory.find({ uid });
      res.json(paymentHistory);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      res.status(500).json({ error: "Failed to fetch payment history" });
    }
  });

  app.post('/getCarImages',async (req, res) => {
      const {sid, car_no} = req.body;
      const userDir = `uploads/${sid}/${car_no}`;
      try {
        const files = await fs.promises.readdir(userDir); 

        const imageUrls = files
        .filter((file) => file.startsWith("img"))
        .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
      const extraimageUrls = files
        .filter((file) => file.startsWith("extraImages"))
        .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
        const dataimages = imageUrls.concat(extraimageUrls);
        res.send(dataimages)
      } catch (error) {
        console.log("Error getting images for car:", car.car_no, error);
        return {};  
      }      
  });

app.post('/generate-invoice',authenticate, async(req, res) => {
    try {
        const paymentData = req.body.payment;
        const uid = paymentData.uid;

        const userData= await UserModel.findOne({uid:uid}).select({email:1,name:1,address:1})

        console.log(" User ID:", uid);

        console.log("Received User Data:", userData.email); 

        const doc = new PDFDocument({ margin: 50 }); 

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${paymentData.payment_intent_id}.pdf`);
        doc.pipe(res);

        doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown();
        doc.fontSize(12);
        doc.text(`Invoice Number: ${paymentData.payment_intent_id}`);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);

        doc.moveDown();
        doc.text("Bill to:");
        doc.text(`${userData?.name || ""}`);
        doc.text(`${userData?.address || ""}`);

        const tableData = [
            { description: 'Car Rental', quantity: 1, rate: paymentData?.amount || 0, amount: paymentData?.amount || 0 },

        ];

        generateTable(doc, tableData);

        doc.moveDown();
        doc.font('Helvetica-Bold').text(`Total:₹${paymentData?.amount || 0}`, 400, doc.y);

        doc.moveDown(50);
        doc.fontSize(10).text('Thank you for your business!', { align: 'center' });

        doc.end();
    } catch (error) { 
    }
});

function generateTable(doc, data) {
    const tableTop = doc.y;
    const itemWidth = 200;
    const quantityWidth = 50;
    const rateWidth = 70;
    const amountWidth = 70;

    doc.font('Helvetica-Bold');
    generateTableRow(
        doc,
        tableTop,
        'Description',
        'Qty',
        'Rate',
        'Amount',
        itemWidth,
        quantityWidth,
        rateWidth,
        amountWidth
    );

    doc.font('Helvetica');
    let i = 0;
    for (i = 0; i < data.length; i++) {
        const item = data[i];
        const y = tableTop + 20 + (i * 20); 
        generateTableRow(
            doc,
            y,
            item.description,
            item.quantity,
            item.rate,
            item.amount,
            itemWidth,
            quantityWidth,
            rateWidth,
            amountWidth
        );
    }

    doc.moveTo(50, tableTop + 15).lineTo(562, tableTop + 15).stroke(); 
    for (i = 0; i < data.length + 1; i++) {
        const y = tableTop + 20 + (i * 20) + 15; 
        doc.moveTo(50, y).lineTo(562, y).stroke();
    }
}

function generateTableRow(
    doc,
    y,
    description,
    quantity,
    rate,
    amount,
    itemWidth,
    quantityWidth,
    rateWidth,
    amountWidth
) {
    doc
        .fontSize(10)
        .text(description, 50, y, { width: itemWidth })
        .text(quantity, itemWidth + 50, y, { width: quantityWidth, align: 'right' })
        .text(rate, itemWidth + quantityWidth + 50, y, { width: rateWidth, align: 'right' })
        .text(amount, itemWidth + quantityWidth + rateWidth + 50, y, { width: amountWidth, align: 'right' });
}

module.exports = app;