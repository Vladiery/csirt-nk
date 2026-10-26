<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportHandlingEvent extends Model
{
    protected $fillable = ['report_id', 'actor_id', 'event', 'changes'];

    protected function casts(): array
    {
        return ['changes' => 'array'];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
