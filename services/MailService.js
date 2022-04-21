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

    async sendNotification(to, subject, body) {
        const mail = await this.transporter.sendMail({
            from: this.sender,
            to,
            subject,
            html: body || 'Ada pesanan masuk, segera lakukan konfirmasi sebelum 3 hari kedepan'
        })

        console.log(mail);
        return mail
    }

    async sendConfirmationMail(orderData) {
        const { consumer, commission } = orderData
        this.sendNotification(
            consumer.email,
            `Pesanan "${commission.title}" Dikonfirmasi Illustrator`,
            `<h3>Pesanan mu dengan order-id: ${orderData.id} sudah dikonfirmasi oleh illustrator, segera lakukan pembayaran agar pesanan mu segera dikerjakan</h3>`
        )
    }

    async sendRejectionMail(orderData, rejectionReason) {
        const { consumer, commission } = orderData
        this.sendNotification(
            consumer.email,
            `Pesanan "${commission.title}" Ditolak Illustrator`,
            `<h3>Mohon maaf pesanan mu dengan order-id: ${orderData.id} ditolak oleh illustrator</h3><p>Alasan penolakan: ${rejectionReason}</p>`
        )
    }
}

module.exports = MailService