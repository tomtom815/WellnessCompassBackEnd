require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const {logger} = require('./backend/middleware/logger');
const errorHandler = require('./backend/middleware/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./backend/middleware/credentials');
const cors = require('cors');
const corsOptions = require('./backend/config/corsOptions');

const mongoose = require('mongoose');
const connectDB = require('./backend/config/dbConn');
const { logEvents } = require('./backend/middleware/logger');

const verifyJWT = require('./backend/middleware/verifyJWT');
const { verify } = require('crypto');

const PORT = process.env.PORT || 3500;
console.log(process.env.NODE_ENV)



app.use(logger);
/*app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
);*/

//connect to mongodb
connectDB();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./backend/routes/root'));
app.use('/auth', require('./backend/routes/auth'));
app.use('/refresh', require('./backend/routes/refresh'));
app.use('/logout', require('./backend/routes/logout'));

app.use('/users', require('./backend/routes/userRoutes'));


app.all('*', (req, res) => {
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  }else if(req.accepts('json')){
    res.json({ error: '404 Not Found'})
  }else{
    res.type('txt').send('404 Not Found')
  }
})


app.use(errorHandler);
mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on('error', err =>{
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})