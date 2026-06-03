const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Dokumen = sequelize.define('Dokumen', {
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
  kartu_keluarga_url: { type: DataTypes.STRING, allowNull: false },
  kartu_keluarga_status: { 
    type: DataTypes.ENUM('Menunggu', 'Valid', 'Tidak Valid'),
    defaultValue: 'Menunggu'
  },
  kartu_keluarga_catatan: { type: DataTypes.TEXT },

  akta_kelahiran_url: { type: DataTypes.STRING, allowNull: false },
  akta_kelahiran_status: { 
    type: DataTypes.ENUM('Menunggu', 'Valid', 'Tidak Valid'),
    defaultValue: 'Menunggu'
  },
  akta_kelahiran_catatan: { type: DataTypes.TEXT },

  foto_diri_url: { type: DataTypes.STRING, allowNull: false },
  foto_diri_status: { 
    type: DataTypes.ENUM('Menunggu', 'Valid', 'Tidak Valid'),
    defaultValue: 'Menunggu'
  },
  foto_diri_catatan: { type: DataTypes.TEXT }
}, {
  tableName: 'dokumen',
  timestamps: false
});

module.exports = Dokumen;
