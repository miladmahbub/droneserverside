const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT|| 4400;



// middleware 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbeks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)


async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('doctors_portal');
        const appointmentsCollection = database.collection('appointments');
        const usercollection = database.collection('users');
        const servicesCollection = database.collection('services');
        const addreview = database.collection('reviews');
        const manageallordrs = database.collection('order');



      //  serviceproducts
      
        // GET API
        app.get('/services', async (req, res) => {
          const cursor = servicesCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
      });


      // POST API
      app.post('/services', async (req, res) => {
        const service = req.body;
        console.log('hit the post api', service);
         const result = await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result)
    });
     

    // add review
    // GET API
    app.get('/addreview', async (req, res) => {
      const cursor = addreview.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
  });

    // POST API
    app.post('/addreview', async (req, res) => {
      const review = req.body;
      console.log('hit the post api', review);
       const result = await addreview.insertOne(review);
      console.log(result);
      res.json(result)
  });

  // manage all orders 

  // POST API
  app.post('/manageallordrs', async (req, res) => {
    const review = req.body;
    console.log('hit the post api', review);
     const result = await manageallordrs.insertOne(review);
    console.log(result);
    res.json(result)
});

// GET API
    app.get('/manageallordrs', async (req, res) => {
      const cursor = manageallordrs.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
  });

// GET Single orsers
app.get('/manageallordrs/:id', async (req, res) => {
  const id = req.params.id;
  console.log('getting specific service', id);
  const query = { _id: ObjectId(id) };
  const service = await manageallordrs.findOne(query);
  res.json(service);
});

// DELETE API ORDERS

app.delete('/manageallordrs/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await manageallordrs.deleteOne(query);
  res.json(result);
})

      


     // appointsments

        app.get('/appointments', async (req, res) => {
          const email = req.query.email;
          const date = new Date(req.query.date).toLocaleDateString();

          const query = { email: email, date: date }

          const cursor = appointmentsCollection.find(query);
          const appointments = await cursor.toArray();
          res.json(appointments);
      })


      app.post('/appointments', async (req, res) => {
        const appointment = req.body;
        const result = await appointmentsCollection.insertOne(appointment);
        console.log(result);
        res.json(result)
    });

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
          isAdmin = true;
      }
      res.json({ admin: isAdmin });
  })



    app.post ('/users',async(req,re)=>{
      const user = req.body;
      const result = await usercollection.insertOne(user);
      re.json(result)
    });
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
  });

  app.put('/users/admin', async (req, res) => {
    const user = req.body;
    const filter = {email: user.email}
    const updateDoc = { $set: { role: 'admin' } }; 
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);

})



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello drone media')
})

app.listen(port, () => {
  console.log(` listening at http://localhost:${port}`)
})