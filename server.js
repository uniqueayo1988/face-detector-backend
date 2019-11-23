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

// db.select().table('users').then(data => {
//   console.log(data, '...test')
// })

const app = express()
const pwd = "$2b$10$mNyFBde5JrtsnFV0mLprG.q9isC2qcp3Qya1RYfTbLQfwrwGrSn6y"

app.use(bodyParser.json())
app.use(cors())

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
  // password: [
  //   {
  //     id: '',
  //     hash: '',
  //     email: ''
  //   }
  // ]
}

app.get('/', (req, res) => {
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  // bcrypt.compare("orange", pwd, function(err, res) {
  //   console.log(res, '.....response')
  //     // res == true
  // });
  // bcrypt.compare("someOtherPlainte", pwd, function(err, res) {
  //     // res == false
  //     console.log(res, '.....respons two')
  // });

  // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
  //   res.json('Success')
  // } else {
  //   res.status('400').json('Error logging user in')
  // }
  // res.send('signing')
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      console.log(data)
    })
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

  // bcrypt.hash(password, 10, function(err, hash) {
  //   // Store hash in your password DB.
  //   // console.log(hash, '...hash')
  // });
  // db('users')
  // .returning('*')
  // .insert({
  //   email,
  //   name,
  //   joined: new Date()
  // })
  //   .then(user => {
  //     res.json(user[0])
  //   })
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
  // database.users.forEach(user => {
  //   if (user.id === id) {
  //     user.entries++
  //     return res.json(user.entries)
  //   }
  // })
  // return res.status(404).json('no such user')  
})

app.listen('8080', () => {
  console.log('App is running on port 8080')
})
