const mongoose = require ('mongoose')
const Schema = mongoose.Schema;
const IdeaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    Details:{
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
mongoose.model('ideas',IdeaSchema);
