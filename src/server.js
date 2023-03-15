require("express-async-errors")

const migrationsRun = require('./database/sqlite/migrations')
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")

const cors = require("cors")
const express = require("express")
const routes = require('./routes')

const allowedOrigins = ['https://rocketmoviees.netlify.app/'];

const options = {
  origin: allowedOrigins
}

migrationsRun()


const app = express()
app.use(express.json())

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))
app.use(cors(options))

app.use(routes)

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }
  
  console.log(error)

  return res.status(500).json({
    status: "error",
    message: "internal server error"
  })
})

const PORT = 5500
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`))