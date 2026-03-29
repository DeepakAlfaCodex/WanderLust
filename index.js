const express = require('express');
const app = express();
const path = require("path")
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");



main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}))


app.get("/", (req, res) => {
    res.send("hello world from root node ");
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

//show route
app.get("/listing/:id", async (req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing })
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})