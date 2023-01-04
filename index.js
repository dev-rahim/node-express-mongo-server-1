const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    console.log('Hitted');
    res.send('Hello from express')
})

const uri = "mongodb+srv://crud_user_1:YpR2pm5yjSj2ReXW@cluster0.mzolur4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('new_DB');
        const userCollection = database.collection('new_DB_user');
        // Query for a movie that has the title 'Back to the Future'
        // GET API
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query)
            res.send(user)

        })
        // POST 
        app.post('/users', async (req, res) => {
            // console.log('user hitted', req);
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.json(result.insertedId);
        })

        // Delete API 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query)
            res.json(result)
        })

        //PUT API /Update db
        app.put('/users/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                }
            }
            const result = await userCollection.updateOne(query, updateDoc);
            res.json(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// app.get('/users', (req, res) => {
//     res.send(users)
// })

// app.get('/users/:id', (req, res) => {
//     const id = req.params.id;
//     res.send(users[id - 1])
//     console.log(id);
// })

// app.get('/users', (req, res) => {
//     console.log('user added', req)
//     res.json(req)
//     // console.log('id');
// })


app.listen(port, () => {
    console.log('Listening port=', port);
})