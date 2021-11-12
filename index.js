const express = require('express');
const { MongoClient } = require("mongodb");
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
    console.log('database successfully coneted')
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

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req, res)=>{
  res.json('lighting world server is running');
})

app.listen(port, ()=> {
  console.log('lighting world server is running and listing from',port)
})