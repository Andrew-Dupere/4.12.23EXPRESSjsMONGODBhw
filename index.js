const dotenv = require('dotenv')
dotenv.config()

const express = require('express');
const app = express();
const port = process.env.PORT
const path = require('path')
const { connectDB } = require('./src/db')


const{ graphqlHTTP } = require('express-graphql')
const schema = require('./src/graphql/schema')

const cookieParser = require('cookie-parser');
const { authenticate } = require('./src/middleware/auth')


// Execute the connect DB function to connect to the db
connectDB();

// Add logging middleware
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

// Add cookie parser middle ware
app.use(cookieParser());

// Add the authenticate middleware to the app AFTER cookieParser middleware
app.use(authenticate);

//add graphql middleware
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))

app.set('view engine', 'ejs');
// Update the location of the folder for res.render to use (default is './views')
app.set('views', path.join(__dirname, 'src/templates/views'));

//set up middelware to parse form data and add body property to the request
app.use(express.urlencoded( { extended: true}))



// Add logging middleware
app.use((req, res, next) => {
    console.log(req.path);
    next();
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Import the function from the routes module
const initRoutes = require('./src/routes');
// Execute the function with the app as an argument
initRoutes(app);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});