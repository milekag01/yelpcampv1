var mongoose=require("mongoose");
var Comment=require("./models/comment");
var Campground=require("./models/campground");


var data=[
    {
        name:"Tsomoriri Camp – Ladakh",
        image:"https://www.holidify.com/blog/wp-content/uploads/2016/08/Tsomoriri.jpg",
        description:"Tsomoriri Lake is the highest lake in the world and located in Ladakh."
    },
    {
        name:"Tsomoriri Camp – Ladakh",
        image:"https://www.holidify.com/blog/wp-content/uploads/2016/08/west-ladakh-camp.jpg",
        description:"Tsomoriri Lake is the highest lake in the world and located in Ladakh."
    },
    {
        name:"Tsomoriri Camp – Ladakh",
        image:"https://www.holidify.com/blog/wp-content/uploads/2016/08/camp-exotica.jpg",
        description:"Tsomoriri Lake is the highest lake in the world and located in Ladakh."
    }
];
var comment=
    {
        text:"this is a great place, but I wish there was internet",
        author:"Milek"
    };

function seedDB()
{
    //remove all campgrounds
    Campground.remove({},function(err){
    if(err)
        console.log(err);
    else
    {
        console.log("removed campground");
        //adding campgrounds
        // data.forEach(function(seed){
        //     Campground.create(seed,function(err,campground){
        //         if(err)
        //             console.log(err);
        //         else
        //         {
        //             console.log("added campground");
        //             Comment.create(comment,function(err,comment){
        //                 if(err)
        //                     console.log(err);
        //                 else
        //                 {
        //                     campground.comments.push(comment);
        //                     campground.save();
        //                     console.log("Comment added");
        //                 }
        //             });
        //         }
                    
        //     });
        // });
    }
});
}
module.exports=seedDB;
