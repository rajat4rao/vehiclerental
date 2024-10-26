const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
const app = express();
app.use(cors());
app.use(express.json());

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