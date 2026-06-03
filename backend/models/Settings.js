const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  schoolYear: { type: DataTypes.STRING, defaultValue: '2026/2027' },
  registrationOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
  maxQuota: { type: DataTypes.INTEGER, defaultValue: 100 },
  fonnteToken: { type: DataTypes.STRING, defaultValue: '' },
  whatsappAdmin: { type: DataTypes.STRING, defaultValue: '' },
  welcomeMessage: { 
    type: DataTypes.TEXT, 
    defaultValue: 'Halo {nama}, pendaftaran PMBM Anda dengan No. Reg *{no_reg}* berhasil diterima. Silakan pantau pengumuman secara berkala.' 
  },
  statusMessageLolos: { 
    type: DataTypes.TEXT, 
    defaultValue: 'Selamat {nama}! Anda dinyatakan *DITERIMA* di MI Cikembulan. Silakan datang ke sekolah untuk proses selanjutnya.' 
  },
  statusMessageGagal: { 
    type: DataTypes.TEXT, 
    defaultValue: 'Halo {nama}, mohon maaf pendaftaran Anda di MI Cikembulan *TIDAK DITERIMA*. Terima kasih telah mendaftar, semoga sukses di tempat lain.' 
  },
  checkStatusStartDate: {
    type: DataTypes.DATEONLY,
    defaultValue: null
  },
  checkStatusEndDate: {
    type: DataTypes.DATEONLY,
    defaultValue: null
  },
  jadwal: {
    type: DataTypes.JSON,
    defaultValue: [
      { gelombang: 'Gelombang 1', dibuka: '', ditutup: '', mulaiKegiatan: '', pengumuman: '' },
      { gelombang: 'Gelombang 2', dibuka: '', ditutup: '', mulaiKegiatan: '', pengumuman: '' }
    ]
  }
}, {
  tableName: 'settings',
  timestamps: true
});

module.exports = Settings;
