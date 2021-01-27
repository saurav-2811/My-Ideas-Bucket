const localStrategy= require('passport-local')
.Strategy;
const passport= require('passport')
const mongoose =require('mongoose');
const bcrypt=require('bcryptjs');
//load user model
require('../models/User')
const User=mongoose.model('user');
module.exports=function (passport){
    passport.use(new localStrategy({usernameField:'email'}, (email,password,done)=>{
        User.findOne({email:email})
        .then((user)=>{
            if(!user){
             return done(null,false,{message:"user not found"})
            }
           bcrypt.compare(password,user.password,(err,isMatch) =>{
             if(err)throw err;
             if(isMatch){
               return done(null,user)
             }
             else{
              return done(null,false,{message:"password not matched"})
             }
           })
        })
    }
    ))
    passport.serializeUser((user, done) => {
        return done(null, user.id);
      })
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          return done(err, user);
        })
      })
}