const express = require("express");
const bodyParser = require("body-parser");  
const mongoose = require("mongoose");
const _= require("lodash");
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
//creating a new schema for custom list
const listSchema = {
    name: String,
    items: [itemsSchema]
}; 
//creating a new model for custom list
const List = mongoose.model("List", listSchema);
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

app.get("/:customlistname", (req, res) => {
  const customlistname =  _.capitalize(req.params.customlistname);
  List.findOne({name: customlistname}).then(function(foundList){

    if(!foundList){
      //create a new list
      const list = new List({

        name: customlistname,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customlistname);
    }
    else{
        //show an existing list
        res.render("list", {listtittle: foundList.name, newlistitems: foundList.items});
    } 
});
 
});

app.post("/", (req, res) => {
    // console.log(req.body);
const itemName = req.body.newItem;
const listname= req.body.list;
const item = new Item({
    name: itemName
});
if(listname === "Today"){

item.save();
res.redirect("/");
}
else{
    List.findOne({name: listname}).then(function(foundList){
        foundList.items.push(item);
        foundList.save();

        res.redirect("/" + listname);
    })
}


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
    const checkedItemId = req.body.checkbox;
    const ListName = req.body.listname;
    if(ListName === "Today"){

    Item.findByIdAndRemove(checkedItemId)
        .then(() => {
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        })
      
    }
    else{
        List.findOneAndUpdate({name:ListName},{$pull : {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + ListName);
            }
        });
    }
});

  
  



app.listen(3000, () => {    
    console.log("Server running on port 3000");
});
