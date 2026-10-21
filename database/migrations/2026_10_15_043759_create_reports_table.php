<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->uuid('tracking_code')->unique();
            $table->string('reporter_name')->nullable();
            $table->string('reporter_email')->nullable();
            $table->string('category', 100);
            $table->string('subject');
            $table->text('description');
            $table->string('affected_url')->nullable();
            $table->timestamp('occurred_at')->nullable();
            $table->string('evidence_path')->nullable();
            $table->string('status', 30)->default('received')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
