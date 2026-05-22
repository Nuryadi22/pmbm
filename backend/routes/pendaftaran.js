const express = require('express');
const router = express.Router();
const Siswa = require('../models/Siswa');
const OrangTua = require('../models/OrangTua');
const Dokumen = require('../models/Dokumen');
const upload = require('../middleware/upload');
const Settings = require('../models/Settings');
const { sendWaNotification } = require('../utils/fonnte');

const { Op } = require('sequelize');

// GET /api/pendaftaran/cek-status
router.get('/cek-status', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.json({ registrationOpen: true, schoolYear: '2026/2027' });
    }
    res.json({ 
      registrationOpen: settings.registrationOpen, 
      schoolYear: settings.schoolYear 
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

// GET /api/pendaftaran/status/:no_registrasi
router.get('/status/:no_registrasi', async (req, res) => {
  try {
    const { nik } = req.query;
    if (!nik) return res.status(400).json({ message: 'NIK wajib diisi untuk keamanan' });

    const siswa = await Siswa.findOne({ 
      where: { 
        no_registrasi: req.params.no_registrasi, 
        nik 
      } 
    });
    
    if (!siswa) {
      return res.status(404).json({ message: 'Data tidak ditemukan. Pastikan No. Registrasi dan NIK benar.' });
    }

    // Trigger WA secara asinkron untuk konfirmasi status (Lolos / Gagal)
    if (siswa.status === 'Lolos' || siswa.status === 'Gagal') {
      (async () => {
        try {
          const orangTua = await OrangTua.findOne({ where: { id_siswa: siswa.id } });
          if (orangTua && orangTua.no_wa_utama) {
            const settings = await Settings.findOne() || {};
            let template = '';
            if (siswa.status === 'Lolos') {
              template = settings.statusMessageLolos || 'Selamat {nama}! Anda dinyatakan *DITERIMA* di MI Cikembulan. Silakan datang ke sekolah untuk proses selanjutnya.';
            } else if (siswa.status === 'Gagal') {
              template = settings.statusMessageGagal || 'Halo {nama}, mohon maaf pendaftaran Anda di MI Cikembulan *TIDAK DITERIMA*. Terima kasih telah mendaftar, semoga sukses di tempat lain.';
            }
            
            const pesanWa = template
              .replace(/{nama}/g, siswa.nama_lengkap)
              .replace(/{no_reg}/g, siswa.no_registrasi);
              
            await sendWaNotification(orangTua.no_wa_utama, pesanWa);
          }
        } catch (err) {
          console.error('Gagal mengirim WA konfirmasi status:', err);
        }
      })();
    }

    res.json(siswa);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

// POST /api/pendaftaran
router.post('/', upload.fields([{ name: 'kk_file', maxCount: 1 }, { name: 'akta_file', maxCount: 1 }, { name: 'foto_file', maxCount: 1 }]), async (req, res) => {
  try {
    const { nik, nama_lengkap } = req.body;
    
    // Generate no_registrasi
    const tahun = new Date().getFullYear();
    const lastSiswa = await Siswa.findOne({ 
      where: { 
        no_registrasi: { [Op.like]: `PMBM-${tahun}-%` } 
      },
      order: [['no_registrasi', 'DESC']]
    });
    
    let nextNum = 1;
    if (lastSiswa && lastSiswa.no_registrasi) {
      const lastNum = parseInt(lastSiswa.no_registrasi.split('-').pop(), 10);
      nextNum = lastNum + 1;
    }
    const no_registrasi = `PMBM-${tahun}-${String(nextNum).padStart(4, '0')}`;
    
    const newSiswa = await Siswa.create({
      no_registrasi,
      nik: req.body.nik,
      nama_lengkap: req.body.nama_lengkap,
      jenis_kelamin: req.body.jenis_kelamin,
      tempat_lahir: req.body.tempat_lahir,
      tanggal_lahir: req.body.tanggal_lahir,
      asal_sekolah: req.body.asal_sekolah,
      provinsi: req.body.provinsi_name,
      kabupaten: req.body.kabupaten_name,
      kecamatan: req.body.kecamatan_name,
      desa: req.body.desa_name,
      rt: req.body.rt,
      rw: req.body.rw,
      alamat_detail: req.body.alamat_detail,
      status: 'Pending'
    });
    
    await OrangTua.create({
      id_siswa: newSiswa.id,
      ayah_nama: req.body.nama_ayah,
      ibu_nama: req.body.nama_ibu,
      no_wa_utama: req.body.no_wa_utama
    });

    const kkUrl = req.files && req.files['kk_file'] ? req.files['kk_file'][0].path : '';
    const aktaUrl = req.files && req.files['akta_file'] ? req.files['akta_file'][0].path : '';
    const fotoUrl = req.files && req.files['foto_file'] ? req.files['foto_file'][0].path : '';

    await Dokumen.create({
      id_siswa: newSiswa.id,
      kartu_keluarga_url: kkUrl,
      akta_kelahiran_url: aktaUrl,
      foto_diri_url: fotoUrl
    });

    // Trigger WA secara asinkron
    (async () => {
      try {
        const settings = await Settings.findOne() || {};
        const welcomeTemplate = settings.welcomeMessage || 'Halo {nama}, pendaftaran PMBM Anda dengan No. Reg *{no_reg}* berhasil diterima.';
        const pesanWa = welcomeTemplate.replace(/{nama}/g, newSiswa.nama_lengkap).replace(/{no_reg}/g, no_registrasi);
        await sendWaNotification(req.body.no_wa_utama, pesanWa);
      } catch (err) {
        console.error('WA Notification Error:', err);
      }
    })();
    
    res.status(201).json({ message: 'Pendaftaran berhasil dikirim', no_registrasi, siswa: newSiswa });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Pendaftaran gagal: NIK tersebut sudah pernah didaftarkan sebelumnya.' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

module.exports = router;
