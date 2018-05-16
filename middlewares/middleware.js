var Camp=require("../models/campground");
var Comment=require("../models/comment");
var middlewareobj={};

middlewareobj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Camp.findById(req.params.id,function(err,foundcamp){
            if(err || !foundcamp){
                req.flash("error","Campground not found");
                res.redirect("back");
            }
            else{
                if(foundcamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You must be logged in to do that");
        res.redirect("back");
    }
};

middlewareobj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err || !foundcomment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }
            else{
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You must be logged in to do that");
        res.redirect("back");
    }
};

middlewareobj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
        return next();
    req.flash("error","You must be logged in to do that");
    res.redirect("/login");
};

module.exports=middlewareobj;