var express=require("express");
var router=express.Router();
var Camp=require("../models/campground");
var middleware=require("../middlewares/middleware.js");
//google maps
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//google maps

router.get("/",function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        Camp.find({name: regex},function(err,newcamp){
            if(newcamp.length<1 || newcamp==null || newcamp.length==null){
                req.flash("error","No result available");
                res.redirect("/campground");
            }
            else if(err)
                req.flash("error","Opps something went wrong");
            else{
                res.render("campgrounds/index",{camp: newcamp}); 
            }
        });
    }
    else{
        Camp.find({},function(err,newcamp){
            if(err)
                req.flash("error","Opps something went wrong");
            else{
                res.render("campgrounds/index",{camp: newcamp});        
            }
        });
    }
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    //google maps
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    //google maps
    
    var newcamp={name: name ,image: image,description:desc,author: author,price: price, location: location, lat: lat, lng: lng};
    Camp.create(newcamp,function(err,camp){
        if(err)
            {
                req.flash("error","Oops some error occured");
                res.redirect("back");
            }
        else{
             req.flash("success","New campground succesfully added");
             res.redirect("/campground");
        }
    });
    });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/addcamp");

});

router.get("/:id",function(req,res){
    Camp.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
        if(err || !foundcamp){
            req.flash("error","Oops campground not found");
            res.redirect("back");
        }
        else
            res.render("campgrounds/campdetail",{foundcamp: foundcamp});
            
    });
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Camp.findById(req.params.id,function(err,foundcamp){
            res.render("campgrounds/edit",{foundcamp: foundcamp});
    });
});
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    
    //google maps
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    //google maps
    Camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campground){
        if(err){
            req.flash("error","Cannot update campground");
            res.redirect("/campground");
        }
        else{
            req.flash("success","Campground updated succesfully");
            res.redirect("/campground/"+campground._id);
        }
    });
});
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Camp.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error",err);
            res.redirect("/campground");
        }
        else{
            req.flash("success","Campground deleted succesfully");
            res.redirect("/campground");
        }
    });
});
//fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports=router;