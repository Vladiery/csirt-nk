<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    public function index(): Response
    {
        $artikel = Artikel::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('Artikel/Index', [
            'page' => 'artikel',
            'artikel' => $artikel,
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
            'artikel' => $artikel,
            'selectedItem' => $artikel,
            'recommendations' => $recommendations,
        ]);
    }
}
