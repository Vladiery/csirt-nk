<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\ContentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'period' => ['nullable', 'in:all,30days,year'],
            'sort' => ['nullable', 'in:newest,oldest'],
            'category' => ['nullable', 'string', 'max:120'],
        ]);
        $search = trim($filters['search'] ?? '');
        $period = $filters['period'] ?? 'all';
        $sort = $filters['sort'] ?? 'newest';
        $category = $filters['category'] ?? '';

        $query = Berita::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
        $query->when($category !== '', fn ($builder) => $builder->whereHas('category', fn ($categories) => $categories->where('slug', $category)));

        if ($search !== '') {
            $term = mb_strtolower($search);
            $pattern = '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $term).'%';
            $query->where(fn ($builder) => $builder
                ->whereRaw("LOWER(title) LIKE ? ESCAPE '!'", [$pattern])
                ->orWhereRaw("LOWER(summary) LIKE ? ESCAPE '!'", [$pattern])
                ->orWhereRaw("LOWER(content) LIKE ? ESCAPE '!'", [$pattern]));
        }

        if ($period === '30days') {
            $query->where('published_at', '>=', now()->subDays(30));
        } elseif ($period === 'year') {
            $query->where('published_at', '>=', now()->subYear());
        }

        $berita = $query
            ->orderBy('published_at', $sort === 'oldest' ? 'asc' : 'desc')
            ->with(['category', 'tags'])
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Berita/Index', [
            'page' => 'berita',
            'berita' => $berita,
            'filters' => compact('search', 'period', 'sort', 'category'),
            'contentCategories' => ContentCategory::query()->where('type', 'berita')->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function show(Berita $berita): Response
    {
        abort_unless(
            $berita->status === 'published'
                && $berita->published_at !== null
                    && $berita->published_at->lte(now()),
            404,
        );

        $recommendations = Berita::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where('id', '!=', $berita->getKey())
            ->latest('published_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'summary', 'image_path', 'published_at']);

        return Inertia::render('Berita/Show', [
            'page' => 'berita',
            'selectedItem' => $berita->only(['id', 'title', 'slug', 'summary', 'content', 'image_path', 'published_at']),
            'contentCategory' => $berita->category?->only(['name', 'slug']),
            'contentTags' => $berita->tags()->orderBy('name')->get(['name', 'slug']),
            'recommendations' => $recommendations,
        ]);
    }
}
