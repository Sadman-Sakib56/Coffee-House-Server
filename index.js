const express = require('express');
const cors = require('cors');

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is running');
})





const uri = `mongodb+srv://${process.env.COFFEE_HOUSE_USER}:${process.env.COFFEE_HOUSE_PASS}@cluster0.14vpjed.mongodb.net/?retryWrites=true&w=majority`;


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

        const coffeeCollection = client.db('coffee-house-admin').collection('coffees');

        app.get('/coffees', async (req, res) => {
            // const cursor = coffeeCollection.find();
            // const result = await cursor.toArray(); or same thing we can do in one line below;
            const result = await coffeeCollection.find().toArray();
            res.send(result);
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        // post from add coffee
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log((newCoffee));
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedCoffee = req.body;
            const updatedDoc = {
                $set: updatedCoffee
            }
            const options = { upsert: true };
            const result = await coffeeCollection.updateOne(filter, updatedDoc, options);

            res.send(result);
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
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


app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
})