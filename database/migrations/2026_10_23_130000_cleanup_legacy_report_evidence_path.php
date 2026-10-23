<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('reports')
            ->whereNotNull('evidence_path')
            ->orderBy('id')
            ->chunkById(100, function ($reports): void {
                foreach ($reports as $report) {
                    $legacyPath = trim((string) $report->evidence_path);
                    if ($legacyPath === '') {
                        continue;
                    }

                    $paths = json_decode((string) ($report->evidence_paths ?? '[]'), true);
                    $paths = is_array($paths) ? array_values($paths) : [];
                    $alreadyIncluded = collect($paths)->contains(
                        fn ($entry): bool => (is_array($entry) ? ($entry['path'] ?? null) : $entry) === $legacyPath,
                    );

                    if (! $alreadyIncluded) {
                        $paths[] = [
                            'path' => $legacyPath,
                            'name' => basename(str_replace('\\', '/', $legacyPath)),
                        ];
                    }

                    DB::table('reports')->where('id', $report->id)->update([
                        'evidence_paths' => json_encode($paths, JSON_THROW_ON_ERROR),
                    ]);
                }
            });

        Schema::table('reports', function (Blueprint $table): void {
            $table->dropColumn('evidence_path');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table): void {
            $table->string('evidence_path')->nullable();
        });

        DB::table('reports')
            ->whereNotNull('evidence_paths')
            ->orderBy('id')
            ->chunkById(100, function ($reports): void {
                foreach ($reports as $report) {
                    $paths = json_decode((string) $report->evidence_paths, true);
                    $first = is_array($paths) ? ($paths[0] ?? null) : null;
                    $legacyPath = is_array($first) ? ($first['path'] ?? null) : $first;

                    if (is_string($legacyPath) && $legacyPath !== '') {
                        DB::table('reports')->where('id', $report->id)->update(['evidence_path' => $legacyPath]);
                    }
                }
            });
    }
};
