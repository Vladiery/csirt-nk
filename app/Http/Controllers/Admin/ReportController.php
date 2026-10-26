<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportHandlingEvent;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
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
                ->orWhereRaw('LOWER(category) LIKE ?', ["%{$term}%"])
                ->orWhereRaw('CAST(tracking_code AS VARCHAR) LIKE ?', ["%{$term}%"]));
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
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Report $report): array => [
                'id' => $report->id,
                'tracking_code' => $report->tracking_code,
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
                'tracking_code' => $report->tracking_code,
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
                'assigned_to_id' => $report->assigned_to_id,
                'assigned_to_name' => $report->assignedTo?->name,
                'evidence' => collect($report->evidence_paths ?? [])->values()->map(function (string|array $item, int $index) use ($report): array {
                    $name = is_array($item) ? ($item['name'] ?? null) : null;

                    return [
                        'name' => is_string($name) && $name !== '' ? $name : 'Bukti lampiran '.($index + 1),
                        'url' => "/admin/reports/{$report->id}/evidence/{$index}",
                    ];
                }),
                'history' => ReportHandlingEvent::query()
                    ->with('actor:id,name')
                    ->where('report_id', $report->id)
                    ->oldest()
                    ->get()
                    ->map(fn (ReportHandlingEvent $event): array => [
                        'id' => $event->id,
                        'event' => $event->event,
                        'changes' => $event->changes ?? [],
                        'actor' => $event->actor?->name ?? 'Sistem',
                        'created_at' => $event->created_at?->toISOString(),
                    ]),
            ],
            'statuses' => self::STATUSES,
            'assignees' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'role']),
        ]);
    }

    public function update(Request $request, Report $report): RedirectResponse
    {
        Gate::authorize('update', $report);

        $validated = $request->validate([
            'status' => ['required', Rule::in(self::STATUSES)],
            'handling_notes' => ['nullable', 'string', 'max:20000'],
            'assigned_to_id' => ['nullable', Rule::exists('users', 'id')->where('is_active', true)],
        ]);

        $changes = [];
        foreach ($validated as $field => $value) {
            $oldValue = $report->getAttribute($field);
            if ((string) ($oldValue ?? '') !== (string) ($value ?? '')) {
                if ($field === 'assigned_to_id') {
                    $oldValue = $oldValue ? User::query()->whereKey($oldValue)->value('name') : null;
                    $value = $value ? User::query()->whereKey($value)->value('name') : null;
                }
                $changes[$field] = ['old' => $oldValue, 'new' => $value];
            }
        }

        if ($changes !== []) {
            DB::transaction(function () use ($report, $validated, $request, $changes): void {
                $report->fill($validated)->save();
                ReportHandlingEvent::query()->create([
                    'report_id' => $report->id,
                    'actor_id' => $request->user()->id,
                    'event' => 'updated',
                    'changes' => $changes,
                ]);
            });
        }

        return back()->with('adminStatus', 'Penanganan laporan berhasil diperbarui.');
    }

    public function downloadEvidence(Report $report, int $index): StreamedResponse
    {
        Gate::authorize('view', $report);

        $evidence = array_values($report->evidence_paths ?? [])[$index] ?? null;
        $path = is_array($evidence) ? ($evidence['path'] ?? null) : $evidence;
        abort_unless(is_string($path) && str_starts_with($path, 'reports/evidence/'), 404);

        $disk = Storage::disk('local');
        abort_unless($disk->exists($path), 404);

        $originalName = is_array($evidence) ? ($evidence['name'] ?? null) : null;
        $filename = is_string($originalName) && $originalName !== ''
            ? basename(str_replace('\\', '/', $originalName))
            : 'bukti-'.($index + 1).'.'.(pathinfo($path, PATHINFO_EXTENSION) ?: 'bin');
        $filename = preg_replace('/[\x00-\x1F\x7F]/', '', $filename) ?: 'bukti-'.($index + 1).'.bin';

        return $disk->download($path, $filename, [
            'Content-Type' => $disk->mimeType($path) ?: 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store',
        ]);
    }

    public function markNotificationRead(Request $request, string $notification): RedirectResponse
    {
        $item = $request->user()->notifications()->whereKey($notification)->firstOrFail();
        $item->markAsRead();

        return back();
    }
}
