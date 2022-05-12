const nodemailer = require('nodemailer')
const { mail, baseUrl } = require('../config/config')

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

    async sendNotification(to, subject, body,  attachments = null) {
        const mail = await this.transporter.sendMail({
            from: this.sender,
            to,
            subject,
            html: body || 'Ada pesanan masuk, segera lakukan konfirmasi sebelum 3 hari kedepan',
            attachments
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

    async sendOrderPaidMail(orderData) {
        const { commission } = orderData
        const illustrator = await commission.getIllustrator({paranoid: false})

        this.sendNotification(
            illustrator.email,
            `Pesanan Dengan ID ${orderData.id} Telah Dibayar Oleh Konsumen`,
            `<h3>Pesanan masuk dengan order-id: ${orderData.id} telah dibayar oleh konsumen, diharap untuk segera mengerjakan pesanan yang bersangkutan sebelum batas waktu yang telah ditawarkan</h3>`
        )
    }

    async sendPaymentExpiredMail(orderData) {
        const { consumer, commission } = orderData

        this.sendNotification(
            consumer.email,
            `Pesanan "${commission.title}" Gagal`,
            `<h3>Pesanan mu dengan order-id: ${orderData.id} gagal dikarenakan telat melakukan pembayaran</h3>`
        )
    }

    async sendOrderSubmission(orderData, {filePath, link}, description) {
        const { consumer, commission } = orderData

        const attachments = []
        let submisionNote

        if (filePath) {
            const fileFormat = filePath.split('.').pop()
            attachments.push(
                {
                    filename: `submission-order-${orderData.id}.${fileFormat}`,
                    path: filePath
                }
            )
            submisionNote = 'Hasil pesanan terdapat pada attachment'
        } 

        if (link)
            submisionNote = `Berikut link untuk hasilnya: <a href="${link}">${link}</a>`

        await this.sendNotification(
            consumer.email,
            `Pesanan ${orderData.id} Telah Dikirimkan, Segera Lakukan Konfirmasi`,
            `<h3>Pesananan mu dengan order-id: ${orderData.id} telah dikirimkan oleh illustrator</h3><p>Catatan dari illustrator: ${description}</p><p>${submisionNote}</p>`,
            attachments
        )
    }

    async sendEmailVerificationMail(to, { token, role }) {
        const verificationLink = `${baseUrl}/api/auth/verify?token=${token}&role=${role}`
        await this.sendNotification(
            to,
            'Verifikasi Email Anda Segera',
            `<h3>Veririkasi email anda untuk menggunakan aplikasi Open Commiss dengan mengklik tautan berikut</h3><p><a href="${verificationLink}">${verificationLink}</a></p>`
        )
    }
}

module.exports = MailService