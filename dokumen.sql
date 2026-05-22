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
-- Struktur dari tabel `dokumen`
--

CREATE TABLE `dokumen` (
  `id` int(11) NOT NULL,
  `id_siswa` int(11) NOT NULL,
  `kartu_keluarga_url` varchar(255) NOT NULL,
  `kartu_keluarga_status` enum('Menunggu','Valid','Tidak Valid') DEFAULT 'Menunggu',
  `kartu_keluarga_catatan` text DEFAULT NULL,
  `akta_kelahiran_url` varchar(255) NOT NULL,
  `akta_kelahiran_status` enum('Menunggu','Valid','Tidak Valid') DEFAULT 'Menunggu',
  `akta_kelahiran_catatan` text DEFAULT NULL,
  `foto_diri_url` varchar(255) NOT NULL,
  `foto_diri_status` enum('Menunggu','Valid','Tidak Valid') DEFAULT 'Menunggu',
  `foto_diri_catatan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `dokumen`
--

INSERT INTO `dokumen` (`id`, `id_siswa`, `kartu_keluarga_url`, `kartu_keluarga_status`, `kartu_keluarga_catatan`, `akta_kelahiran_url`, `akta_kelahiran_status`, `akta_kelahiran_catatan`, `foto_diri_url`, `foto_diri_status`, `foto_diri_catatan`) VALUES
(1, 1, 'https://res.cloudinary.com/dxuakwnes/image/upload/v1776913477/ppdb_cikembulan_docs/fr4zekislil6b1tfj7dh.jpg', 'Menunggu', NULL, 'https://res.cloudinary.com/dxuakwnes/image/upload/v1776913478/ppdb_cikembulan_docs/nurrama6sszo5d43hjkd.jpg', 'Menunggu', NULL, 'https://res.cloudinary.com/dxuakwnes/image/upload/v1776913478/ppdb_cikembulan_docs/fccujyb8p0uzmd8tbtox.jpg', 'Menunggu', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `dokumen`
--
ALTER TABLE `dokumen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_siswa` (`id_siswa`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `dokumen`
--
ALTER TABLE `dokumen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `dokumen`
--
ALTER TABLE `dokumen`
  ADD CONSTRAINT `dokumen_ibfk_1` FOREIGN KEY (`id_siswa`) REFERENCES `siswa` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
