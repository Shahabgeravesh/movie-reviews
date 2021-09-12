// This is the 4th file I created. 
// We are implementing the movies data access object uto allow our code to access movies in database. (DAO stands for Data Access Object)
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

//movies stores the reference to the database
let movies
//injectDB will be calles as soon as the server starts and provides the database reference to movies
export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return
        }
        // if the reference exists, we returm try
        try {
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
                .collection('movies')
        }
        //if we fail to get the reference, we send an error message to the console
        catch (e) {
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }
    //we defie the method to get all movies from the database. add to moviesDAO.js the below method. 
    // The getMovies method accespts a filter object as its first argument.
    // The default filter has no filters, retrieves results at page 0 and retrieves 20 movies per page. In our app, we provide filtering results by movie title and movie raing
    static async getMovieById(id) {
        try {
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next()
        }
        catch (e) {
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }
    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}) {
        let query
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters['title'] } }
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } }
            }
        }

        let cursor
        try {
            cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return { moviesList, totalNumMovies }
        }
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }
    }

    static async getRatings() {
        let ratings = []
        try {
            ratings = await movies.distinct("rated")
            return ratings
        }
        catch (e) {
            console.error(`unable to get ratings, $(e)`)
            return ratings
        }
    }

}
