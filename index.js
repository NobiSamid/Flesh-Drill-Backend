const { response } = require('express');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();
const { MongoClient } = require('mongodb');

// username: nobisamidtodo 
// password: 8bzPYc9pqxmDL4jz 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clgsi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('hitting the DB from 17');
//   client.close();
// });

// insert document function and main part of the function is "try" and "finally"
async function run(){
    try{
        // this is for connect db to server
        await client.connect();
        console.log('connected to db from 29')

        // create database
        const database = client.db('fleshDrill')
        const plansCollection = database.collection('planss');

        // GET Api
        app.get('/plans', async(req, res) =>{
            const cursor = plansCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        });

        // Get single service
        app.get('/plans/:id', async (req, res) =>{
            const id = req.params.id;
            console.log('getting specific plan', id);
            const query = { _id: ObjectId(id) };
            const plan = await plansCollection.findOne(query);
            res.json(plan);
        })

        // POST Api
        app.post('/plans', async(req, res) =>{
            const plan = req.body;

            console.log('Hit the post api', plan);

            // Result that we will get
            const result = await plansCollection.insertOne(plan);
            console.log('this is result from 51', result);
            res.json(result);
        });

        // Delete Api
        app.delete('/plans/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await plansCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}

// call the function
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Running my CRUD server');
});


app.listen(port, ()=>{
    console.log('Running server on port', port);
})