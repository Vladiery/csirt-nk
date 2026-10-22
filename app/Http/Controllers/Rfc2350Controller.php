<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class Rfc2350Controller extends Controller
{
    public function __invoke(): Response
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        $indonesian = $this->indonesianDocument($document);

        return Inertia::render('Welcome', [
            'page' => 'rfc2350',
            'rfcDocument' => [
                'version' => $indonesian['version'],
                'englishVersion' => $this->safeVersion($document?->english_version),
                'indonesianAvailable' => $indonesian['path'] !== null,
                'englishAvailable' => $document?->english_file_path !== null && Storage::disk('public')->exists($document->english_file_path),
                'pgpAvailable' => $document?->pgp_file_path !== null && Storage::disk('public')->exists($document->pgp_file_path),
            ],
        ]);
    }

    public function download(): HttpResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        $indonesian = $this->indonesianDocument($document);
        abort_unless($indonesian['path'] !== null, 404);

        $downloadName = "RFC2350_ID_NK_V{$indonesian['version']}.pdf";
        $response = $indonesian['disk'] === 'public'
            ? Storage::disk('public')->download($indonesian['path'], $downloadName)
            : response()->download($indonesian['path'], $downloadName);

        return $this->preventStaleCache($response);
    }

    public function downloadEnglish(): HttpResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        abort_unless($document?->english_file_path !== null, 404);
        abort_unless(Storage::disk('public')->exists($document->english_file_path), 404);

        return $this->preventStaleCache(Storage::disk('public')->download(
            $document->english_file_path,
            'RFC2350_EN_NK_V'.$this->safeVersion($document->english_version ?? null).'.pdf',
        ));
    }

    public function downloadPgpKey(): HttpResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        abort_unless($document?->pgp_file_path !== null, 404);
        abort_unless(Storage::disk('public')->exists($document->pgp_file_path), 404);

        return $this->preventStaleCache(Storage::disk('public')->download(
            $document->pgp_file_path,
            'CSIRT-NINDYA-PGP-Public-Key.pdf',
        ));
    }

    /** @return array{path: string|null, disk: string|null, version: string} */
    private function indonesianDocument(?object $document): array
    {
        if (filled($document?->file_path) && Storage::disk('public')->exists($document->file_path)) {
            return [
                'path' => $document->file_path,
                'disk' => 'public',
                'version' => $this->safeVersion($document->version ?? null),
            ];
        }

        $defaultDocument = public_path('documents/RFC2350_ID_NK_V1.10.pdf');
        if (is_file($defaultDocument)) {
            return ['path' => $defaultDocument, 'disk' => 'local', 'version' => '1.10'];
        }

        return [
            'path' => null,
            'disk' => null,
            'version' => $this->safeVersion($document?->version),
        ];
    }

    private function safeVersion(?string $version): string
    {
        $safeVersion = preg_replace('/[^A-Za-z0-9._-]/', '', $version ?? '');

        return filled($safeVersion) ? $safeVersion : '1.10';
    }

    private function preventStaleCache(HttpResponse $response): HttpResponse
    {
        $response->headers->set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }
}
