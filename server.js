const express = require('express')
const movies = require('./routes/moviesRoutes')
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const morgan = require('morgan')
const errorHandler = require('./middleware/error')
const colors = require('colors')
const connectDB = require('./config/db')


// Connect Database
connectDB()

const app = express()

// Body Parser
app.use(express.json())

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Mount router
app.use('/api/movies', movies)

// Error Handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen( 
    PORT, console.log(`Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled rejection from database
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // Close server and exit process
    server.close(() => process.exit(1))
})
