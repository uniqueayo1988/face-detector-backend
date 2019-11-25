const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
  handleProfileGet
}
