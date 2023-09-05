require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require ('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500;


app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
);

//connect to mongodb
connectDB();


app.use(express.urlencoded({extended:false}));
app.use(express.json());



app.all('*', (req, res)=> {
    res.status(404);
    if(req.accepts('html'))
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    else if(req.accepts('json'))
        res.json({"error" : "404 Not Found"})
});


mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})