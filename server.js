const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cors = require('cors')
const knex = require('knex')

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
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
      console.log(isValid, '...valid')
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('Unable to get User'))
      } else {
        res.status(400).json('Wrong credentials')
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req, res) => {
  const {email, name, password} = req.body

  const hash = bcrypt.hashSync(password, 10);

  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email,
          name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0])
        })     
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('Unable to Register User'))
})

app.get('/profile/:id', (req, res) => {
  const {id} = req.params
  db.select('*')
    .from('users')
    .where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(404).json('User does not exist')
      }  
    })
    .catch(err => res.status(500).json('Server error'))
})

app.put('/image', (req, res) => {
  const {id} = req.body
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('Unable to update entries')) 
})

app.listen('8080', () => {
  console.log('App is running on port 8080')
})
