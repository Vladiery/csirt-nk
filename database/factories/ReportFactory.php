<?php

namespace Database\Factories;

use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tracking_code' => (string) Str::uuid(),
            'reporter_name' => fake()->name(),
            'reporter_email' => fake()->safeEmail(),
            'category' => fake()->randomElement(['phishing', 'malware', 'account_compromise', 'website_compromise']),
            'subject' => fake()->sentence(6),
            'description' => fake()->paragraphs(3, true),
            'affected_url' => fake()->url(),
            'occurred_at' => fake()->dateTimeBetween('-7 days', 'now'),
            'evidence_paths' => null,
            'status' => 'received',
        ];
    }
}
