const QRCode = require('qrcode');

const generateQR = async (bookingId) => {
  try {
    const qrData = `BOOKING_ID:${bookingId}|VALID:true`;
    const qrCode = await QRCode.toDataURL(qrData);
    return qrCode;
  } catch (error) {
    console.error('QR generation failed:', error);
    return null;
  }
};

module.exports = { generateQR };