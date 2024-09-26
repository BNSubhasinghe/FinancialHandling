const mongoose = require('mongoose')
const MongoDB_URI = 'mongodb+srv://bhagya:1EJcHLa7lrzeXU9b@cluster0.fcrla.mongodb.net/'

const connect = mongoose.connect(MongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const connection = mongoose.connection

connection.on('error', err => console.log(err))
connection.on('connected', () => console.log('Mongo DB connection successful!'))