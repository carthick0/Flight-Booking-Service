const CrudRepository = require("./curd-repository");

const { Booking } = require('../models');
const { where, Op } = require("sequelize");

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking)
    }

    async createBooking(data, transaction) {
        const response = await Booking.create(data, { transaction: transaction });
        return response;
    }

    async get(data, transaction) {
        const response = await this.model.findByPk(data, { transaction: transaction });
        if (!response) {
            throw new AppError(
                'Unable to find the requested resource',
                StatusCodes.NOT_FOUND, ['No record found in the database for the given ID'],
                'Cannot fetch data the resource '
            );
        }
        return response;
    }

    async update(id, data, transaction) {

        const response = await this.model.update(data, {
            where: {
                id: id
            }
        }, { transaction: transaction });
        return response;
    }
    async cancelOldBookings(timestamp) {
        const response = await Booking.update({ status: 'CANCELLED' }, {
            where: {
                [Op.and]: [{
                        createdAt: {
                            [Op.lt]: timestamp
                        }
                    },
                    {
                        status: {
                            [Op.ne]: 'BOOKED'
                        }
                    },
                    {
                        status: {
                            [Op.ne]: 'CANCELLED'
                        }
                    }
                ]
            }
        });
        return response;
    }
}

module.exports = BookingRepository