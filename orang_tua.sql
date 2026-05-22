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
-- Struktur dari tabel `orang_tua`
--

CREATE TABLE `orang_tua` (
  `id` int(11) NOT NULL,
  `id_siswa` int(11) NOT NULL,
  `ayah_nama` varchar(255) DEFAULT NULL,
  `ayah_nik` varchar(16) DEFAULT NULL,
  `ayah_pekerjaan` varchar(255) DEFAULT NULL,
  `ayah_penghasilan` varchar(255) DEFAULT NULL,
  `ayah_no_wa` varchar(255) DEFAULT NULL,
  `ibu_nama` varchar(255) DEFAULT NULL,
  `ibu_nik` varchar(16) DEFAULT NULL,
  `ibu_pekerjaan` varchar(255) DEFAULT NULL,
  `ibu_penghasilan` varchar(255) DEFAULT NULL,
  `ibu_no_wa` varchar(255) DEFAULT NULL,
  `wali_nama` varchar(255) DEFAULT NULL,
  `wali_nik` varchar(16) DEFAULT NULL,
  `wali_pekerjaan` varchar(255) DEFAULT NULL,
  `wali_penghasilan` varchar(255) DEFAULT NULL,
  `wali_no_wa` varchar(255) DEFAULT NULL,
  `no_wa_utama` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orang_tua`
--

INSERT INTO `orang_tua` (`id`, `id_siswa`, `ayah_nama`, `ayah_nik`, `ayah_pekerjaan`, `ayah_penghasilan`, `ayah_no_wa`, `ibu_nama`, `ibu_nik`, `ibu_pekerjaan`, `ibu_penghasilan`, `ibu_no_wa`, `wali_nama`, `wali_nik`, `wali_pekerjaan`, `wali_penghasilan`, `wali_no_wa`, `no_wa_utama`) VALUES
(1, 1, 'YAYAN WAHYAN', NULL, NULL, NULL, NULL, 'SUMARNI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '085862777511');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `orang_tua`
--
ALTER TABLE `orang_tua`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_siswa` (`id_siswa`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `orang_tua`
--
ALTER TABLE `orang_tua`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `orang_tua`
--
ALTER TABLE `orang_tua`
  ADD CONSTRAINT `orang_tua_ibfk_1` FOREIGN KEY (`id_siswa`) REFERENCES `siswa` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
