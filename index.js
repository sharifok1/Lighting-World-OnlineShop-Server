const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3020
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he93e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run(){
  try {
    await client.connect();
    const database = client.db('lightingWorld');
    const allProducts = database.collection('Allproducts');
    const userDataCollection = database.collection('users');
    const userReviewCollection = database.collection('reviews');
    const userOrderCollection = database.collection('UserOrders');
    console.log('Mongodb successfully coneted')
   //Method---------------------API
 //POST for appointmentdata ---Method---------------------API
 app.post('/allProducts', async(req,res)=>{
   const allProduct = req.body;
   const result = await allProducts.insertOne(allProduct);
   console.log(result);
   res.json(result);
})
 //POST Method for save user data------------------user
 app.post('/users', async(req, res)=>{
  const users = req.body;
  const result = await userDataCollection.insertOne(users);
  console.log('user connected', result);
  res.json(result);
})
  //Put Method for adding google user----------------API
  app.put('/users', async(req, res)=>{
    const user =req.body;
    const filter = {email:user.email} ;
    const options = {upsert: true};
    const updateDoc = {$set: user};
    const result  = await userDataCollection.updateOne(filter,updateDoc,options);
    res.json(result)
    console.log(result);
  })
  app.get('/users', async(req, res)=>{
    const users = userDataCollection.find({})
    const result = await users.toArray();
    res.send(result)
    console.log('find review',result);
  })
  //update method for admin----------------admin api
    app.put('/user/admin', async(req, res)=>{
    const user = req.body;
    console.log(user)
    const filter = {email: user.email};
    const updateDoc = {$set:{role:'admin'}};
    const result = await userDataCollection.updateOne(filter, updateDoc);
    res.json(result);
  })
  //get method for finding admin-----------get admin
  app.get('/users/:email', async(req, res) =>{
    const email = req.params.email;
    const query = { email: email};
    const user = await userDataCollection.findOne(query)
    let isAdmin = false;
    if(user?.role == 'admin'){
      isAdmin = true
    }
    res.json({admin: isAdmin})
  })
  //Post method --------------------post user review
  app.post('/review', async(req, res)=>{
    const review = req.body;
    const result = await userReviewCollection.insertOne(review);
    console.log(result);
    res.json(result);
  })
  //get method--------------------------------------get review
  app.get('/review', async(req, res)=>{
    const review = userReviewCollection.find({})
    const result = await review.toArray();
    res.send(result)
    console.log('find review',result);
  })
  //get method--------------------------------------get all product
  app.get('/allProducts', async(req, res)=>{
    const allProduct = allProducts.find({})
    const result = await allProduct.toArray();
    res.send(result); 
  })
   //delet API -----------------------------------------delete
   app.delete('/allProducts/:id', async (req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await allProducts.deleteOne(query);
    console.log('deleted id', result);
    res.json(result);
})
//Post method -----------------------------------------post user order
app.post('/userOrder', async(req, res)=>{
  const order = req.body;
  const result = await userOrderCollection.insertOne(order);
  console.log(result);
  res.json(result);
})
//get method--------------------------------------get all Order
app.get('/userOrder', async(req, res)=>{
  const allOrder = userOrderCollection.find({})
  const result = await allOrder.toArray();
  res.send(result); 
})
  //delet API -----------------------------------------delete order
  app.delete('/userOrder/:id', async (req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await userOrderCollection.deleteOne(query);
    console.log('deleted id', result);
    console.log('hit the delete method')
    res.json(result);
})
//Put API ------------------------------------------update order/ status
app.put('/order/status', async(req,res)=>{
  const id = req.body.id;
  const status = req.body.status;
  const updateStatus = await userOrderCollection.updateOne({_id:ObjectId(id)},{$set:{orderStatus:status}},{upsert: true});
  res.json(updateStatus);
})

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req, res)=>{
  res.json('Hit from lighting world server');
})

app.listen(port, ()=> {
  console.log('lighting world server is running and listing from',port)
})