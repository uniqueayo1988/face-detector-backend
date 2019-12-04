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

const db = knex({
  client: 'pg',
  connection: {
    // host : '127.0.0.1',
    // user : '',
    // password : '',
    // database : 'template1'
    host : 'ec2-174-129-255-76.compute-1.amazonaws.com',
    user : 'uwsctihqxiplsv',
    password : '479add8bb9db16574bfef35e566a8fbb2e1ea5d2e112247a1c9bff90f0660f14',
    database : 'detnditgrq6o8q'
  },
  pool: {
    afterCreate: (conn, done) => {
      conn.query('CREATE TABLE if not exists users (id serial PRIMARY key, name varchar(100), email text UNIQUE NOT null, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT null);', (err) => {
        if (err) {
          console.log(err)
          done(err, conn);
        } else {
          console.log('done')
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
