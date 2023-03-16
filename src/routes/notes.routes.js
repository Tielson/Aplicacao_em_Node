const { Router } = require('express')

const NoteController = require('../controllers/NoteController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const notesRouters = Router()

const notesController = new NoteController()

notesRouters.post("/", ensureAuthenticated, notesController.create)
notesRouters.put("/", ensureAuthenticated, notesController.update)
notesRouters.get("/show", ensureAuthenticated, notesController.show)
notesRouters.get("/preview/:id", ensureAuthenticated, notesController.preview)
notesRouters.get("/toCheck", ensureAuthenticated, notesController.toCheck)
notesRouters.delete("/:id", ensureAuthenticated, notesController.delete)

module.exports = notesRouters