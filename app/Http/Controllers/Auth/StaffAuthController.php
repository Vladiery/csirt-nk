<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StaffAuthController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->is_active && $request->user()->role === UserRole::Admin) {
            return to_route('admin.dashboard');
        }

        return Inertia::render('Welcome', [
            'page' => 'login',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if ($request->user()?->is_active && $request->user()->role === UserRole::Admin) {
            return to_route('admin.dashboard');
        }

        $request->merge(['email' => mb_strtolower(trim((string) $request->input('email')))]);

        $credentials = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        $limiterKey = 'staff-login:'.hash('sha256', $credentials['email'].'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($limiterKey, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Terlalu banyak percobaan masuk. Coba lagi dalam '.RateLimiter::availableIn($limiterKey).' detik.',
            ]);
        }

        if (! Auth::attempt($credentials + [
            'is_active' => true,
            'role' => UserRole::Admin->value,
        ])) {
            RateLimiter::hit($limiterKey, 60);

            throw ValidationException::withMessages([
                'email' => 'Email, kata sandi, atau status akun tidak sesuai.',
            ]);
        }

        RateLimiter::clear($limiterKey);
        $request->session()->regenerate();

        return to_route('admin.dashboard');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('home');
    }
}
