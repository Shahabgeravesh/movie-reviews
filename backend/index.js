//This is the second file I created after server.js
//first we import app that we previously created in server.js file. 
//we also imported MongoDB to access our database and ditenv to access the environment variables
//import app that we previously created and exported in server.js file.
//We import MongoDB to access our database and dotenv to access the environment variables
import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
//we create async function main to connect to MongoDB cluster and call functions that access our database. 
async function main() {
    //call dotenv.config to load the environment variables
    dotenv.config()
    // create an instance of mongo_client and pass in the database URI
    const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI)
    //retrieve the port number from the environment variables. If we can't access it, we use port 8000
    const port = process.env.PORT || 8000
    //in the try block we call client.connect to connect to MongoDB. 
    //Client.connect will return a promise. We use await to indicate that we block further execution until operation has completed.
    try {
        //connect to MongoDB cluster 

        await client.connect()
        //after connecting to the database and there are no errors, we start our web server 
        app.listen(port, () =>
            console.log('listening on port :' + port));
    } catch (e) {
        console.error(e)
        process.exit(1)

    }


}
main().catch(console.error);