<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Berita;
use App\Models\Report;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $reportsByStatus = Report::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn (Report $report): array => [
                'status' => $report->status,
                'total' => (int) $report->total,
            ]);

        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'dashboard',
            'stats' => [
                'berita' => Berita::query()->count(),
                'artikel' => Artikel::query()->count(),
                'reports' => Report::query()->count(),
                'unhandledReports' => Report::query()
                    ->whereIn('status', ['received', 'triage', 'investigating'])
                    ->count(),
                'reportsByStatus' => $reportsByStatus,
            ],
        ]);
    }
}
