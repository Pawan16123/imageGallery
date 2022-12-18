const userCollection = require('../models/user.js');

exports.profilePage = (req, res)=>{
    res.status(200).send('Just testing in Progress');
}

exports.createUser = (req, res)=>{
    let fileUrl = req.file.path.replace(/\\/g, "/")
    let newUser = new userCollection({...req.body, profileImage: fileUrl });
    console.log('This is new USER',newUser);
    newUser.save((err, user)=>{
        if(err){
            console.log(err);
            res.status(400).send({
                error:'Unable to store the user in db.',
                message: req.errorS
            })
        }else{
            console.log('user created');
            res.status(201).send({
                status: 'success',
                message: `${user.name} details are saved successfully`
            });
        }

    })
}

exports.getAllUsers = (req, res)=>{
    userCollection.find({},(err, users)=>{
        if(err){
            res.status(400).send({
                error: 'No users found'
            })
        }else{
            res.status(200).send({
                status:'success',
                users
            })
        }
    })
}

exports.multerLogic = ()=>{
    const multer = require('multer');
    const storageConfig = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploadedFiles/')
        },
        filename: function(req, file, cb){
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    });
    const filterFile = (req, file, cb)=>{
        if(['image/png','image/jpeg'].includes(file.mimetype)){
            cb(null, true);
        }
        // cb(new Error('goes wrong on the mimetype'));
        req.errorS = 'File type is not image/jpeg'
        cb(null, false);
    }
    return multer({
        storage: storageConfig,  
        limits : {
            fileSize: 1024 * 1024 * 1
        },
        fileFilter: filterFile
    });
}


exports.getUser = (req, res, next)=>{
    const { userId } = req.params;
    console.log('Id received:', userId);
    userCollection.findById({"_id": userId}).exec((err, userfound)=>{
        console.log('USER FROM DB:',userfound);
        if(!err && !userfound){
            return res.send({
                error:'NO user found in db'
            })
        }

            req.user = userfound;
            next();
            // userfound.createdAt = undefined;
            // userfound._id = undefined;
            // userfound.updatedAt = undefined;
            // res.send({
            //     message: `User : ${deletedUser.name} deleted successfully`,
            //     user: userfound
            // })
    })
}

exports.deleteUser = (req, res)=>{
    // console.log('Received this user: ',req.user)
    // const { userId } = req.params;
    // console.log('Id received:', userId);
    // userCollection.findById({"_id": userId}).exec((err, userfound)=>{
    //     console.log('USER FROM DB:',userfound);
    //     if(!err && !userfound){
    //         return res.send({
    //             error:'NO user found in db'
    //         })
    //     }
    if(req.user){
        req.user.remove((error, deletedUser)=>{
            if(error || !deletedUser){
               return res.send({
                    error:'NO user found in db'
                })
            }
            res.send({
                status: 'success',
                message: 'User deleted successfully'
            })
            // userfound.createdAt = undefined;
            // userfound._id = undefined;
            // userfound.updatedAt = undefined;
            // res.send({
            //     message: `User : ${deletedUser.name} deleted successfully`,
            //     user: userfound
            // })
        })

    }
    
}

exports.updateUser = (req, res)=>{
    let user = req.user;
    console.log('what if form is submitted',req.body);
    const {name, email, phone} = req.body;
    if(name || email || phone){
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        console.log('UPdated User', user);
    }
    user.save((err, savedUser)=>{
        if(err){
            return res.status(401).send({
                status: 'failed',
                message: 'unable to update the user'
            })
        }
        res.send({
            status: 'success',
            savedUser
        })
    })
}