const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqpbf9w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collageDb
    // collageData

    const collageCollection = client.db("collageDb").collection("collageData");
    const studentCollection = client.db("collageDb").collection("studentData");
    const reviewCollection = client.db("collageDb").collection("studentReview");

    // find all data
    app.get('/collages', async(req, res) => {
      const cursor = collageCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // find single data
    app.get('/collages/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const user = await collageCollection.findOne(query)
      res.send(user)
    })

    // post single student data 
    app.post('/students', async (req, res) => {
      const student = req.body;
      const result = await studentCollection.insertOne(student)
      res.send(result)
    })

    // find student data 
    app.get('/students', async(req, res) => {
      const cursor = studentCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // find student reviews
    app.get('/reviews', async(req, res) => {
      const cursor = reviewCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // post student review
    app.post('/reviews', async(req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('collage is open')
})



app.listen(port, () => {
  console.log(`Collage is open on port ${port}`)
})