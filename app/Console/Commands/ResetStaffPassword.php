<?php

namespace App\Console\Commands;

use App\Models\User;
use App\UserRole;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

#[Signature('csirt:reset-admin-password {email}')]
#[Description('Reset an active CSIRT administrator password')]
class ResetStaffPassword extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = mb_strtolower(trim((string) $this->argument('email')));
        $user = User::query()
            ->where('email', $email)
            ->where('role', UserRole::Admin->value)
            ->where('is_active', true)
            ->first();

        if ($user === null) {
            $this->components->error('Admin aktif dengan email tersebut tidak ditemukan.');

            return self::FAILURE;
        }

        $password = $this->secret('Kata sandi baru');
        $passwordConfirmation = $this->secret('Ulangi kata sandi baru');
        $validator = Validator::make([
            'password' => $password,
            'password_confirmation' => $passwordConfirmation,
        ], [
            'password' => ['required', 'string', 'max:255', 'confirmed'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        $user->password = $validator->validated()['password'];
        $user->save();

        $this->components->info('Kata sandi admin berhasil diperbarui.');

        return self::SUCCESS;
    }
}
