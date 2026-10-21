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
        Schema::table('rfc_documents', function (Blueprint $table) {
            $table->string('english_file_path')->nullable();
            $table->string('pgp_file_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rfc_documents', function (Blueprint $table) {
            $table->dropColumn(['english_file_path', 'pgp_file_path']);
        });
    }
};
