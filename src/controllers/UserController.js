// const sqliteConnection = require('../database/sqlite')
const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class UsersController {

  async create(req, res) {
    const { name, email, password } = req.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    let validateEmail = email.includes("@" && ".com")

    if (!email || !name || !password) {
      throw new AppError("Preencha todos os campo")
    }
    if (!validateEmail) {
      throw new AppError("Ensira um e-mail valido.")
    }

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.")
    }

    const hashedPassword = await hash(password, 8)

    await database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name, email, hashedPassword])
    return res.json()
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body
    const user_id = req.user.id

    const database = await sqliteConnection()
    const user = await database.get(`SELECT * FROM users WHERE id = (?)`, [user_id])

    if (!user) {
      throw new AppError("Usuario não encontrado")
    }

    const userWithUpdatedEmail = await database.get(`SELECT * FROM users WHERE email = (?)`, [email])

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError(" Este e-mail já está em uso")
    }

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }

    if (old_password && password) {
      const checkedOldPassword = await compare(old_password, user.password)

      if (!checkedOldPassword) {
        throw new AppError("Senha antiga não confere.")
      }

      user.password = await hash(password, 8)
    }

    user.name = name || user.name
    user.email = email || user.email

    await database.run(`
    UPDATE users set
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME ('now') 
    WHERE id = ?` ,
      [user.name, user.email, user.password, user_id])

    return res.json()
  }
}
module.exports = UsersController