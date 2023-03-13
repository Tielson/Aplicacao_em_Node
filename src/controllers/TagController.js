const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class TagController {

  async create(req, res) {
    const { name } = req.body
    const user_id = req.user.id
    const database = await sqliteConnection()

    const note_id = await database.get(`SELECT id FROM  notes WHERE id = (SELECT max(id)  FROM notes)`)

    database.run(`
      INSERT INTO tags 
      (note_id, user_id, name)
      VALUES (?, ?, ?)
      `, [note_id.id, user_id, name])
    return res.json()
  }


}

module.exports = TagController