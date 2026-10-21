<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->moveRecords('berita', 'artikel');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->moveRecords('artikel', 'berita');
    }

    private function moveRecords(string $source, string $destination): void
    {
        $slugs = [
            'waspada-phishing-berkedok-undangan-dan-dokumen-kerja',
            'pembaruan-sistem-berkala-membantu-mengurangi-risiko-siber',
            'lindungi-akun-kerja-dengan-kata-sandi-unik-dan-verifikasi-berlapis',
            'ancaman-siber-meningkat-ahli-imbau-masyarakat-dan-perusahaan-perkuat-sistem-keamanan-digital',
        ];

        DB::transaction(function () use ($source, $destination, $slugs): void {
            $records = DB::table($source)->whereIn('slug', $slugs)->get();

            foreach ($records as $record) {
                if (DB::table($destination)->where('slug', $record->slug)->exists()) {
                    throw new RuntimeException("Slug {$record->slug} already exists in {$destination}.");
                }

                $attributes = (array) $record;
                unset($attributes['id']);

                DB::table($destination)->insert($attributes);
                DB::table($source)->where('id', $record->id)->delete();
            }
        });
    }
};
