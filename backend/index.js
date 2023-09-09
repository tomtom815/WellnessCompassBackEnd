require('dotenv').config();


const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500;





//connect to mongodb
connectDB();


const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });
  
mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})