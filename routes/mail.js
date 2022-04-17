const { Router } = require("express");
const MailController = require("../controllers/MailController");

const router = Router()

router.post('/send', MailController.sendTestMail)

module.exports = { basePath: '/mail', router }