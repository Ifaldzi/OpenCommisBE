const { Router } = require("express");
const tagController = require("../controllers/TagController.");

const router = Router()

router.get('/', tagController.getAllTags)
router.post('/', tagController.createTag)

module.exports = { basePath: '/tags', router}