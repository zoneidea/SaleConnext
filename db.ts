const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        
        const database = client.db('yourdbname');
        const users = database.collection('users');
        
        // การสร้างเอกสารใหม่
        const result = await users.insertOne({ name: "John Doe", email: "john@example.com", password: "securepassword" });
        console.log(`New user created with id: ${result.insertedId}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
