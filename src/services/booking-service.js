const { default: axios } = require("axios");
const { BookingRepository } = require("../repositories");
const db = require('../models');
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

async function createBooking(data) {
    const result = await db.sequelize.transaction(async function bookingImp(t) {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;

        if (data.noOfSeats > flightData.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }

        return {
            message: 'Booking created successfully',
            flightId: data.flightId,
            seatsBooked: data.noOfSeats
        };
    });

    return result;
}

module.exports = {
    createBooking,
};