const CrudRepository = require("./curd-repository");

const { Booking } = require('../models')

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking)
    }

    async createBooking(data, transaction) {
        const response = await Booking.create(data, { transaction });
        return response;
    }
}

module.exports = BookingRepository