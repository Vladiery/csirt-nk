<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
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
            'password' => ['required', 'confirmed', Password::min(12)->letters()->numbers()],
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
            'password' => ['nullable', 'confirmed', Password::min(12)->letters()->numbers()],
        ]);

        abort_if($request->user()->is($user) && ! $validated['is_active'], 422, 'Anda tidak dapat menonaktifkan akun sendiri.');

        if ($user->role === UserRole::Analyst) {
            $validated['is_active'] = false;
        }

        $passwordChanged = filled($validated['password'] ?? null);
        $accountDeactivated = $user->is_active && ! $validated['is_active'];

        DB::transaction(function () use ($request, $user, $validated, $passwordChanged, $accountDeactivated): void {
            if ($user->role === UserRole::Admin && $user->is_active && ! $validated['is_active']) {
                $this->ensureAnotherActiveAdminRemains($user);
            }

            if (blank($validated['password'])) {
                unset($validated['password']);
            }

            $user->update($validated);

            if ($passwordChanged || $accountDeactivated) {
                $this->revokeDatabaseSessions($user, $request->user()->is($user) ? $request->session()->getId() : null);
            }
        });

        return back()->with('adminStatus', 'Akun petugas berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->is($user), 422, 'Anda tidak dapat menghapus akun sendiri.');

        DB::transaction(function () use ($user): void {
            if ($user->role === UserRole::Admin && $user->is_active) {
                $this->ensureAnotherActiveAdminRemains($user);
            }

            $user->delete();
        });

        return back()->with('adminStatus', 'Akun petugas berhasil dihapus.');
    }

    private function ensureAnotherActiveAdminRemains(User $user): void
    {
        $activeAdminIds = User::query()
            ->where('role', UserRole::Admin->value)
            ->where('is_active', true)
            ->orderBy('id')
            ->lockForUpdate()
            ->pluck('id');

        $anotherActiveAdminExists = $activeAdminIds->contains(
            fn ($id): bool => (int) $id !== (int) $user->id,
        );

        abort_unless($anotherActiveAdminExists, 422, 'Minimal harus ada satu admin aktif.');
    }

    private function revokeDatabaseSessions(User $user, ?string $exceptSessionId = null): void
    {
        if (config('session.driver') !== 'database') {
            return;
        }

        $sessions = DB::connection(config('session.connection'))
            ->table(config('session.table', 'sessions'))
            ->where('user_id', $user->getKey());

        if ($exceptSessionId !== null) {
            $sessions->where('id', '!=', $exceptSessionId);
        }

        $sessions->delete();
    }
}
