const mongoose = require('mongoose');

mongoose.connect(process.env.DB)
    .then(()=>{
        console.log(`Connection established with DB: ${process.env.DB.split('.net/')[1].split('?')[0]}`);
    })
    .catch(error => {
        console.log(`Connection failed - Error Code: ${error.code}`);
    })

