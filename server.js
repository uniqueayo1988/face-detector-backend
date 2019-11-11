const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

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
  ]
}

app.get('/', (req, res) => {
  res.send('hello')
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('Success')
  } else {
    res.status('400').json('Error logging user in')
  }
  res.send('signing')
})

app.post('/register', (req, res) => {
  const {email, name, password} = req.body
  database.users.push({
    id: '125',
    name,
    email,
    password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users)
  // res.json(database.users[database.users.length - 1])
})

app.listen('8080', () => {
  console.log('App is running on port 8080')
})

/*
/profile/:userId --> GET = user
/image --> PUT --> user
*/
