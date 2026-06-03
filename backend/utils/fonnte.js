const axios = require('axios');

const Settings = require('../models/Settings');

async function sendWaNotification(no_wa, pesan) {
  let token = process.env.FONNTE_TOKEN;
  
  try {
    const settings = await Settings.findOne();
    if (settings && settings.fonnteToken) {
      token = settings.fonnteToken;
    }
  } catch (e) {
    console.error("Gagal membaca token Fonnte dari database", e);
  }

  if (!token) {
    console.log("Fonnte Token is missing, skipping WA notification.");
    return;
  }

  try {
    // Fonnte API membutuhkan format x-www-form-urlencoded atau multipart/form-data
    const data = new URLSearchParams();
    data.append('target', no_wa);
    data.append('message', pesan);
    data.append('countryCode', '62'); // Pastikan format 08 akan diubah menjadi 628 otomatis

    const response = await axios.post('https://api.fonnte.com/send', data, {
      headers: { 
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log(`WhatsApp Fonnte response:`, response.data);
  } catch (error) {
    console.error('Gagal mengirim WA:', error.response ? error.response.data : error.message);
  }
}

module.exports = { sendWaNotification };
