const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cors = require('cors')
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'template1'
  }
});

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome to our home page')
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', register.handleRegister(db, bcrypt))
// app.post('/register', (req, res) => { register.handleRegister(db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.listen('8080', () => {
  console.log('App is running on port 8080')
})

console.log(process.env)
