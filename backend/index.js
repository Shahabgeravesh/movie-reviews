//This is the second file I created after server.js
//first we import app that we previously created in server.js file. 
//we also imported MongoDB to access our database and ditenv to access the environment variables


import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"

async function main() {
    dotenv.config()
    const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI)
    const port = process.env.PORT || 8000
    try {
        //connect to MongoDB cluster 

        await client.connect()
        app.listen(port, () =>
            console.log('listening on port :' + port));
    } catch (e) {
        console.error(e)
        process.exit(1)

    }


}
main().catch(console.error);