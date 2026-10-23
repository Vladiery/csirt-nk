<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContentCategory extends Model
{
    protected $fillable = ['type', 'name', 'slug'];

    public function berita(): HasMany
    {
        return $this->hasMany(Berita::class, 'category_id');
    }

    public function artikel(): HasMany
    {
        return $this->hasMany(Artikel::class, 'category_id');
    }
}
