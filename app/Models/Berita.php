<?php

namespace App\Models;

use Database\Factories\BeritaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'slug', 'summary', 'content', 'image_path', 'status', 'published_at'])]
class Berita extends Model
{
    /** @use HasFactory<BeritaFactory> */
    use HasFactory;

    protected $table = 'berita';

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
