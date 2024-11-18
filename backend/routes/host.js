const express = require('express');
const app = express.Router();

const firebase = require('../firebase');
const { getAuth } = require('firebase-admin/auth');
const { async } = require('@firebase/util');
const auth = getAuth(firebase);
const bcrypt = require('bcrypt')
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const multer = require("multer");
const { start } = require('repl');
const fs = require("fs");
const path = require("path");

const util = require('util');  
const rmdirAsync = util.promisify(fs.rm);
const unlinkAsync = util.promisify(fs.unlink);
app.use(express.urlencoded({ extended: true })); 

require('dotenv').config();

const {CarModel} =require("../Models/CarModel")
const {SellerModel} = require('../Models/SellerModel')
const {BookingModel}=require("../Models/BookingModel")
const {PastBookingModel}=require("../Models/PastBookingModel");
const { CarMetaData } = require('../Models/CarMetaData');
const { ReviewModel } = require('../Models/ReviewModel');
const {UserModel}=require('../Models/UserModel')
const {DescriptionModel}=require('../Models/CarDescription')
const authenticateold = require('../middleware/authenticate'); 
const authenticate = require('../middleware/authenticatejwt');
const carUploadStorage = require('../middleware/multer'); 

const xlsx=require('xlsx');
const {transporter}=require('../Mailer/Mail')

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
      const sellerDetails=await SellerModel.find({phone})
      if(sellerDetails.length>0)
      {
        res.send({status:"The phone number you entered is already registered",action:false})
      }
      else
      {
        const { salt, hash } = await hashPassword(password);

        const sid = generateRandomAlphanumericSecure(30);
        await SellerModel.insertMany({sid:String(sid),name:name.charAt(0).toUpperCase()+name.slice(1),email:email,password:hash,salt:salt,phone:phone,location:location.charAt(0).toUpperCase()+location.slice(1),gender:'',address:''})
        res.send({status:"Profile Created Successfully",action:true})  
      }
      }
    catch(err)
    {
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
    const user=await SellerModel.findOne({email:email}).select({password:1,email:1,sid:1})
    if (!user) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }
    const passwordMatches = await checkPassword(password, user.password);

    if (passwordMatches) {
        const payload = { sid: user.sid, email: user.email, host:true };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('jwt', token, { 
          httpOnly: true,  
          maxAge: 360000000, 
          sameSite: 'none',  
          secure: true 
      });

        const response = {sid: user.sid}
        res.json(response);
    } else {
        res.status(401).json({ error: 'Invalid Credentials'});
    }
  });

  app.get('/check-auth-status', authenticate, (req, res) => {  
    if(req.user.host){
      res.json({ isAuthenticated: true, user: req.user });  
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  });

app.post("/findUser",authenticate,async(req,res)=>{
    const {sid}=req.body
    try
    {
      const response=await SellerModel.findOne({sid})
      res.json(response)
    }
    catch(err)
    {
      console.log("Invalid Email")
    }
})

app.post("/AddCars",authenticate,carUploadStorage,async(req,res)=>
{

    const { sid,car_no,img,name,year,fuel,make,model,type,price,location,desc}=req.body
    const data=await CarModel.find({car_no})
    if(data.length>0)
    {
      const userDir = `uploads/${sid}/${car_no}`;
        try {
          const uploadedFilenames = req.uploadedFilenames;
          if (uploadedFilenames && uploadedFilenames.length > 0) {
            await Promise.all(
                uploadedFilenames.map(async (filename) => {
                    const filePath = path.join(userDir, filename);
                    try {
                        await unlinkAsync(filePath);
                        console.log("File deleted successfully:", filePath);
                    } catch (fileDeleteError) {
                        console.error("Error deleting file:", filePath, fileDeleteError);

                    }
                })
            );
          }
        } catch (deleteError) {
          console.error("Error deleting directory and files:", deleteError);

        }
      res.send({status:"Car already registered",action:false})
    }
    else
    {
      await CarModel.insertMany({sid:sid,car_no:car_no,img:"none",name:name.charAt(0).toUpperCase()+name.slice(1),year:year,fuel:fuel,make:make.charAt(0).toUpperCase()+make.slice(1),model:model.charAt(0).toUpperCase()+model.slice(1),type:type.charAt(0).toUpperCase()+type.slice(1),price:price,ratings:"0",location:location.charAt(0).toUpperCase()+location.slice(1),list_start:"--",list_drop:"--",isverified:false})
      await DescriptionModel.insertMany({car_no:car_no,description:desc})
      res.send({status:"Successfully registered",action:true})
    }
})

app.post("/VerifiedCars", authenticate, async (req, res) => {
  const { sid } = req.body;

  try {
    const result = await CarModel.aggregate([
      {
        $match: {
          $and: [{ sid: sid }, { isverified: true }],
        },
      },
    ]);

    const carsWithImages = await Promise.all(
      result.map(async (car) => {
        const userDir = `uploads/${car.sid}/${car.car_no}`;
        try {
          const files = await fs.promises.readdir(userDir); 
          const imageUrls = files
            .filter((file) => file.startsWith("img"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
          const extraimageUrls = files
            .filter((file) => file.startsWith("extraImages"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
          return { ...car, imageUrls, extraimageUrls }; 
        } catch (error) {
          console.error("Error getting images for car:", car.car_no, error);
          return { ...car, imageUrls: [], extraimageUrls: [] };  
        }
      })
    );

    res.send(carsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
});

app.post("/UnVerifiedCars", authenticate, async (req, res) => {
  const { sid } = req.body;

  try {
    const cars = await CarModel.aggregate([
      {
        $match: {
          $and: [
            { sid: sid },
            { isverified: false },
          ],
        },
      },
    ]);

    const carsWithImages = await Promise.all(
      cars.map(async (car) => {
        const userDir = `uploads/${car.sid}/${car.car_no}`;
        try {
          const files = fs.readdirSync(userDir);
          const imageUrls = files
            .filter((file) => file.startsWith("img"))
            .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
          const extraimageUrls = files
          .filter((file) => file.startsWith("extraImages"))
          .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);  
          return { ...car, imageUrls, extraimageUrls };
        } catch (error) {
          console.error("Error getting images for car:", car.car_no, error);
          return { ...car, imageUrls: [] }; 
        }
      })
    );

    res.send(carsWithImages);
  } catch (error) {
    console.error("Error fetching unverified cars:", error);
    res.status(500).send({ error: "Failed to fetch cars" });
  }
});

app.put("/EditCarDetails",authenticate,async(req,res)=>{
    const {car_no,price,location,list_start,list_drop}=req.body
    const bookingDetails=await BookingModel.find({car_no})
    if(bookingDetails.length>0)
    {
      res.send({status:"The car is booked out and cannot edit now.",action:false})
    }
    else
    {
      await CarModel.updateOne({car_no:car_no},
        {$set:{
            price:price,
            location:location,
            list_start:list_start,
            list_drop:list_drop,
        }})
res.send({action:true})
    }
})

app.delete("/DeleteCarDetail",authenticate,async(req,res)=>{
const {car_no}=req.body;
const bookingDetails=await BookingModel.find({car_no})
if(bookingDetails.length>0)
{
  res.send({status:"The car is reserved and cannot be removed at this time",action:false})
}
else
{
  await CarModel.deleteOne({car_no:car_no})
  res.send({status:"Success",action:true})
}
}) 

app.post("/ActiveBookings",authenticate,async(req,res)=>{
  const {sid}=req.body;
  try {
  const bookings = await BookingModel.aggregate([
  {
    $match: {
    sid: sid
    }
  },
  {
    $lookup: {
      from: 'userdetails',
      localField: 'uid',
      foreignField: 'uid',
      as: 'userdetails',
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
    $unwind: "$userdetails",
  },
  {
    $project: {
      _id: 1,
      'bookingDetails.sid': '$$ROOT.sid',
      'bookingDetails.uid': '$$ROOT.uid',
      'bookingDetails.car_no': '$$ROOT.car_no',
      'bookingDetails.sid': '$$ROOT.sid',
      'bookingDetails.start_date': '$$ROOT.start_date',
      'bookingDetails.drop_date': '$$ROOT.drop_date',
      'bookingDetails.amount': '$$ROOT.amount',
      'userdetails.name': 1,
      'userdetails.phone': 1,
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
  ]).exec();
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
  const {sid}=req.body;
  try {
  const bookings = await PastBookingModel.aggregate([
  {
    $match: {
    sid: sid
    }
  },
  {
    $lookup: {
      from: 'userdetails',
      localField: 'uid',
      foreignField: 'uid',
      as: 'userdetails',
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
    $unwind: "$userdetails",
  },
  {
    $project: {
      _id: 1,
      'bookingDetails.sid': '$$ROOT.sid',
      'bookingDetails.uid': '$$ROOT.uid',
      'bookingDetails.car_no': '$$ROOT.car_no',
      'bookingDetails.sid': '$$ROOT.sid',
      'bookingDetails.start_date': '$$ROOT.start_date',
      'bookingDetails.drop_date': '$$ROOT.drop_date',
      'bookingDetails.amount': '$$ROOT.amount',
      'userdetails.name': 1,
      'userdetails.phone': 1,
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

app.get("/InputDetails",authenticate,async(req,res)=>{
  const data=await CarMetaData.find({})
  res.json(data[0])

})

app.post('/BookingList',authenticate,async(req,res)=>
{
    const {sid}=req.body
    const ActiveBookings=await BookingModel.aggregate([
      {
        $match:{
          sid:sid
        }
      },
      {
        $lookup:
        {
          from:'userdetails',
          localField:'uid',
          foreignField:'uid',
          as:'userdetails'
        },
      },
      {
        $lookup:
        {
          from:'cardetails',
          localField:'car_no',
          foreignField:'car_no',
          as:'cardetails'
        }, 
      },
      {
        $unwind: "$cardetails"
    },
    {
        $unwind: "$userdetails",
      },
      {
        $project: {
          _id: 1,
          'bookingDetails.car_no': '$$ROOT.car_no',
          'bookingDetails.start_date': '$$ROOT.start_date',
          'bookingDetails.drop_date': '$$ROOT.drop_date',
          'bookingDetails.amount': '$$ROOT.amount',
          'userdetails.name': 1,
          'userdetails.phone': 1,
          'cardetails.ratings':1,
        },
      },
    ])

    const PastBookings=await PastBookingModel.aggregate([
      {
        $match:{
          sid:sid
        }
      },
      {
        $lookup:
        {
          from:'userdetails',
          localField:'uid',
          foreignField:'uid',
          as:'userdetails'
        },
      },
      {
        $lookup:
        {
          from:'cardetails',
          localField:'car_no',
          foreignField:'car_no',
          as:'cardetails'
        }, 
      },
      {
        $unwind: "$cardetails"
    },
    {
        $unwind: "$userdetails",
      },
      {
        $project: {
          _id: 1,
          'bookingDetails.car_no': '$$ROOT.car_no',
          'bookingDetails.start_date': '$$ROOT.start_date',
          'bookingDetails.drop_date': '$$ROOT.drop_date',
          'bookingDetails.amount': '$$ROOT.amount',
          'userdetails.name': 1,
          'userdetails.phone': 1,
          'cardetails.ratings':1,
        },
      },
    ])
    const TotalBookings=[...ActiveBookings,...PastBookings]
    res.send(TotalBookings) 
})

app.post('/UserCarsCount',authenticate,async(req,res)=>
{
  const {sid}=req.body
  const carcount=await CarModel.find({sid:sid}).count()
  const verifycarcount=await CarModel.find({sid:sid,isverified:true}).count()   

  const Pastsum = await PastBookingModel.aggregate([
    {
      $match:
      {
        sid:sid
      }
    },
    {
      $group: {
        _id: null,
        sum_val: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0,  
              onNull: 0   
            }
          }
        }
      }
    }
  ]);
  const Activesum = await BookingModel.aggregate([
    {
      $match:
      {
        sid:sid
      }
    },
    {
      $group: {
        _id: null,
        sum_val: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0, 
              onNull: 0   
            }
          }
        }
      }
    }
  ]);

  const ActiveCars=await BookingModel.find({sid:sid}).select({start_date:1,drop_date:1})
  var activeSumValue = Activesum[0] && Activesum[0].sum_val !== undefined ? Number(Activesum[0].sum_val) : 0;
  var pastSumValue = Pastsum[0] && Pastsum[0].sum_val !== undefined ? Number(Pastsum[0].sum_val) : 0;

  var TotalSum = activeSumValue + pastSumValue;

  res.send({carcount:carcount,verifycarcount:verifycarcount,TotalSum:TotalSum,ActiveCars:ActiveCars.length})

})

app.post('/CancelTrip',authenticate,async(req,res)=>
{
    const {sid,uid,car_no,start_date,drop_date,amount}=req.body
    const data=await BookingModel.deleteOne({sid:sid,uid:uid,car_no:car_no,start_date:start_date,drop_date:drop_date,amount:amount})
    const userdetails=await UserModel.findOne({uid:uid}).select({email:1,name:1})
    var mailOptions = {
      from: 'balprao@gmail.com',
      to: userdetails.email,
      subject: 'Booking Cancellation Notification',
      html: `
      <div class="container">
      <p>Dear ${userdetails.name},</p>

      <p>We wanted to inform you that a booking for the car you reserved has been canceled by the host. Here are the details:</p>

      <p>The host has canceled your reservation, and we wanted to keep you informed. If you have any questions or concerns, please don't hesitate to contact our support team.</p>

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

    if(data===null || data===undefined)
    {
      res.send({status:'Something went Wrong! Try again later',action:false})
    }
    else
    {
      res.send({status:'The Customer Trip has been cancelled',action:true})
    }

})

app.post('/FindNameandEmail',async(req,res)=>{
  const {sid}=req.body
  const detail=await SellerModel.findOne({sid:sid}).select({name:1,email:1})
  res.send(detail)
})

app.post('/ContactUs',authenticate,async(req,res)=>
{   
    const {sid,Message}=req.body
    const {email}=await SellerModel.findOne({sid:sid}).select({email:1})

    var mailOptions = {
        from: email,
        to:'balprao@gmail.com' ,
        subject: 'Priority Support Request',
        text:Message
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

  app.post('/findUserProfile',authenticate,async(req,res)=>{
    const {sid}=req.body
    const ProfileDetails=await SellerModel.findOne({sid})
    let ProfileDetailsWithImages;
    const userDir = `uploads/images/${sid}`;
    try {
      const files = await fs.promises.readdir(userDir); 
      const imageUrls = files
        .filter((file) => file.startsWith("img"))
        .map((file) => `${process.env.BASE_URL}/${userDir}/${file}`);
        ProfileDetailsWithImages = { ...ProfileDetails._doc, imageUrls}; 
        res.send(ProfileDetailsWithImages)
    } catch (error) {
      ProfileDetailsWithImages = { ...ProfileDetails._doc, imageUrls: [] };  

    res.send(ProfileDetailsWithImages)
  }})

  app.post('/UpdateProfileDetails',authenticate,carUploadStorage,async(req,res)=>
  {
    const {sid,name,gender,email,phone,location,address}=req.body
    if(gender==='' && address==='')
    {
        await SellerModel.updateOne({sid:sid},{$set:{
            location:location,
            phone:phone
        }})

    }
    else if(address==='')
    {
        await SellerModel.updateOne({sid:sid},{$set:{
            location:location,
            phone:phone,
            gender:gender
        }})

    }
    else if(gender==='')
    {
        await SellerModel.updateOne({sid:sid},{$set:{
        location:location,
        phone:phone,
        address:address
    }})

    }
    else  
    {await SellerModel.updateOne({sid:sid},{$set:{
        location:location,
        phone:phone,
        gender:gender,
        address:address
    }}) 
}
  res.send({action:true})
})

app.post('/forgotPassword',async(req,res)=>
  {
      try {
        const {token,Password}=req.body
        const decodedUid = Buffer.from(token, 'base64').toString('utf8');
        const { salt, hash } = await hashPassword(Password);
        await SellerModel.updateOne({sid:decodedUid},{$set:{password:hash, salt:salt}})
        res.send({action:true})
      } catch (error) {
        console.log(error)
        res.send({action:false})
      }
  })

  app.post("/sendPasswordReset",async(req,res)=>{

    const {email}=req.body
    const {sid}=await SellerModel.findOne({email:email}).select({sid:1});

    const encodedUid = Buffer.from(sid).toString('base64')
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
            ${process.env.HOST_URL}/forgotPassword?token=${encodedUid},

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

app.post('/findReviews',authenticate,async(req,res)=>
{
  const {car_no}=req.body
  const reviews=await ReviewModel.find({car_no:car_no}).select({_id:1,car_review:1,car_rating:1})
  if(reviews.length>0)
  {
    res.send({reviews,action:true})
  }
  else
  {
    res.send({action:false})
  }
})

app.post('/BookingsPerMonth',authenticate,async(req,res)=>
{
  const {sid}=req.body
  const ActiveBookings=await BookingModel.find({sid:sid}).select({_id:1,start_date:1,drop_date:1,amount:1})
  const PastBooking=await PastBookingModel.find({sid:sid}).count()
  res.send({PastBooking,ActiveBookings})
})

module.exports = app;