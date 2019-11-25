const handleRegister = (db, bcrypt) => (req, res) => {
  const {email, name, password} = req.body
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form details')
  }

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
}

module.exports = {
  handleRegister
}
