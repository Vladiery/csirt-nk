<?php

namespace App\Http\Controllers;

use App\Models\Berita;
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
        ]);
        $search = trim($filters['search'] ?? '');
        $period = $filters['period'] ?? 'all';
        $sort = $filters['sort'] ?? 'newest';

        $query = Berita::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());

        if ($search !== '') {
            $term = mb_strtolower($search);
            $query->where(fn ($builder) => $builder
                ->whereRaw('LOWER(title) LIKE ?', ["%{$term}%"])
                ->orWhereRaw('LOWER(summary) LIKE ?', ["%{$term}%"])
                ->orWhereRaw('LOWER(content) LIKE ?', ["%{$term}%"]));
        }

        if ($period === '30days') {
            $query->where('published_at', '>=', now()->subDays(30));
        } elseif ($period === 'year') {
            $query->where('published_at', '>=', now()->subYear());
        }

        $berita = $query
            ->orderBy('published_at', $sort === 'oldest' ? 'asc' : 'desc')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Berita/Index', [
            'page' => 'berita',
            'berita' => $berita,
            'filters' => compact('search', 'period', 'sort'),
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
            'berita' => $berita,
            'selectedItem' => $berita,
            'recommendations' => $recommendations,
        ]);
    }
}
