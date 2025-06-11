const express = require('express');
const { BookingController } = require('../../controllers');

const router = express.Router();

router.post('/', BookingController.createBooking);


router.post('/payments', BookingController.createPayment)
module.exports = router;