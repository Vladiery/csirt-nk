<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class RfcDocumentController extends Controller
{
    public function index(): InertiaResponse
    {
        $document = DB::table('rfc_documents')->where('id', 1)->first();

        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'rfcDocument',
            'rfcDocument' => [
                'version' => $document->version ?? '1.10',
                'updated_at' => $document?->updated_at
                    ? Carbon::parse($document->updated_at)->timezone('Asia/Jakarta')->format('d/m/Y H:i')
                    : null,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'document' => ['required', 'file', 'mimes:pdf', 'mimetypes:application/pdf', 'max:20480'],
            'version' => ['required', 'string', 'max:20', 'regex:/\A[A-Za-z0-9][A-Za-z0-9._-]{0,19}\z/'],
        ]);

        $current = DB::table('rfc_documents')->where('id', 1)->first();
        $newPath = $request->file('document')->store('rfc2350', 'public');
        abort_if($newPath === false, 500, 'Dokumen RFC 2350 gagal disimpan.');
        $now = now();

        DB::table('rfc_documents')->updateOrInsert(
            ['id' => 1],
            [
                'file_path' => $newPath,
                'version' => $validated['version'],
                'uploaded_by' => $request->user()->id,
                'created_at' => $current?->created_at ?? $now,
                'updated_at' => $now,
            ],
        );

        if ($current !== null) {
            Storage::disk('public')->delete($current->file_path);
        }

        return back()->with('adminStatus', 'Dokumen RFC 2350 berhasil diperbarui.');
    }
}
