<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_handling_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('report_id')->constrained()->cascadeOnDelete();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('event', 40);
            $table->json('changes')->nullable();
            $table->timestamps();
            $table->index(['report_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_handling_events');
    }
};
