const mongoose = require('mongoose')
const schema =mongoose.Schema;
const ContactSchema = new schema({
    email:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
});
mongoose.model('contact',ContactSchema);