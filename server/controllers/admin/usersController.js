const { User } = require('../../models')

module.exports = {
  async getAllUsers(req, res) {
    const users = await User.findAll({ attributes: ['id', 'username', 'email'] })
    if (!users) return res.status(204).json({ message: 'No user found.' })
    res.json(users)
  }
}
