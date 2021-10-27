const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId; //Don't forget this

const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

app.use(cors());
app.use(express.json());

/* 
username : mongodb1
password : DnI2J8nx22FX9I3X 
*/

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvpyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Arrow Function
/* 
client.connect((err) => {
  const collection = client.db("phoneBook").collection("contacts");

    console.log('Hitting The Database');

  // create a document to insert
  const contact = {
    name: "Selina", number: "+880 77 88 93"
  };
  collection.insertOne(contact)
  .then(()=>{
      console.log('Insert Success')
  })

  if(err){
    return console.log(err);
    }
    
    client.close();
//  client.close(); //First Time insert error
});
 */
//Async Await
async function run() {
  try {
    await client.connect();
    const database = client.db("phoneBook");
    const contactsCollection = database.collection("contacts");

    /* 
    // create a document to insert
    const contact = {
      name: "Samira",
      number: "+880 77 88 95",
    };
    const result = await contactsCollection.insertOne(contact);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    console.log(result); 
    */

    //CRUD Operation Begins
    //(1) GET
    //(2) POST
    //(3) DELETE
    //(4) PUT
    
    //GET API Get All Contacts
    app.get("/contacts", async (req, res) => {
      const cursor = contactsCollection.find({});

      //(1) To get the full collection we have to use find({}), and for other condition we have to use find({condition})

      //(2) Here, cursor is a pointer that indicating the specific collection

      //(3) But we can also declare directly
      // const contacts = await contactsCollection.find({}).toArray();

      const contacts = await cursor.toArray();
      res.send(contacts);
    });

    // Single Contact to dynamic route
    app.get("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      // query(looking) for a document that has ObjectId
      const query = { _id: ObjectId(id) };
      const contact = await contactsCollection.findOne(query);
      console.log("Load Contact ID", id);
      res.send(contact);
    });

    // POST API fetch() method:'POST' 
    app.post("/contacts", async (req, res) => {
      const newContact = req.body;
      const result = await contactsCollection.insertOne(newContact);
      // console.log("New contact :", req.body);
      console.log("Added contact :", result);
      res.json(result); //Because it's API, send the result to the client site
    });

    // Edit & Saving Contact fetch() method:'PUT'
    app.put("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const updatedContact = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedContact.name,
          number: updatedContact.number,
        },
      };
      const result = await contactsCollection.updateOne(filter, updateDoc, options);
      console.log("Edit & Saving", req);
      res.json(result);
    });

    // Deleting Contact fetch() method:'DELETE'
    app.delete("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      // query(looking) for a document that has ObjectId
      const query = { _id: ObjectId(id) };
      const result = await contactsCollection.deleteOne(query);
      console.log("Delete by dynamic ID", result);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
//We must call the function and catch the error.
//And we already know that we can only use catch in async/await.

app.get("/", (req, res) => {
  res.send("My first CRUD server is getting ready.");
});

app.listen(port, () => {
  console.log("Welcome To PORT", port);
});
