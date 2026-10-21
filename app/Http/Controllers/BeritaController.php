<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    public function index(): Response
    {
        $berita = Berita::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('Berita/Index', [
            'page' => 'berita',
            'berita' => $berita,
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
