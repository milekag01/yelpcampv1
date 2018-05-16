var express=require("express");
var router=express.Router();
var Camp=require("../models/campground");
var middleware=require("../middlewares/middleware.js");

router.get("/",function(req,res){
    Camp.find({},function(err,newcamp){
        if(err)
            req.flash("error","Opps something went wrong");
        else{
            res.render("campgrounds/index",{camp: newcamp});        
        }
    });
    
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
    
    var newcamp={name: name ,image: image,description:desc,author: author,price: price};
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
    Camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcamp){
        if(err){
            req.flash("error","Cannot update campground");
            res.redirect("/campground");
        }
        else{
            req.flash("success","Campground updated succesfully");
            res.redirect("/campground/"+req.params.id);
        }
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

module.exports=router;