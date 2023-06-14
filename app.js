const express = require("express");
const bodyParser = require("body-parser");  
const date = require(__dirname + "/date.js");
// console.log(date());
var items = ["hello", "hi", "bye"];
let workItems = ["work1", "work2", "work3"];
const app = express();
 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/", (req, res) =>{
 
  let day = date.getday();
    res.render("list", {listtittle: day,newlistitems: items});
    // console.log(day);
    
});
app.post("/", (req, res) => {
    // console.log(req.body);
    console.log(req.body.list);
    var item = req.body.newItem;
if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
}
   else{
    items.push(item);
    res.redirect("/");
   }
  
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
app.listen(3000, () => {    
    console.log("Server running on port 3000");
});
