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

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Report::class);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(self::STATUSES)],
            'category' => ['nullable', 'string', 'max:100'],
            'period' => ['nullable', 'in:all,7days,30days'],
        ]);
        $search = trim($filters['search'] ?? '');
        $status = $filters['status'] ?? '';
        $category = $filters['category'] ?? '';
        $period = $filters['period'] ?? 'all';

        $query = Report::query();

        if ($search !== '') {
            $term = mb_strtolower($search);
            $query->where(fn ($builder) => $builder
                ->whereRaw('LOWER(subject) LIKE ?', ["%{$term}%"])
                ->orWhereRaw('LOWER(category) LIKE ?', ["%{$term}%"]));
        }

        $query->when($status !== '', fn ($builder) => $builder->where('status', $status));
        $query->when($category !== '', fn ($builder) => $builder->where('category', $category));

        if ($period === '7days') {
            $query->where('created_at', '>=', now()->subDays(7));
        } elseif ($period === '30days') {
            $query->where('created_at', '>=', now()->subDays(30));
        }

        $reports = $query
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Report $report): array => [
                'id' => $report->id,
                'subject' => $report->subject,
                'category' => $report->category,
                'status' => $report->status,
                'created_at' => $report->created_at,
            ]);

        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'reports',
            'reports' => $reports,
            'filters' => compact('search', 'status', 'category', 'period'),
            'categories' => Report::query()->distinct()->orderBy('category')->pluck('category'),
            'statuses' => self::STATUSES,
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
