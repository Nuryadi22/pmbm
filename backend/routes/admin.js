const express = require("express");
const router = express.Router();
const Siswa = require("../models/Siswa");
const OrangTua = require("../models/OrangTua");
const Dokumen = require("../models/Dokumen");
const Settings = require("../models/Settings");
const { sendWaNotification } = require("../utils/fonnte");
const jwt = require("jsonwebtoken");

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded kredensial admin untuk versi awal
  if (username === "admin" && password === "Abditam@22") {
    const token = jwt.sign(
      { id: "admin1", role: "admin" },
      process.env.JWT_SECRET || "secret_admin_key",
      { expiresIn: "1d" },
    );
    res.json({ token, user: { username: "admin", name: "Nuryadi" } });
  } else {
    res.status(401).json({ message: "Username atau password salah" });
  }
});

// Middleware otentikasi admin seharusnya ada di sini, tapi di-skip untuk versi awal.

router.get("/dashboard", async (req, res) => {
  try {
    const pending = await Siswa.count({ where: { status: "Pending" } });
    const lolos = await Siswa.count({ where: { status: "Lolos" } });
    const gagal = await Siswa.count({ where: { status: "Gagal" } });
    const total = pending + lolos + gagal;

    // Dummy tren harian
    const trenHarian = {
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      data: [12, 19, 3, 5, 2, 3, 10],
    };

    res.json({ stats: { total, pending, lolos, gagal }, trenHarian });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/pendaftar", async (req, res) => {
  try {
    const siswa = await Siswa.findAll({ order: [['tanggal_daftar', 'DESC']] });
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/pendaftar/:id/verifikasi", async (req, res) => {
  try {
    const { status, catatan } = req.body;
    console.log(`[Admin Verifikasi] ID: ${req.params.id}, Status: ${status}, Catatan: ${catatan}`);
    
    await Siswa.update({ status }, { where: { id: req.params.id } });
    const siswa = await Siswa.findByPk(req.params.id);
    if (!siswa) {
      console.log(`[Admin Verifikasi] Siswa dengan ID ${req.params.id} tidak ditemukan.`);
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    console.log(`[Admin Verifikasi] Status siswa berhasil diperbarui menjadi: ${siswa.status}`);
    res.json(siswa);
  } catch (err) {
    console.error(`[Admin Verifikasi Error]`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/broadcast-pengumuman
router.post("/broadcast-pengumuman", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Pesan broadcast wajib diisi" });
    }

    const siswaList = await Siswa.findAll();
    console.log(`[Broadcast Pengumuman] Memulai broadcast untuk ${siswaList.length} siswa`);

    // Proses pengiriman secara asinkron (non-blocking)
    (async () => {
      let successCount = 0;
      let failCount = 0;
      for (const siswa of siswaList) {
        try {
          const orangTua = await OrangTua.findOne({ where: { id_siswa: siswa.id } });
          if (orangTua && orangTua.no_wa_utama) {
            const pesanPersonal = message
              .replace(/{nama}/g, siswa.nama_lengkap)
              .replace(/{no_reg}/g, siswa.no_registrasi);

            await sendWaNotification(orangTua.no_wa_utama, pesanPersonal);
            successCount++;
          } else {
            console.log(`[Broadcast] Siswa ${siswa.nama_lengkap} (ID: ${siswa.id}) tidak memiliki nomor WA utama.`);
            failCount++;
          }
        } catch (err) {
          console.error(`[Broadcast] Gagal kirim WA ke ID ${siswa.id}:`, err);
          failCount++;
        }
      }
      console.log(`[Broadcast Selesai] Sukses: ${successCount}, Gagal: ${failCount}`);
    })();

    res.json({ 
      message: "Proses broadcast pengumuman telah dijalankan di latar belakang.",
      totalSiswa: siswaList.length 
    });
  } catch (err) {
    console.error(`[Broadcast Pengumuman Error]`, err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/pendaftar/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id);
    if (!siswa) return res.status(404).json({ message: "Siswa tidak ditemukan" });
    const orangTua = await OrangTua.findOne({ where: { id_siswa: req.params.id } });
    const dokumen = await Dokumen.findOne({ where: { id_siswa: req.params.id } });
    res.json({ siswa, orangTua, dokumen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/pendaftar/:id", async (req, res) => {
  try {
    await OrangTua.destroy({ where: { id_siswa: req.params.id } });
    await Dokumen.destroy({ where: { id_siswa: req.params.id } });
    await Siswa.destroy({ where: { id: req.params.id } });
    res.json({ message: "Data pendaftar berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      await Settings.create(req.body);
      settings = await Settings.findOne();
    } else {
      await Settings.update(req.body, { where: { id: settings.id } });
      settings = await Settings.findOne();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
