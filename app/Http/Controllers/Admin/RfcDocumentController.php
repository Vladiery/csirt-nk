<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
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
                'version' => $document?->version ?? '1.10',
                'english_version' => $document?->english_version ?? '1.10',
                'indonesian_path' => $document?->file_path,
                'english_path' => $document?->english_file_path,
                'pgp_path' => $document?->pgp_file_path,
                'updated_at' => $document?->updated_at
                    ? Carbon::parse($document->updated_at)->timezone('Asia/Jakarta')->format('d/m/Y H:i')
                    : null,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'document' => ['nullable', 'file', 'mimes:pdf', 'mimetypes:application/pdf', 'extensions:pdf', 'max:20480'],
            'version' => ['required_with:document', 'nullable', 'string', 'max:20', 'regex:/\A[A-Za-z0-9][A-Za-z0-9._-]{0,19}\z/'],
            'english_document' => ['nullable', 'file', 'mimes:pdf', 'mimetypes:application/pdf', 'extensions:pdf', 'max:20480'],
            'english_version' => ['required_with:english_document', 'nullable', 'string', 'max:20', 'regex:/\A[A-Za-z0-9][A-Za-z0-9._-]{0,19}\z/'],
            'pgp_key' => ['nullable', 'file', 'mimes:pdf', 'mimetypes:application/pdf', 'extensions:pdf', 'max:20480'],
        ]);

        $uploads = array_filter(['document', 'english_document', 'pgp_key'], fn (string $field): bool => $request->hasFile($field));
        $validator->after(function ($validator) use ($uploads): void {
            if (count($uploads) !== 1) {
                $validator->errors()->add('document', 'Unggah tepat satu file PDF dalam satu kali penyimpanan.');
            }
        });
        $validated = $validator->validate();

        $current = DB::table('rfc_documents')->where('id', 1)->first();
        $updates = ['uploaded_by' => $request->user()->id];
        foreach (['document' => 'file_path', 'english_document' => 'english_file_path', 'pgp_key' => 'pgp_file_path'] as $input => $column) {
            if ($request->hasFile($input)) {
                $directory = $input === 'pgp_key' ? 'rfc2350/pgp' : 'rfc2350';
                $newPath = $request->file($input)->store($directory, 'public');
                abort_if($newPath === false, 500, 'File dokumen gagal disimpan.');
                $updates[$column] = $newPath;

                if ($input === 'document') {
                    $updates['version'] = $validated['version'];
                } elseif ($input === 'english_document') {
                    $updates['english_version'] = $validated['english_version'];
                }
            }
        }
        $now = now();

        DB::table('rfc_documents')->updateOrInsert(
            ['id' => 1],
            array_merge([
                'file_path' => $current?->file_path,
                'version' => $current?->version ?? '1.10',
                'english_file_path' => $current?->english_file_path,
                'english_version' => $current?->english_version ?? '1.10',
                'pgp_file_path' => $current?->pgp_file_path,
                'created_at' => $current?->created_at ?? $now,
            ], $updates, ['updated_at' => $now]),
        );

        foreach (['document' => 'file_path', 'english_document' => 'english_file_path', 'pgp_key' => 'pgp_file_path'] as $input => $column) {
            if (isset($updates[$column]) && $current?->{$column} !== null) {
                Storage::disk('public')->delete($current->{$column});
            }
        }

        return back()->with('adminStatus', 'File RFC 2350 dan kunci PGP berhasil diperbarui.');
    }
}
