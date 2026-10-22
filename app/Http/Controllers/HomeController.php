<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Berita;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $berita = Berita::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->limit(3)
            ->get(['title', 'slug', 'summary', 'image_path', 'published_at'])
            ->map(fn (Berita $item): array => [
                'type' => 'Berita',
                'title' => $item->title,
                'summary' => $item->summary,
                'imagePath' => $item->image_path,
                'publishedAt' => $item->published_at->toISOString(),
                'url' => route('berita.show', ['berita' => $item->slug], absolute: false),
            ]);

        $artikel = Artikel::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->limit(3)
            ->get(['title', 'slug', 'summary', 'image_path', 'published_at'])
            ->map(fn (Artikel $item): array => [
                'type' => 'Artikel',
                'title' => $item->title,
                'summary' => $item->summary,
                'imagePath' => $item->image_path,
                'publishedAt' => $item->published_at->toISOString(),
                'url' => route('artikel.show', ['artikel' => $item->slug], absolute: false),
            ]);

        $highlights = $berita
            ->concat($artikel)
            ->sortByDesc('publishedAt')
            ->take(3)
            ->values();

        return Inertia::render('Welcome', [
            'highlights' => $highlights,
        ]);
    }
}
