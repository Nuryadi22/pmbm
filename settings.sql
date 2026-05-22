-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 23 Apr 2026 pada 05.07
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pmbm_micikembulan`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `schoolYear` varchar(255) DEFAULT '2026/2027',
  `registrationOpen` tinyint(1) DEFAULT 1,
  `maxQuota` int(11) DEFAULT 100,
  `fonnteToken` varchar(255) DEFAULT '',
  `whatsappAdmin` varchar(255) DEFAULT '',
  `welcomeMessage` text DEFAULT NULL,
  `statusMessageLolos` text DEFAULT NULL,
  `statusMessageGagal` text DEFAULT NULL,
  `jadwal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`jadwal`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `settings`
--

INSERT INTO `settings` (`id`, `schoolYear`, `registrationOpen`, `maxQuota`, `fonnteToken`, `whatsappAdmin`, `welcomeMessage`, `statusMessageLolos`, `statusMessageGagal`, `jadwal`, `createdAt`, `updatedAt`) VALUES
(1, '2026/2027', 1, 100, '', '', 'Halo {nama}, pendaftaran PMBM Anda dengan No. Reg *{no_reg}* berhasil diterima. Silakan pantau pengumuman secara berkala.', 'Selamat {nama}! Anda dinyatakan *DITERIMA* di MI Cikembulan. Silakan datang ke sekolah untuk proses selanjutnya.', 'Halo {nama}, mohon maaf pendaftaran Anda di MI Cikembulan *TIDAK DITERIMA*. Terima kasih telah mendaftar, semoga sukses di tempat lain.', '[{\"gelombang\":\"Gelombang 1\",\"dibuka\":\"\",\"ditutup\":\"\",\"mulaiKegiatan\":\"\"},{\"gelombang\":\"Gelombang 2\",\"dibuka\":\"\",\"ditutup\":\"\",\"mulaiKegiatan\":\"\"}]', '2026-04-23 03:02:00', '2026-04-23 03:02:00');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
