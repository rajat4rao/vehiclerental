const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');
require('dotenv').config();
const allowedOrigins = [process.env.ADMIN_URL, process.env.HOST_URL,process.env.USER_URL];



const DATABASE_URL = process.env.DATABASE_URL;
const app = express();
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
  }))
app.use(express.json());
app.use(cookieParser()); 
app.use('/uploads', express.static('uploads'));

const hostRoutes = require('./routes/host'); 
const userRoutes = require('./routes/user'); 
const adminRoutes = require('./routes/admin'); 

mongoose.connect(DATABASE_URL)
    .then(() => {
        app.listen(8000, () => {
            console.log("Server connected");
            console.log("Running at 8000"); 
        });
    })
    .catch((err) => {  
        console.error("Database connection error:", err);
    });

app.use('/host', hostRoutes); 
app.use('/user', userRoutes); 
app.use('/admin', adminRoutes); 