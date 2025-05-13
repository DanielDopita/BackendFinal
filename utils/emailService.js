const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendBookingConfirmation = async (email, bookingDetails) => {
  try {
    const mailOptions = {
      from: `Event Ticketing <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Your Booking Confirmation',
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Event: ${bookingDetails.eventTitle}</p>
        <p>Date: ${bookingDetails.eventDate}</p>
        <p>Tickets: ${bookingDetails.quantity}</p>
        ${bookingDetails.qrCode ? `<img src="${bookingDetails.qrCode}" alt="QR Code"/>` : ''}
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendBookingConfirmation };