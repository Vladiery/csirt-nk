<?php

namespace App\Models;

use Database\Factories\ArtikelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

#[Fillable(['title', 'slug', 'summary', 'content', 'image_path', 'category_id', 'status', 'published_at'])]
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

    public function category(): BelongsTo
    {
        return $this->belongsTo(ContentCategory::class, 'category_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(ContentTag::class, 'taggable', 'content_taggables', 'taggable_id', 'tag_id');
    }
}
