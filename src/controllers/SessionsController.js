const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")
const { compare } = require("bcryptjs")
class SessionsController {
    async create(req, res) {
        const { email, password } = req.body

        const database = await sqliteConnection()
        const user = await database.get(`SELECT * FROM users WHERE email = (?)`, [email])

        if (!email || !password) {
            throw new AppError("Preencha todos os campos")
        }

        if (!user) {
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }
        

        const { secret, expiresIn } = authConfig.jwt
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })


        return res.json({ user, token })
    }
}

module.exports = SessionsController