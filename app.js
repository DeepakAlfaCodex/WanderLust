const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

main()
.then(()=> {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hi, This is Deepak!")
});

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
})

//New Route
app.get("/listings/new", async ( req, res ) => {
    res.render("listings/new")
});

//Show Route
app.get("/listings/:id", async ( req, res ) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
});

//Create Route
app.post("/listings", async ( req, res ) => {
    let listing =  req.body.listing;
    console.log(listing)
})

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the Swimming Pool",
//         price: 1200,
//         locations: "Calangote, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Data was successfully saved")
// });
app.listen(8080, () => {
    console.log('Server is listening at port 8080');
});