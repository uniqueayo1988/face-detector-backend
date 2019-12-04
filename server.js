const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cors = require('cors')
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const PORT = process.env.PORT || 8080
require('dotenv').config()

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: ['knex', 'public'],
  ssl: true,
  pool: {
    afterCreate: (conn, done) => {
      conn.query('CREATE TABLE if not exists users (id serial PRIMARY key, name varchar(100), email text UNIQUE NOT null, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT null);', (err) => {
        if (err) {
          console.log(err)
          done(err, conn);
        } else {
          conn.query('CREATE TABLE if not exists login (id serial PRIMARY key, hash varchar(100) NOT null, email text UNIQUE NOT null);', (err) => {
            done(err, conn);
          })
        }
      });
    }
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

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
