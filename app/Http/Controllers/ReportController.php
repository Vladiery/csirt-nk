<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Mail\IncidentReportMail;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
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
        $report->evidence_paths = collect($request->file('evidence', []))
            ->map(function (UploadedFile $file): string {
                $path = $file->store('reports/evidence', 'local');

                if (! is_string($path)) {
                    throw new RuntimeException('Unable to store report evidence.');
                }

                return $path;
            })
            ->all();
        $report->save();

        $mailStatus = 'sent';

        try {
            Mail::to(config('mail.report_address'))->send(new IncidentReportMail($report));

            if (config('mail.default') === 'log') {
                $mailStatus = 'logged';
            }
        } catch (Throwable $exception) {
            report($exception);
            $mailStatus = 'failed';
        }

        return to_route('reports.create')->with([
            'reportTrackingCode' => $report->tracking_code,
            'reportMailStatus' => $mailStatus,
        ]);
    }
}
