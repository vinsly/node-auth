const express = require('express');
const app = express();
const port = 80;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth'); //import route
const homeRoute = require('./routes/home');
dotenv.config();
//connect to DB
mongoose.connect(process.env.DB_CONNECT, 
    { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
    },
    ()=>{
      console.log('connected to db');
      console.log('mongoose readyState:',mongoose.connection.readyState);
    }
);

mongoose.connection
  .once('open', ()=>{
    console.log('mongoose connection successfull');
  })
  .on('error', (err)=>{
    console.log('mongoose error', err);
  });

//Middleware
app.use(express.json());

//route middleware
app.use('/api/user', authRoute);
app.use('/home', homeRoute);

app.listen(port, ()=>console.log(`server runing on port ${port}`));