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

        return Inertia::render('Welcome', [
            'page' => 'rfc2350',
            'rfcDocument' => [
                'version' => $document?->version ?? '1.10',
                'englishVersion' => $document?->english_version ?? '1.10',
                'indonesianAvailable' => filled($document?->file_path) && Storage::disk('public')->exists($document->file_path)
                    || is_file(public_path('documents/RFC2350_ID_NK_V1.10.pdf')),
                'englishAvailable' => $document?->english_file_path !== null && Storage::disk('public')->exists($document->english_file_path),
                'pgpAvailable' => $document?->pgp_file_path !== null && Storage::disk('public')->exists($document->pgp_file_path),
            ],
        ]);
    }

    public function download(): HttpResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        $version = $document?->version ?? '1.10';
        $downloadName = "RFC2350_ID_NK_V{$version}.pdf";

        if (filled($document?->file_path)) {
            abort_unless(Storage::disk('public')->exists($document->file_path), 404);

            return Storage::disk('public')->download($document->file_path, $downloadName);
        }

        $defaultDocument = public_path('documents/RFC2350_ID_NK_V1.10.pdf');
        abort_unless(is_file($defaultDocument), 404);

        return response()->download($defaultDocument, $downloadName);
    }

    public function downloadEnglish(): HttpResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        abort_unless($document?->english_file_path !== null, 404);
        abort_unless(Storage::disk('public')->exists($document->english_file_path), 404);

        return Storage::disk('public')->download($document->english_file_path, 'RFC2350_EN_NK_V'.($document->english_version ?? '1.10').'.pdf');
    }

    public function downloadPgpKey(): HttpResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        abort_unless($document?->pgp_file_path !== null, 404);
        abort_unless(Storage::disk('public')->exists($document->pgp_file_path), 404);

        return Storage::disk('public')->download($document->pgp_file_path, 'CSIRT-NINDYA-PGP-Public-Key.pdf');
    }
}
