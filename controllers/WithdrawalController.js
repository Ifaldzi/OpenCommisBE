const PaymentService = require("../services/PaymentService");
const { Controller } = require("./Controller");
const { Illustrator, Withdrawal } = require('../models');
const { BadRequestError } = require("../errors");

class WithdrawalController extends Controller {
    constructor() {
        super()
        this.paymentService = new PaymentService()
    }

    makeWithdrawal = async (req, res, next) => {
        const { userId: illustratorId } = req.auth
        const { amount, destination, accountNumber, accountHolderName } = req.body

        const illustrator = await Illustrator.findOne({where: {id: illustratorId}})

        if (amount > illustrator.balance)
            throw new BadRequestError('Insufficient balance')

        if (amount < 50000)
            throw new BadRequestError('Amount must more than Rp 50.000')

        const adminFee = 5500
        const disbursementResponse = await this.paymentService.createDisbursement(
            illustrator,
            amount - adminFee,
            { bankCode: destination, accountNumber, accountHolderName}
        )
        
        try {
            const withdrawal = await Withdrawal.create({
                accountNumber,
                amount,
                destination,
                disburseRefId: disbursementResponse.id,
                status: disbursementResponse.status,
                illustratorId
            })

            this.response.sendSuccess(res, 'Withdrawal transaction created', withdrawal)
        } catch (error) {
            next(error)
        }
    }

    disburseCallback = async (req, res, next) => {
        const { id, status, failure_code: failureCode } = req.body

        const withdrawal = await Withdrawal.findOne({ where: { disburseRefId: id }, include: ['illustrator'] })

        if (status == 'COMPLETED') {
            await withdrawal.illustrator.addBalance(-withdrawal.amount)
        }

        await withdrawal.update({
            status,
            failureCode
        })

        return this.response.sendSuccess(res, 'success', null)
    }

    getAllBanksCode = async (req, res, next) => {
        let banks = await this.paymentService.getAvailableDisbursementBanks()

        banks = banks.map(bank => {
            return {
                name: bank.name,
                code: bank.code
            }
        })

        this.response.sendSuccess(res, 'Fetch data success', banks)
    }

    getWithdrawalsByIllustrator = async (req, res) => {
        const { userId: illustratorId } = req.auth

        const withdrawals = await Withdrawal.findAll({
            where: { illustratorId },
            attributes: {
                exclude: ['illustratorId']
            },
            order: [['createdAt', 'DESC']]
        })

        return this.response.sendSuccess(res, 'Fetch data success', withdrawals)
    }
}

module.exports = new WithdrawalController()