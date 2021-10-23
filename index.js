const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

/* 
username : mongodb1
password : DnI2J8nx22FX9I3X 
*/

const uri =
  "mongodb+srv://mongodb1:DnI2J8nx22FX9I3X@cluster0.cvpyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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

    // create a document to insert
    const contact = {
      name: "Samira",
      number: "+880 77 88 95",
    };
    const result = await contactsCollection.insertOne(contact);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    console.log(result);
  } finally {
    await client.close();
  }
}
run().catch(console.dir); //You have to call the function and catch is for error, and you already know you can only use catch in async/await

app.get("/", (req, res) => {
  res.send("My first CRUD server is getting ready.");
});

app.listen(port, () => {
  console.log("Welcome To PORT", port);
});
