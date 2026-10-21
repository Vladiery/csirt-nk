<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rfc_documents', function (Blueprint $table) {
            $table->string('english_version', 20)->nullable();
            $table->string('file_path')->nullable()->change();
            $table->string('version', 20)->nullable()->change();
        });

        DB::table('rfc_documents')->whereNull('english_version')->update(['english_version' => DB::raw('version')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('rfc_documents')->whereNull('file_path')->update(['file_path' => '']);
        DB::table('rfc_documents')->whereNull('version')->update(['version' => '1.10']);

        Schema::table('rfc_documents', function (Blueprint $table) {
            $table->dropColumn('english_version');
            $table->string('file_path')->nullable(false)->change();
            $table->string('version', 20)->nullable(false)->change();
        });
    }
};
