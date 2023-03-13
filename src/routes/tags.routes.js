const { Router } = require('express')

const TagController = require('../controllers/TagController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const tagsRouters = Router()

const tagsController = new TagController()

tagsRouters.post("/" ,ensureAuthenticated, tagsController.create)

module.exports = tagsRouters