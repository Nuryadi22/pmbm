const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Siswa = sequelize.define('Siswa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  no_registrasi: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nik: {
    type: DataTypes.STRING(16),
    unique: true,
    allowNull: false
  },
  nama_lengkap: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jenis_kelamin: {
    type: DataTypes.ENUM('L', 'P')
  },
  tempat_lahir: {
    type: DataTypes.STRING
  },
  tanggal_lahir: {
    type: DataTypes.DATEONLY
  },
  asal_sekolah: {
    type: DataTypes.STRING
  },
  lat: {
    type: DataTypes.FLOAT
  },
  lng: {
    type: DataTypes.FLOAT
  },
  provinsi: {
    type: DataTypes.STRING
  },
  kabupaten: {
    type: DataTypes.STRING
  },
  kecamatan: {
    type: DataTypes.STRING
  },
  desa: {
    type: DataTypes.STRING
  },
  rt: {
    type: DataTypes.STRING
  },
  rw: {
    type: DataTypes.STRING
  },
  alamat_detail: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Lolos', 'Gagal'),
    defaultValue: 'Pending'
  },
  tanggal_daftar: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'siswa',
  timestamps: false
});

module.exports = Siswa;
