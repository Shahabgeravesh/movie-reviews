//server.js is the first file I created after installing all modules
//express.js is the JSON parsing middleware to enable the server to read and accept JSON in a request's body
import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js'
const app = express()
app.use(cors())
app.use(express.json())

//specifying the initial routes. every route in movies will start with /api/v1/movies                                                      
app.use("/api/v1/movies", movies)
app.use('*', (req, res) => {
    res.status(404).json({ error: "not found" })
})

//we export the app as a module so other files can import it 
export default app

