<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 20);
            $table->string('name', 100);
            $table->string('slug', 120);
            $table->timestamps();
            $table->unique(['type', 'slug']);
        });

        Schema::create('content_tags', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 20);
            $table->string('name', 60);
            $table->string('slug', 80);
            $table->timestamps();
            $table->unique(['type', 'slug']);
        });

        Schema::create('content_taggables', function (Blueprint $table): void {
            $table->foreignId('tag_id')->constrained('content_tags')->cascadeOnDelete();
            $table->string('taggable_type');
            $table->unsignedBigInteger('taggable_id');
            $table->primary(['tag_id', 'taggable_type', 'taggable_id']);
            $table->index(['taggable_type', 'taggable_id']);
        });

        Schema::table('berita', function (Blueprint $table): void {
            $table->foreignId('category_id')->nullable()->after('image_path')->constrained('content_categories')->nullOnDelete();
        });

        Schema::table('artikel', function (Blueprint $table): void {
            $table->foreignId('category_id')->nullable()->after('image_path')->constrained('content_categories')->nullOnDelete();
        });

        Schema::create('content_revisions', function (Blueprint $table): void {
            $table->id();
            $table->string('content_type', 20);
            $table->unsignedBigInteger('content_id');
            $table->json('snapshot');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['content_type', 'content_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_revisions');
        Schema::table('artikel', fn (Blueprint $table) => $table->dropConstrainedForeignId('category_id'));
        Schema::table('berita', fn (Blueprint $table) => $table->dropConstrainedForeignId('category_id'));
        Schema::dropIfExists('content_taggables');
        Schema::dropIfExists('content_tags');
        Schema::dropIfExists('content_categories');
    }
};
