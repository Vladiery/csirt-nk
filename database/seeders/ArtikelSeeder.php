<?php

namespace Database\Seeders;

use App\Models\Artikel;
use Illuminate\Database\Seeder;

class ArtikelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Waspada Phishing Berkedok Undangan dan Dokumen Kerja',
                'slug' => 'waspada-phishing-berkedok-undangan-dan-dokumen-kerja',
                'summary' => 'Kenali ciri pesan phishing yang menyamar sebagai undangan rapat atau dokumen kerja sebelum membuka tautan dan lampiran.',
                'content' => "Pesan phishing dapat menyamar sebagai undangan rapat, pemberitahuan dokumen, atau permintaan pembaruan akun. Periksa alamat pengirim dan tujuan tautan sebelum membuka lampiran atau memasukkan kredensial.\n\nJangan membagikan kata sandi atau kode verifikasi melalui tautan yang dikirim lewat pesan. Jika menerima pesan mencurigakan, laporkan melalui kanal resmi organisasi agar dapat ditindaklanjuti.",
            ],
            [
                'title' => 'Pembaruan Sistem Berkala Membantu Mengurangi Risiko Siber',
                'slug' => 'pembaruan-sistem-berkala-membantu-mengurangi-risiko-siber',
                'summary' => 'Pembaruan perangkat lunak membantu menutup celah keamanan dan menjaga sistem tetap mendapat perlindungan terbaru.',
                'content' => "Sistem operasi, aplikasi, dan perangkat jaringan yang tidak diperbarui dapat memiliki kerentanan yang telah diketahui publik. Terapkan pembaruan keamanan sesuai prosedur dan jadwal pemeliharaan organisasi.\n\nSebelum pembaruan pada sistem penting, lakukan pencadangan dan pastikan proses perubahan telah diuji serta disetujui. Hindari mengunduh pembaruan dari situs atau tautan yang tidak resmi.",
            ],
            [
                'title' => 'Lindungi Akun Kerja dengan Kata Sandi Unik dan Verifikasi Berlapis',
                'slug' => 'lindungi-akun-kerja-dengan-kata-sandi-unik-dan-verifikasi-berlapis',
                'summary' => 'Gunakan kata sandi berbeda untuk setiap layanan dan aktifkan autentikasi multifaktor jika tersedia.',
                'content' => "Kata sandi yang digunakan ulang dapat membuat beberapa akun berisiko ketika salah satu layanan mengalami kebocoran. Gunakan kata sandi unik untuk setiap akun dan simpan dengan aman menggunakan pengelola kata sandi yang disetujui organisasi.\n\nAktifkan autentikasi multifaktor jika tersedia. Jangan pernah membagikan kata sandi atau kode verifikasi, dan segera laporkan aktivitas masuk yang tidak dikenal.",
            ],
        ];

        foreach ($articles as $article) {
            Artikel::query()->firstOrCreate(
                ['slug' => $article['slug']],
                [
                    ...$article,
                    'image_path' => null,
                    'status' => 'published',
                    'published_at' => now(),
                ],
            );
        }
    }
}
