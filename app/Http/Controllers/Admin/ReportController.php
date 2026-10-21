<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    private const STATUSES = ['received', 'triage', 'investigating', 'resolved', 'closed'];

    public function index(): Response
    {
        Gate::authorize('viewAny', Report::class);

        $reports = Report::query()
            ->latest()
            ->get(['id', 'subject', 'category', 'status', 'created_at']);

        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'reports',
            'reports' => $reports,
        ]);
    }

    public function show(Report $report): Response
    {
        Gate::authorize('view', $report);

        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'reportDetail',
            'report' => [
                'id' => $report->id,
                'subject' => $report->subject,
                'category' => $report->category,
                'status' => $report->status,
                'created_at' => $report->created_at?->toISOString(),
                'reporter_name' => $report->reporter_name,
                'reporter_email' => $report->reporter_email,
                'description' => $report->description,
                'affected_url' => $report->affected_url,
                'occurred_at' => $report->occurred_at?->toISOString(),
                'handling_notes' => $report->handling_notes,
                'evidence' => collect($report->evidence_paths ?? [])->map(fn (string $path): string => basename($path)),
            ],
            'statuses' => self::STATUSES,
        ]);
    }

    public function update(Request $request, Report $report): RedirectResponse
    {
        Gate::authorize('update', $report);

        $validated = $request->validate([
            'status' => ['required', Rule::in(self::STATUSES)],
            'handling_notes' => ['nullable', 'string', 'max:20000'],
        ]);

        $report->fill($validated)->save();

        return back()->with('adminStatus', 'Penanganan laporan berhasil diperbarui.');
    }
}
