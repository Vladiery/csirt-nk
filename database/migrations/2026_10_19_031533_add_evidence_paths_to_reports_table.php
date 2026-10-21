<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->json('evidence_paths')->nullable()->after('evidence_path');
        });
    }

    /**
     * Reverse the migrations.
     *
     * Dropping this column removes saved evidence paths; uploaded files remain on disk.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn('evidence_paths');
        });
    }
};
