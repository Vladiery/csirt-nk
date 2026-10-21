<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'staff',
            'staff' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'role', 'is_active']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge(['email' => mb_strtolower(trim((string) $request->input('email')))]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'max:255', 'confirmed'],
            'is_active' => ['required', 'boolean'],
        ]);

        User::query()->create($validated + ['role' => UserRole::Admin]);

        return back()->with('adminStatus', 'Akun petugas berhasil dibuat.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $request->merge(['email' => mb_strtolower(trim((string) $request->input('email')))]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'is_active' => ['required', 'boolean'],
            'password' => ['nullable', 'string', 'max:255', 'confirmed'],
        ]);

        abort_if($request->user()->is($user) && ! $validated['is_active'], 422, 'Anda tidak dapat menonaktifkan akun sendiri.');

        if ($user->role === UserRole::Analyst) {
            $validated['is_active'] = false;
        }

        DB::transaction(function () use ($user, $validated): void {
            if ($user->role === UserRole::Admin && $user->is_active && ! $validated['is_active']) {
                $anotherActiveAdminExists = User::query()
                    ->whereKeyNot($user->id)
                    ->where('role', UserRole::Admin->value)
                    ->where('is_active', true)
                    ->exists();

                abort_unless($anotherActiveAdminExists, 422, 'Minimal harus ada satu admin aktif.');
            }

            if (blank($validated['password'])) {
                unset($validated['password']);
            }

            $user->update($validated);
        });

        return back()->with('adminStatus', 'Akun petugas berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->is($user), 422, 'Anda tidak dapat menghapus akun sendiri.');

        if ($user->role === UserRole::Admin && $user->is_active) {
            $anotherActiveAdminExists = User::query()
                ->whereKeyNot($user->id)
                ->where('role', UserRole::Admin->value)
                ->where('is_active', true)
                ->exists();

            abort_unless($anotherActiveAdminExists, 422, 'Minimal harus ada satu admin aktif.');
        }

        $user->delete();

        return back()->with('adminStatus', 'Akun petugas berhasil dihapus.');
    }
}
