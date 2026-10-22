<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'period' => ['nullable', 'in:all,30days,year'],
            'sort' => ['nullable', 'in:newest,oldest'],
        ]);
        $search = trim($filters['search'] ?? '');
        $period = $filters['period'] ?? 'all';
        $sort = $filters['sort'] ?? 'newest';

        $query = Artikel::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());

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

        $artikel = $query
            ->orderBy('published_at', $sort === 'oldest' ? 'asc' : 'desc')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Artikel/Index', [
            'page' => 'artikel',
            'artikel' => $artikel,
            'filters' => compact('search', 'period', 'sort'),
        ]);
    }

    public function show(Artikel $artikel): Response
    {
        abort_unless(
            $artikel->status === 'published'
                && $artikel->published_at !== null
                    && $artikel->published_at->lte(now()),
            404,
        );

        $recommendations = Artikel::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where('id', '!=', $artikel->getKey())
            ->latest('published_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'summary', 'image_path', 'published_at']);

        return Inertia::render('Artikel/Show', [
            'page' => 'artikel',
            'selectedItem' => $artikel->only(['id', 'title', 'slug', 'summary', 'content', 'image_path', 'published_at']),
            'recommendations' => $recommendations,
        ]);
    }
}
