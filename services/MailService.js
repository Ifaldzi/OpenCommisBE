const nodemailer = require('nodemailer')
const { mail } = require('../config/config')

class MailService {
    #transporter
    #sender

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: mail.host,
            port: mail.port,
            auth: {
                user: mail.username,
                pass: mail.password
            }
        })

        this.sender = 'opencommiss@gmail.com'
    }

    async sendNotification(to, body) {
        const mail = await this.transporter.sendMail({
            from: this.sender,
            to,
            subject: 'There is an update on your order',
            html: body
        })

        return mail
    }
}

module.exports = MailService