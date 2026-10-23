<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class ContentTag extends Model
{
    protected $fillable = ['type', 'name', 'slug'];

    public function berita(): MorphToMany
    {
        return $this->morphedByMany(Berita::class, 'taggable', 'content_taggables', 'tag_id');
    }

    public function artikel(): MorphToMany
    {
        return $this->morphedByMany(Artikel::class, 'taggable', 'content_taggables', 'tag_id');
    }
}
