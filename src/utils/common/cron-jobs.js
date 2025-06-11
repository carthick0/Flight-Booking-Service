const cron = require('node-cron');

const { BookingService } = require('../../services');



function scheduleCrons() {
    cron.schedule('*/30  * * * *', async() => {
        console.log("Starting cron again", BookingService)
        const response = await BookingService.cancelOldBookings()
        console.log(response);
        return response;
    });
}

module.exports = scheduleCrons;