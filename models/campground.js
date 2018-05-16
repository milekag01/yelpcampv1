var mongoose=require("mongoose");

var campSchema=new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Camp=mongoose.model("Camp",campSchema);

module.exports=Camp;