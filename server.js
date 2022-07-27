// imports express library
const express = require('express')
// defines a short hand variable for use and methods
const app = express()
// enables use of mongodb client module
const MongoClient = require('mongodb').MongoClient
// sets up a port for the local server to listen to
const PORT = 2121
// imports the config file and then tells the server to load the .env file see README
require('dotenv').config()

// gives db a name
let db, 
    dbConnectionStr = process.env.DB_STRING, 
    dbName = 'todo'

// initialize the connection to mongo
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// returns a promise, if resolved connection successful if not connection failed
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // assigning the connected client instance, attached to the todo collection to the db variable
        db = client.db(dbName)
    })
    
// sets ejs as the rendering engine
app.set('view engine', 'ejs')
// serves public folder contents as is
app.use(express.static('public'))
// middleware intercepts requests/responses - allows data to be passed to server by request
app.use(express.urlencoded({ extended: true }))
// pushes express through json so that it can be easily
app.use(express.json())

// defines a get method at the root of the server and requests a response in json
app.get('/',async (request, response)=>{
//  when response comes through this will activate and get all documents in the todos collection and push them to an array
    const todoItems = await db.collection('todos').find().toArray()
    // returns a count of the number of records with the completed field equal to false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // a response that renders in the index.ejs that activates the ul with the class of todoitems
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// post method for recieving a new todo item
app.post('/addTodo', (request, response) => {
    // adds new todo item to the db with the completed field defaulted to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // handles returned promise logs the server console and redirects back to root page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // logs an error to the console, if there is one
    .catch(error => console.error(error))
})

// put method for updating a request
app.put('/markComplete', (request, response) => {
    // updates a record using values received in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // when the db is updated it will sort everything and put anything new to the end of the list and not to the top
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        // id and -1 puts stuff at the end of the array
        upsert: false
    })
    // if successful log and send the response if not log the error.
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// put method for updating a request
app.put('/markUnComplete', (request, response) => {
    // updates a record using values received in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // when the db is updated it will sort everything and put anything new to the end of the list and not to the top
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},

        // id and -1 puts stuff at the end of the array
        upsert: false
    })
    // if successful log and send the response if not log the error.
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// handles a delete request at the defined endpoint
app.delete('/deleteItem', (request, response) => {
    // mongodb function to delete a single todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if successful, log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if it fails, log the error
    .catch(error => console.error(error))

})

// starts the server and waits for requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})