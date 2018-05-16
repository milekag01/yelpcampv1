var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
    res.render("landingPage");
});
//Authentication Routes
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var newuser=new User({username: req.body.username});
    User.register(newuser,req.body.password,function(err,user){
        if(err)
        {
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Registraion Successful. Welcome "+req.body.username);
            res.redirect("/campground");
        });
    });
});

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campground",
    failureRedirect:"/login"
}),function(req,res){
    
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","You have been signed out successfully");
    res.redirect("/");
});

module.exports=router;