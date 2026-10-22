<?php

namespace App\Console\Commands;

use App\Models\User;
use App\UserRole;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

#[Signature('csirt:create-admin')]
#[Description('Create the first active CSIRT administrator account')]
class CreateInitialAdmin extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (User::query()->where('role', UserRole::Admin->value)->where('is_active', true)->exists()) {
            $this->components->error('An active admin account already exists.');

            return self::FAILURE;
        }

        $name = $this->ask('Nama petugas');
        $email = mb_strtolower(trim((string) $this->ask('Email petugas')));
        $password = $this->secret('Kata sandi');
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::min(12)->letters()->numbers()],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        User::query()->create([
            ...$validator->validated(),
            'role' => UserRole::Admin,
            'is_active' => true,
        ]);

        $this->components->info('Initial admin account created successfully.');

        return self::SUCCESS;
    }
}
