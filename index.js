const express = require('express');
const app = express();
const path = require("path")
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utills/wrapAsync.js");
const ExpressError = require("./utills/ExpressError.js");



main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)


app.get("/", (req, res) => {
    res.send("hello world from root node <br><br><br><a href='/listings'>All listings</a>");
});

// app.get("/listing", async(req,res) => {

//     let samplelisting = new Listing({
//         title : "Mathematics",
//         description : "Written by RD sharma",
//         price : 2000,
//         location : "pune",
//         country : "India"
//     });
//     await samplelisting.save()
//     console.log("sample is saved");
//     res.send("Succefull testing")
// })

//index route
app.get("/listings", async (req,res) => {
    // res.send("working")
    let alllistings = await Listing.find({})
    res.render("./listings/index.ejs", {alllistings})
})

//new route
app.get("/listings/new", (req,res) => {
    res.render("./listings/new.ejs")
})

//show route
app.get("/listings/:id", async (req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing })
})

//create route
app.post("/listings",wrapAsync( async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
}))

//edit route
app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing})
})

//update route
app.put("/listings/:id", async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect(`/listings/${id}`)
})

//delete route
app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})

//agar koi route nhi milega tab
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "page not found !"));
})

app.use((err, req, res, next) => {
    let {statusCode, message} = err;
    res.render("error.ejs", {message })
    res.status(statusCode || 500).json({message : err.message});
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})

