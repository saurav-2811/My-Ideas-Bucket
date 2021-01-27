const express =require('express');
const mongoose = require('mongoose');
const passport =require('passport');
const bcrypt=require('bcryptjs');
const router =express.Router();
//loadmodel
require('../models/User')
const User=mongoose.model('user');
//login route
router.get('/login',(req,res) =>{
    console.log('login')
    res.render('user/login');
});
//login post
router.post('/login' ,(req,res,next) =>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/user/login',
        failureFlash:true,
    })(req,res,next)
});
router.get('/register',(req,res)=>{
    console.log('register')
    res.render('user/register')
});
router.post('/register' ,(req,res) =>{
        let errors = [];
        if(req.body.password!=req.body.password2){
        errors.push({
            text:"password not matched"
        });
    }
        if( req.body.password.length<4){
        errors.push({
            text:"please keep length at 4 of you password"
        });
    }
        if(errors.length>0){
            res.render('user/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
            });
            }
            else{
             const newUser={
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                password2:req.body.password2
             }
             bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash) =>{
                    if(err) throw err;
                    newUser.password=hash;
                    new User(newUser).save()
                    .then(user =>{
                        if(req.params.email!=req.body.email){
                        req.flash('success_msg','you has been register successfully');
                        res.redirect('/user/login');
                        }
                        else{
                            req.flash('error_msg','email has been already used');
                        };
                    });
                });
             });
        };
});
router.get('/logout',(req,res) =>{
  req.logOut();
  req.flash('success_msg','You are logout!')
  res.redirect('/user/login');
});
module.exports=router;