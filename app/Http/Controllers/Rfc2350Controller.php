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
        return Inertia::render('Welcome', [
            'page' => 'rfc2350',
            'rfcDocument' => [
                'version' => DB::table('rfc_documents')->where('id', 1)->value('version') ?? '1.10',
            ],
        ]);
    }

    public function download(): HttpResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();
        $version = $document->version ?? '1.10';
        $downloadName = "RFC2350_ID_NK_V{$version}.pdf";

        if ($document !== null) {
            abort_unless(Storage::disk('public')->exists($document->file_path), 404);

            return Storage::disk('public')->download($document->file_path, $downloadName);
        }

        $defaultDocument = public_path('documents/RFC2350_ID_NK_V1.10.pdf');
        abort_unless(is_file($defaultDocument), 404);

        return response()->download($defaultDocument, $downloadName);
    }
}
