require('dotenv').config();
require('./connection.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 9999;
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cors());

app.use('/uploadedFiles',express.static('uploadedFiles'));

// Require Routes
const userRoute = require('./routes/user.js');

// use Routes
app.use('/user',userRoute);




app.get('*', function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})
// app.get('/', (req, res)=>{
//     res.send('Hey there just starting ');
// })

app.listen(PORT, ()=>{
    console.log(`Server started on : http://localhost:${PORT}`);
})