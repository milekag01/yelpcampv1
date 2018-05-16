var express=require("express");
var router=express.Router({mergeParams:true});
var Camp=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middlewares/middleware.js");

//comments
router.get("/new",middleware.isLoggedIn,function(req,res){
    Camp.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else
            res.render("comments/new",{campground: campground});
    });   
});

router.post("/",middleware.isLoggedIn,function(req,res){
    Camp.findById(req.params.id,function(err, campground) {
        if(err)
            req.flash("error","Oops something went wrong");
        else
            {
                Comment.create(req.body.comment,function(err,comment){
                    if(err)
                        console.log(err);
                    else
                    {
                        comment.author.id=req.user._id;
                        comment.author.username=req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        req.flash("success","Comment added succesfully");
                        res.redirect("/campground/"+campground._id);
                    }
                });
            }
    });
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Camp.findById(req.params.id,function(err, foundcampground) {
        if(err || !foundcampground)
        {
            req.flash("error","No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else
            res.render("comments/edit",{campground_id:req.params.id,foundcomment: foundcomment});
        
        });
    });
});

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else{
            req.flash("success","Comment updated succesfully");
            res.redirect("/campground/"+req.params.id);
        }
    });
});

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Oops something went wrong");
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted succesfully");
            res.redirect("/campground/"+req.params.id);
        }
    });
});

module.exports=router;