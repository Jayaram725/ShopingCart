const express = require("express");
const app = express();
const bp = require("body-parser");
const mongoose = require('mongoose');
app.set('view engine','ejs');
app.use(bp.urlencoded({extended:true}));
app.use(express.static('public'));
app.listen(3000,()=>{
  console.log("server is started at port 3000");
});
app.use(function(req, res, next) {
    console.log(typeof req.next);

    return next();
});
var text=0;
var user_login;//current logined user Email
var cart;
mongoose.connect("mongodb://localhost:27017/iiit_cart",{useNewUrlParser:true,useUnifiedTopology: true});
const Schema = {
  user_name:String,
  password:String,
  _id:String
}
const Reg =mongoose.model("user",Schema);
app.get("/",(req,res)=>{
  res.render('login',{text : ""});
});
app.post("/signup",(req,res)=>{
  var un = req.body.username;
  var pass = req.body.password;
  var rp = req.body.rep_password;
  var em = req.body.email;
  if(pass!=rp){
    console.log("Enter the same password");
  }
  else {
    Reg.find({"_id":em},(err,array)=>{
      if(array.length==0)
      {
        const x = new Reg({
          user_name:un,
          password:pass,
          _id:em
        });
        var a = [x];

         Reg.insertMany(a,(err)=>{
          if(err)
          {
            console.log(err);
          }
          else {
            console.log('Ur registered successfully');
            res.render("login",{text : 4});
          }
        });

      }
      else {
        console.log("This Email is alredy  registered");
        res.render("login",{text : 2});
      }
    });
  }
});



app.post("/",(req,res)=>{
  var email =req.body.email;
  var pass = req.body.password;

  Reg.find({"_id":email},(err,array)=>{//here this findItems is our output ina an array
    console.log(array[0]);
    console.log(pass);
    if(array.length==0){
      console.log("This email is not registered yet");
      res.render("login",{text : 3});
    }
    else {
      if(String(array[0].password)==String(pass))
      {
        console.log("ur login is succesfull");
        res.render('index');
        user_login = email;
      }
      else {
        console.log("Enter the correct password");
        res.render("login",{text : 1});
      }
    }
  });
})
const Schema2 = {
  email:String,
  item_name:String,
  quantity:Number,
  price:Number
}
const Cart =mongoose.model("cart",Schema2);
app.post("/carts",(req,res)=>{
  var name = req.body.name;
  var price = req.body.price;
  var qty=req.body.qty;
  var pr = Number(price.slice(1,3));
  var l = new Cart({
    email:user_login,
    item_name:name,
    quantity:qty,
    price:pr
  });
  var al = [l];
  Cart.find({"email":user_login,"item_name":name},(err,array)=>{
    var sum = 0;
    if(err){
      console.log(err);
    }
    else{
      if(array.length==0){

        Cart.insertMany(al,(err)=>{
         if(err)
         {
           console.log(err);
         }
         else {
           console.log('succesfull added to cart'+user_login);
         }
         res.render('index');
       });
      }
      else {
        sum = array[0].quantity;
        Cart.updateOne({"email":user_login,"item_name":name},{quantity:Number(sum)+Number(qty)},(err)=>{
          if(err){
            console.log(err);
          }
          else{
            console.log("items are updated succesfull");
            res.render('index');
          }
        })
      }
    }
  })
});
app.get("/cart",(req,res)=>{
  Cart.find({"email":user_login},(err,array)=>{
    var x= array;
    var sum=0;
    cart = array;
    for(var i=0;i<array.length;i++){
      sum=sum+array[i].price*array[i].quantity;
    }
    res.render('cart',{list:x,total:sum});
  });
});
app.get('/index',(req,res)=>{
  res.render('index');
});
app.post("/carte",(req,res)=>{
var l = req.body.z;
var name = req.body.x;
var qty = req.body.y;
if(l=="Update_Cart"){
  console.log(name)
  console.log(qty)
  for(var i=0;i<name.length;i++){
Cart.updateOne({"email":user_login,"item_name":name[i]},{"quantity":Number(qty[i])},(err)=>{
  if(err){
    console.log(err);
  }
  else {
    Cart.find({"email":user_login},(err,ar)=>{
      if(err){
        console.log(err);
      }
      else {
        var sum=0;
        for(var i=0;i<ar.length;i++){
          sum = sum+ar[i].price*ar[i].quantity;
        }
        cart=ar;
        res.render("cart",{list:ar,total:sum});
      }
    })

  }
})
}
}
else {
  Cart.deleteMany({"email":user_login},function (err) {
  if(err){
    console.log(err);
  }
  else {
    console.log(res);
    console.log("items are deleted succesfull");
    var lal =[];
    cart=[];
    res.render('cart',{list:lal,total:0});
  }
});
}
});
app.get("/checkout",(req,res)=>{
  var sum=0;
  for(var i=0;i<cart.length;i++){
    sum=sum+cart[i].price*cart[i].quantity;
  }
  var ship_charge=(2*sum)/100
  res.render('checkout',{list:cart,total:(sum+ship_charge),ship:ship_charge});
});
app.post("/order",(req,res)=>{
  var name=req.body.name;
  var email=req.body.email;
  var city=req.body.city;
  var address=req.body.address;
  var zip=req.body.zip;
  var country=req.body.country;

  var sum=0;
  for(var i=0;i<cart.length;i++){
    sum=sum+cart[i].price*cart[i].quantity;
  }
  var ship_charge=(2*sum)/100
  res.render('order',{list:cart,total:(sum+ship_charge),ship:ship_charge,n:name,e:email,city:city,a:address,z:zip,c:country});
});
app.post("/final",(req,res)=>{
  Cart.deleteMany({"email":user_login},(err)=>{
    if(err){
      console.log(err);
    }
    else {
      console.log("Thank you for ordering in iiit_cart");
      cart=[];
    }
  })
  res.render("final");
});
