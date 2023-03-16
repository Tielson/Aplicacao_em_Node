const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class NoteController {
  async create(req, res) {
    const { title, rating, overview, img, accountid, videoid, youtube } = req.body
    const user_id = req.user.id
    const database = await sqliteConnection()


    if (rating > 5 || rating < 1) {
      throw new AppError("nota do filme pode variar de 1 até o 5")
    }

    await database.run("INSERT INTO notes (title, rating,overview,img ,accountid, videoid, youtube, user_id) VALUES (?,?,?,?,?,?,?,?)", [title, rating, overview, img, accountid, videoid, youtube, user_id])

    return res.json()

  }

  async update(req, res) {
    const { title, rating, tags } = req.body
    const user_id = req.user.id

    const database = await sqliteConnection()



    await database.run(`
     UPDATE notes SET 
     title = ?, 
     rating = ?,
     tags = ?,
     updated_at = DATETIME ('now')
     WHERE id = ?
     `, [title, rating, tags, user_id])

    return res.json()
  }



  async show(req, res) {
    const user_id = req.user.id
    const database = await sqliteConnection()

    const notes = await database.all(`SELECT n.overview, n.img, n.title, n.rating, t.note_id, t.name, t.user_id 
    FROM  notes as n  JOIN  tags as t on  t.note_id = n.id 
    WHERE n.user_id =(?)`, [user_id])

    return res.json([notes])
  }

  async preview(req, res) {
    const user_id = req.user.id
    const { id } = req.params
    const database = await sqliteConnection()

    const notes = await database.all(`SELECT n.youtube, n.accountid, n.videoid,n.overview,n.created_at,  n.img, n.title, n.rating, t.note_id, t.name, t.user_id 
    FROM  notes as n  JOIN  tags as t on  t.note_id = n.id 
    WHERE n.user_id =? and t.note_id=?`, [user_id, id])

    return res.json([notes])
  }


  async toCheck(req, res) {
    const user_id = req.user.id

    const database = await sqliteConnection()

    const note = await database.all(`SELECT  n.title
    FROM  notes as n  JOIN  tags as t on  t.note_id = n.id 
    WHERE n.user_id =?`, [user_id])

    return res.json(note)
  }
  async delete(req, res) {
    const { id } = req.params
    const user_id = req.user.id

    const database = await sqliteConnection()

    const note = await database.all(`DELETE FROM notes WHERE id = ? AND user_id = ?`, [id, user_id])

    return res.json(note)
  }
}

module.exports = NoteController