<?php

namespace App\Models;

use Database\Factories\ReportFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'reporter_name',
    'reporter_email',
    'category',
    'subject',
    'description',
    'affected_url',
    'occurred_at',
    'evidence_paths',
    'status',
    'assigned_to_id',
    'handling_notes',
])]
#[Hidden(['reporter_name', 'reporter_email', 'description', 'affected_url', 'evidence_path', 'evidence_paths', 'handling_notes', 'assigned_to_id'])]
class Report extends Model
{
    /** @use HasFactory<ReportFactory> */
    use HasFactory;

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
            'evidence_paths' => 'array',
        ];
    }
}
