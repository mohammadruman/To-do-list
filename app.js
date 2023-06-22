const express = require("express");
const bodyParser = require("body-parser");  
//date.js
// const date = require(__dirname + "/date.js");

// console.log(date());
const mongoose = require("mongoose");


const app = express();
 
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//mongodb
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
//schema
const itemsSchema = {
    name: String
};
//model
const Item = mongoose.model("Item", itemsSchema);
//mongoose documents
const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

//putting all items in an array
const defaultItems = [item1, item2, item3];
//inserting all items in the database

app.get("/", (req, res) =>{
 
Item.find().then(function(foundItems){
    if(foundItems.length === 0){
Item.insertMany(defaultItems).then(function() {
    console.log("Successfully saved default items to DB.");
}).catch(function(err) {    
    console.log(err);
});
res.redirect("/");
    }
    else{
        res.render("list", {listtittle: "Today",newlistitems: foundItems});
    }
   
});

    
});
app.post("/", (req, res) => {
    // console.log(req.body);
const itemName = req.body.newItem;
const item = new Item({
    name: itemName
});
item.save();
res.redirect("/");



//for work page
//     console.log(req.body.list);
//     var item = req.body.newItem;
// if(req.body.list === "Work"){
//     workItems.push(item);
//     res.redirect("/work");
// }
//    else{
//     items.push(item);
//     res.redirect("/");
//    }
  
});


app.get("/work", (req,res) =>{
res.render("list", {listtittle: "Work List", newlistitems: workItems});
});

app.get("/about", (req, res) => {
    res.render("about");
});
// app.post("/work", (req, res) => {
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// });
app.post("/delete", (req, res) => {
    console.log(req.body);
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId).then(function()   {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
    })
});

app.listen(3000, () => {    
    console.log("Server running on port 3000");
});
