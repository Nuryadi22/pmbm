const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrangTua = sequelize.define('OrangTua', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_siswa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'siswa',
      key: 'id'
    }
  },
  // Data Ayah
  ayah_nama: { type: DataTypes.STRING },
  ayah_nik: { type: DataTypes.STRING(16) },
  ayah_pekerjaan: { type: DataTypes.STRING },
  ayah_penghasilan: { type: DataTypes.STRING },
  ayah_no_wa: { type: DataTypes.STRING },
  // Data Ibu
  ibu_nama: { type: DataTypes.STRING },
  ibu_nik: { type: DataTypes.STRING(16) },
  ibu_pekerjaan: { type: DataTypes.STRING },
  ibu_penghasilan: { type: DataTypes.STRING },
  ibu_no_wa: { type: DataTypes.STRING },
  // Data Wali
  wali_nama: { type: DataTypes.STRING },
  wali_nik: { type: DataTypes.STRING(16) },
  wali_pekerjaan: { type: DataTypes.STRING },
  wali_penghasilan: { type: DataTypes.STRING },
  wali_no_wa: { type: DataTypes.STRING },
  
  no_wa_utama: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'orang_tua',
  timestamps: false
});

module.exports = OrangTua;
