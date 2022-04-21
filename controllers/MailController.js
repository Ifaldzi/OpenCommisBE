const MailService = require('../services/MailService')
const { Controller } = require('./Controller')

class MailController extends Controller {
    constructor() {
        super()
    }

    sendTestMail = async (req, res, next) => {
        const { to, body } = req.body

        try {
            const mail = await new MailService().sendNotification(to, 'Test email', body)
            this.response.sendSuccess(res, "Email sent success", mail)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new MailController()