<?php

namespace App\Models;

use Database\Factories\ArtikelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'slug', 'summary', 'content', 'image_path', 'status', 'published_at'])]
class Artikel extends Model
{
    /** @use HasFactory<ArtikelFactory> */
    use HasFactory;

    protected $table = 'artikel';

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
