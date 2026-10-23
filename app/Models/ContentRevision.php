<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentRevision extends Model
{
    protected $fillable = ['content_type', 'content_id', 'snapshot', 'created_by'];

    protected function casts(): array
    {
        return ['snapshot' => 'array'];
    }
}
