const Xendit = require('xendit-node')
const { xenditSecretKey, redirectUrl, feBaseUrl } = require('../config/config')
const { BadRequestError } = require('../errors')
const xendit = new Xendit({ secretKey: xenditSecretKey})
const { Invoice, Disbursement } = xendit

class PaymentService {
    constructor() {
        this.invoice = new Invoice({})
        this.disbursement = new Disbursement()
    }

    static availablePaymentMethod = [
        {
            type: 'e-wallet',
            methods: ['OVO', 'DANA', 'LINKAJA'],
            fee: 1.5
        },
        {
            type: 'bank',
            methods: ['BCA', 'BNI', 'BSI', 'BRI', 'MANDIRI', 'PERMATA'],
            fee: 4500
        },
        {
            type: 'retail store',
            methods: ['ALFAMART', 'INDOMARET'],
            fee: 5000
        }
    ]

    #getPaymentMethods(type) {
        const paymentMethods = PaymentService.availablePaymentMethod
        switch (type) {
            case 'e-wallet':
                return paymentMethods[0]
            case 'bank':
                return paymentMethods[1]
            case 'retail':
                return paymentMethods[2]
            default:
                throw new BadRequestError("Payment method not available")
        }
    }

    async createInvoice(orderData, paymentMethod) {
        let paymentMethods = this.#getPaymentMethods(paymentMethod)
        let amount = orderData.grandTotal
        
        const paymentServiceFee = paymentMethod === 'e-wallet' ? (paymentMethods.fee/100 * amount) : paymentMethods.fee
        amount += paymentServiceFee

        const response = await this.invoice.createInvoice({
            externalID: 'order-' + orderData.id + `-${Date.now()}`,
            amount: amount,
            successRedirectURL: `${feBaseUrl}/consumer/order/${orderData.id}/payment-success`,
            failureRedirectURL: redirectUrl.paymentFailure,
            paymentMethods: paymentMethods.methods,
            fees: [
                {
                    type: 'service',
                    value: paymentServiceFee
                }
            ]
        })

        return response
    }

    async createDisbursement(illustratorData, amount, { bankCode, accountNumber, accountHolderName }) {
        if (!accountHolderName)
            accountHolderName = illustratorData.name
        const response = await this.disbursement.create({
            externalID: `withdraw-${illustratorData.id}-${Date.now()}`,
            amount,
            bankCode,
            accountHolderName,
            accountNumber,
            description: 'Withdrawals to illustrator account, username: ' + illustratorData.username 
        })

        return response
    }

    async getAvailableDisbursementBanks() {
        return await this.disbursement.getBanks()
    }
}

module.exports = PaymentService