const express =require('express');
const mongoose = require('mongoose');
const router =express.Router();
const {ensureAuthenticated}= require('../helpers/auth');
//loadmodel
require('../models/Idea')
const Idea=mongoose.model('ideas');


router.get('/', ensureAuthenticated, (req,res) =>{
    Idea.find({user:req.user.id}).lean()
    .sort({
        date:'desc'
    })
    .then(ideas =>{
        res.render('./ideas/idea',{
            ideas:ideas
        })
    })
});
router.post('/', ensureAuthenticated, (req,res) =>{
    const newUser={
        title:req.body.title,
        Details:req.body.Details,
        date:req.body.date,
        user:req.user.id
    }
    new Idea(newUser)
    .save()
    .then(idea=>{
        req.flash('success_msg','idea has been added to your ideas section')
        res.redirect('/ideas');
    })
});
router.get('/add', ensureAuthenticated, (req,res) =>{
    res.render('ideas/add')
});
//edit route
router.get('/edit/:id', ensureAuthenticated, (req,res) =>{
    Idea.findOne({
        _id:req.params.id
        }).lean()
        .then(ideas =>{
            res.render('ideas/edit',{
                ideas
            });
        });
    });
    //put route for edit
    router.put('/:id', ensureAuthenticated, (req,res) =>{
        Idea.findOne({
            //geting current id
            _id:req.params.id,
        })
        .then(ideas =>{
            //changing values
            ideas.title=req.body.title;
            ideas.Details=req.body.Details;
            ideas.save()
            .then(ideas =>{
                req.flash('success_msg','your idea has been updated')
                res.redirect('/ideas')
            })
        })
        //     .then(ideas =>{
        //         res.redirect('/ideas')

        // });
    });

//delete routes
router.delete('/:id', ensureAuthenticated, (req,res) =>{
    Idea.deleteOne({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','idea has been deleted successfully');
        res.redirect('/ideas');
    });
});
module.exports =router;
