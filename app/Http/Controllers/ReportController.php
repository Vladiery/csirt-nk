<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Mail\IncidentReportMail;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class ReportController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Welcome', [
            'page' => 'report',
        ]);
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $report = new Report($request->safe()->only([
            'reporter_name',
            'reporter_email',
            'category',
            'subject',
            'description',
            'affected_url',
            'occurred_at',
        ]));

        $report->tracking_code = (string) Str::uuid();
        $storedPaths = [];

        try {
            $report->evidence_paths = collect($request->file('evidence', []))
                ->map(function (UploadedFile $file) use (&$storedPaths): array {
                    $path = $file->store('reports/evidence', 'local');

                    if (! is_string($path)) {
                        throw new RuntimeException('Unable to store report evidence.');
                    }

                    $storedPaths[] = $path;
                    $name = basename(str_replace('\\', '/', $file->getClientOriginalName()));
                    $name = preg_replace('/[\x00-\x1F\x7F]/', '', $name) ?: 'bukti.'.($file->guessExtension() ?: 'bin');

                    return [
                        'path' => $path,
                        'name' => $name,
                        'mime' => $file->getMimeType() ?: 'application/octet-stream',
                        'size' => $file->getSize(),
                    ];
                })
                ->all();
            $report->save();
        } catch (Throwable $exception) {
            if ($storedPaths !== []) {
                Storage::disk('local')->delete($storedPaths);
            }

            throw $exception;
        }

        try {
            Mail::to(config('mail.report_address'))->send(new IncidentReportMail($report));
        } catch (Throwable $exception) {
            report($exception);
        }

        return to_route('reports.create')->with('reportTrackingCode', $report->tracking_code);
    }
}
