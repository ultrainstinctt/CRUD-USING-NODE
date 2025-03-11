const express =require('express');
const { model } = require('mongoose');
const router= express.Router();
const user =require('../models/users');
const multer=require('multer');
const users = require('../models/users');
const fs=require('fs');

//image upload
 var storage = multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);

    },
 });

 var upload=multer({
    storage:storage,
 }).single('image');
 
 
 //insert user to db route

 //chatgpt
 router.post('/add', upload, async (req, res) => {
    try {
        const newUser = new user({   
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,  // Use `req.file.filename` for uploaded image
        });

        await newUser.save();  // Save the user and wait for the operation to complete

        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect("/");
        

    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// router.get("/",(req,res)=>{
//     res.send("home page");

// });

//get all user 
// Assuming this is in your GET route for displaying users
router.get("/", async (req, res) => {
    try {
        const usersData = await user.find().lean(); // Use lean() to get plain JS objects
        res.render('index', { title: 'homepage', users: usersData });
    } catch (err) {
        console.error(err);
        res.render('index', { title: 'homepage', users: [] }); // Pass an empty array in case of error
    }
});



//edit
router.get('/edit/:id', async (req, res) => {
    try {
        const userData = await user.findById(req.params.id).lean(); // Use lean() for plain JS object
        if (userData) {
            res.render('edit_users', { user: userData });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});
//update
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        await user.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });
        
        req.session.message = {
            type: 'success',
            message: 'User updated successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//delete
// Delete User Route
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await user.findByIdAndDelete(id);
        
        if (result && result.image) {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log('Error deleting image:', err);
            }
        }

        req.session.message = {
            type: 'info',
            message: 'User deleted successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});



router.get("/add",(req,res)=>{
    res.render('add_users',{title:'AddUser'});

});

router.get("/user",(req,res)=>{
    res.send("all users");

});
module.exports=router;