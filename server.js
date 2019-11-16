const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cors = require('cors')

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

  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('Success')
  } else {
    res.status('400').json('Error logging user in')
  }
  res.send('signing')
})

app.post('/register', (req, res) => {
  const {email, name, password} = req.body

  bcrypt.hash(password, 10, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash, '...hash')
  });
  database.users.push({
    id: '125',
    name,
    email,
    entries: 0,
    joined: new Date()
  })
  // res.json(database.users)
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const {id} = req.params
  database.users.forEach(user => {
    if (user.id === id) {
      return res.json(user)
    }
  })
  return res.status(404).json('no such user')
})

app.put('/image', (req, res) => {
  const {id} = req.body
  database.users.forEach(user => {
    if (user.id === id) {
      user.entries++
      return res.json(user.entries)
    }
  })
  return res.status(404).json('no such user')  
})

app.listen('8080', () => {
  console.log('App is running on port 8080')
})
