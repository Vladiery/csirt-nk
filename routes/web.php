<?php

use App\Http\Controllers\Admin\ContentController as AdminContentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\RfcDocumentController as AdminRfcDocumentController;
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\ArtikelController;
use App\Http\Controllers\Auth\StaffAuthController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Rfc2350Controller;
use App\Http\Controllers\ServicesController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/profil', ProfileController::class)->name('profile');
Route::get('/rfc2350', Rfc2350Controller::class)->name('rfc2350');
Route::get('/rfc2350/download', [Rfc2350Controller::class, 'download'])->name('rfc2350.download');
Route::get('/rfc2350/download/english', [Rfc2350Controller::class, 'downloadEnglish'])->name('rfc2350.download.english');
Route::get('/rfc2350/download/pgp', [Rfc2350Controller::class, 'downloadPgpKey'])->name('rfc2350.download.pgp');
Route::get('/layanan', ServicesController::class)->name('services');
Route::get('/kontak', ContactController::class)->name('contact');
Route::post('/kontak', [ContactController::class, 'send'])
    ->middleware('throttle:5,1')
    ->name('contact.send');

Route::get('/login', [StaffAuthController::class, 'create'])->name('login');
Route::post('/login', [StaffAuthController::class, 'store'])
    ->name('login.store');
Route::post('/logout', [StaffAuthController::class, 'destroy'])
    ->middleware(['auth', 'active.staff'])
    ->name('logout');

Route::middleware(['auth', 'active.staff'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', fn () => to_route('admin.dashboard'))->name('index');

    Route::middleware('staff.role:admin')->group(function (): void {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/content/{type}', [AdminContentController::class, 'index'])->name('content.index');
        Route::post('/content/{type}', [AdminContentController::class, 'store'])->name('content.store');
        Route::put('/content/{type}/{id}', [AdminContentController::class, 'update'])->name('content.update');
        Route::delete('/content/{type}/{id}', [AdminContentController::class, 'destroy'])->name('content.destroy');
        Route::get('/staff', [AdminStaffController::class, 'index'])->name('staff.index');
        Route::post('/staff', [AdminStaffController::class, 'store'])->name('staff.store');
        Route::patch('/staff/{user}', [AdminStaffController::class, 'update'])->name('staff.update');
        Route::delete('/staff/{user}', [AdminStaffController::class, 'destroy'])->name('staff.destroy');
        Route::get('/rfc2350', [AdminRfcDocumentController::class, 'index'])->name('rfc2350.index');
        Route::post('/rfc2350/document', [AdminRfcDocumentController::class, 'update'])->name('rfc2350.update');
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/{report}', [AdminReportController::class, 'show'])->name('reports.show');
        Route::get('/reports/{report}/evidence/{index}', [AdminReportController::class, 'downloadEvidence'])
            ->whereNumber('index')
            ->name('reports.evidence');
        Route::patch('/reports/{report}', [AdminReportController::class, 'update'])->name('reports.update');
    });
});

Route::get('/berita', [BeritaController::class, 'index'])->middleware('throttle:60,1')->name('berita.index');
Route::get('/berita/{berita:slug}', [BeritaController::class, 'show'])->name('berita.show');

Route::get('/artikel', [ArtikelController::class, 'index'])->middleware('throttle:60,1')->name('artikel.index');
Route::get('/artikel/{artikel:slug}', [ArtikelController::class, 'show'])->name('artikel.show');

Route::get('/laporan-insiden', [ReportController::class, 'create'])->name('reports.create');
Route::post('/laporan-insiden', [ReportController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('reports.store');
