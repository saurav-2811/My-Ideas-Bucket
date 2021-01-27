const express = require('express')
const methodOverride = require('method-override')
const exphbs=require('express-handlebars')
const mongoose=require('mongoose')
const bcrypt= require('bcryptjs')
const passport= require('passport')
const bodyParser=require('body-parser')
const session = require('express-session')
const flash = require('connect-flash');
const app = express()
//ideas route
const ideas =require('./route/ideas');
//local stratgy
require('./config/passport')(passport);
//user routes
const user =require('./route/user');
// override with POST having ?_method=editone
app.use(methodOverride('_method'));
//express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))
  app.use(passport.initialize());
app.use(passport.session());
  //flashconnect
  app.use(flash());
  app.use(function(req,res,next){
      res.locals.success_msg=req.flash('success_msg');
      res.locals.error_msg=req.flash('error_msg');
      res.locals.error=req.flash('error');
      res.locals.user=req.user || null  
      next();
    });
    //loading contact model
  require('./models/Contact')
  const Contact=mongoose.model('contact');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//map.promise to get rid of warning
mongoose.Promise=global.Promise;
//connecting mongoose
mongoose.connect('mongodb+srv://saurav2811:saurav2811@ss2811.3d7eq.mongodb.net/Mydairy-dev?retryWrites=true&w=majority', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log(`mongodb connected....`);
})
.catch(err =>console.log(err));

//handle bars
app.engine('handlebars',exphbs({
    defaultLayout: 'main'
}));
app.set('view engine','handlebars');

//making routes 
app.get('/',(req,res) =>{
    res.redirect('/ideas')
});
//making about route
app.get('/about',(req,res) =>{
    res.render('about');
});
//contact route
app.get('/contact',(reg,res) =>{
    res.render('contact')
});
//post routefor contact
app.post('/contact',(req,res)=>{
    console.log("ok")
    const newContact={
    email:req.body.email,
    message:req.body.message,
    date:req.body.date,
    }
    new Contact(newContact)
    .save()
    .then(contact=>{
        console.log(req.body)
        res.send(`We got your message........We will contact you soon on Your Email-id (${req.body.email})....`)
    });
});
//use ideas route
app.use('/ideas',ideas)
//use user route
app.use('/user',user)
const port = process.env.PORT || 5000;
app.listen(port,() =>{
    console.log(`our server is starting at port ${port}`);
}); 