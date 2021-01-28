 module.exports={ 
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please! login to use My Ideas-Bucket')
        res.redirect('/user/login')
    },
    ensureAuthenticatedlogin: function(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        res.redirect('/ideas')
    },
    
}