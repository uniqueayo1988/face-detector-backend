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
    afterCreate: function (conn, done) {
      // in this example we use pg driver's connection API
      // const userTable = create table `users` (`id` int unsigned not null auto_increment primary key, `name` varchar(255), `created_at` datetime, `updated_at` datetime)
      // conn.query('SET timezone="UTC";', function (err) {
      //   if (err) {
      //     // first query failed, return error and don't try to make next query
      //     done(err, conn);
      //   }
      // });
// CREATE TABLE users (id serial PRIMARY key, name varchar(100), email text UNIQUE NOT null, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT null);
      conn.query('CREATE TABLE users (id serial PRIMARY key, name varchar(100), email text UNIQUE NOT null, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT null);', function (err, res) {
        if (err) {
          console.log('There is an error in conn')
          // first query failed, return error and don't try to make next query
          done(err, conn);
        }
        for (let row of res.rows) {
          console.log(JSON.stringify(row));
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

console.log(process.env)
