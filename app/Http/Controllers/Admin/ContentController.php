<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Berita;
use App\Models\ContentCategory;
use App\Models\ContentRevision;
use App\Models\ContentTag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function index(Request $request, string $type): Response
    {
        $model = $this->contentModel($type);
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['draft', 'published', 'scheduled'])],
            'category' => ['nullable', 'string', 'max:120'],
            'period' => ['nullable', Rule::in(['all', '30days', 'year'])],
            'sort' => ['nullable', Rule::in(['newest', 'oldest'])],
        ]);
        $search = trim($filters['search'] ?? '');
        $status = $filters['status'] ?? '';
        $category = $filters['category'] ?? '';
        $period = $filters['period'] ?? 'all';
        $sort = $filters['sort'] ?? 'newest';
        $query = $model->newQuery();

        if ($search !== '') {
            $term = mb_strtolower($search);
            $query->where(fn ($builder) => $builder
                ->whereRaw('LOWER(title) LIKE ?', ["%{$term}%"])
                ->orWhereRaw('LOWER(summary) LIKE ?', ["%{$term}%"])
                ->orWhereRaw('LOWER(content) LIKE ?', ["%{$term}%"]));
        }

        if ($status === 'scheduled') {
            $query->where('status', 'published')->where('published_at', '>', now());
        } elseif ($status === 'published') {
            $query->where('status', 'published')->where('published_at', '<=', now());
        } elseif ($status === 'draft') {
            $query->where('status', 'draft');
        }
        $query->when($category !== '', fn ($builder) => $builder->whereHas('category', fn ($categories) => $categories->where('slug', $category)));

        if ($period === '30days') {
            $query->where('created_at', '>=', now()->subDays(30));
        } elseif ($period === 'year') {
            $query->where('created_at', '>=', now()->subYear());
        }

        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'content',
            'contentType' => $type,
            'items' => $query
                ->orderBy('updated_at', $sort === 'oldest' ? 'asc' : 'desc')
                ->with(['category', 'tags'])
                ->paginate(20)
                ->withQueryString()
                ->through(fn (Model $item): array => [
                    'id' => $item->getKey(),
                    'title' => $item->getAttribute('title'),
                    'summary' => $item->getAttribute('summary'),
                    'content' => $item->getAttribute('content'),
                    'image_path' => $item->getAttribute('image_path'),
                    'category' => $item->category?->only(['id', 'name', 'slug']),
                    'tags' => $item->tags->map(fn (ContentTag $tag): array => $tag->only(['id', 'name', 'slug']))->all(),
                    'status' => $item->getAttribute('status'),
                    'published_at' => $item->getAttribute('published_at')?->timezone('Asia/Jakarta')->format('Y-m-d\\TH:i'),
                ]),
            'filters' => compact('search', 'status', 'category', 'period', 'sort'),
            'contentCategories' => ContentCategory::query()->where('type', $type)->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request, string $type): RedirectResponse
    {
        $model = $this->contentModel($type);
        $validated = $this->validateContent($request);
        $image = $validated['image'] ?? null;
        $categoryName = $validated['category'] ?? '';
        $tagNames = $this->parseTags($validated['tags'] ?? '');
        unset($validated['image']);
        unset($validated['category'], $validated['tags']);

        if ($image !== null) {
            $validated['image_path'] = $image->store("content/{$type}", 'public');
        }

        $validated['slug'] = $this->uniqueSlug($model, $validated['title']);
        $publishedAt = $validated['published_at'] ?? null;
        $validated['published_at'] = $validated['status'] === 'published'
            ? (filled($publishedAt)
                ? Carbon::createFromFormat('Y-m-d\\TH:i', $publishedAt, 'Asia/Jakarta')->utc()
                : now())
            : null;

        $item = $model->newQuery()->create($validated);
        $this->syncTaxonomy($item, $type, $categoryName, $tagNames);

        return back()->with('adminStatus', 'Konten berhasil dibuat.');
    }

    public function update(Request $request, string $type, int $id): RedirectResponse
    {
        $model = $this->contentModel($type);
        $item = $model->newQuery()->findOrFail($id);
        $validated = $this->validateContent($request);
        $image = $validated['image'] ?? null;
        $categoryName = $validated['category'] ?? '';
        $tagNames = $this->parseTags($validated['tags'] ?? '');
        unset($validated['image']);
        unset($validated['category'], $validated['tags']);
        $validated['slug'] = $this->uniqueSlug($model, $validated['title'], $item);
        $publishedAt = $validated['published_at'] ?? null;
        $validated['published_at'] = $validated['status'] === 'published'
            ? (filled($publishedAt)
                ? Carbon::createFromFormat('Y-m-d\\TH:i', $publishedAt, 'Asia/Jakarta')->utc()
                : $item->getAttribute('published_at') ?? now())
            : null;

        if ($image !== null) {
            $validated['image_path'] = $image->store("content/{$type}", 'public');
        }

        $this->saveRevision($item, $type, (int) $request->user()->getKey());
        $item->update($validated);
        $this->syncTaxonomy($item, $type, $categoryName, $tagNames);

        return back()->with('adminStatus', 'Konten berhasil diperbarui.');
    }

    public function destroy(string $type, int $id): RedirectResponse
    {
        $item = $this->contentModel($type)->newQuery()->findOrFail($id);
        $imagePath = $item->getAttribute('image_path');
        $revisionImages = ContentRevision::query()
            ->where('content_type', $type)
            ->where('content_id', $id)
            ->get(['snapshot'])
            ->map(fn (ContentRevision $revision): ?string => $revision->snapshot['image_path'] ?? null)
            ->filter()
            ->all();
        ContentRevision::query()->where('content_type', $type)->where('content_id', $id)->delete();
        $item->tags()->detach();
        $item->delete();
        foreach (array_unique(array_merge([$imagePath], $revisionImages)) as $path) {
            $this->deleteStoredImage($path);
        }

        return back()->with('adminStatus', 'Konten berhasil dihapus.');
    }

    public function revisions(string $type, int $id)
    {
        $item = $this->contentModel($type)->newQuery()->findOrFail($id);
        $revisions = ContentRevision::query()
            ->where('content_type', $type)
            ->where('content_id', $item->getKey())
            ->latest()
            ->get(['id', 'snapshot', 'created_by', 'created_at'])
            ->map(fn (ContentRevision $revision): array => [
                'id' => $revision->id,
                'title' => $revision->snapshot['title'] ?? '(tanpa judul)',
                'summary' => $revision->snapshot['summary'] ?? '',
                'created_by' => $revision->created_by,
                'created_at' => $revision->created_at?->toISOString(),
            ]);

        return response()->json(['revisions' => $revisions]);
    }

    public function restoreRevision(Request $request, string $type, int $id, int $revision): RedirectResponse
    {
        $model = $this->contentModel($type);
        $item = $model->newQuery()->findOrFail($id);
        $selected = ContentRevision::query()
            ->where('content_type', $type)
            ->where('content_id', $item->getKey())
            ->findOrFail($revision);
        $snapshot = $selected->snapshot;
        $snapshot['slug'] = $this->uniqueSlug($model, $snapshot['title'], $item);
        $this->saveRevision($item, $type, (int) $request->user()->getKey());
        $item->update(collect($snapshot)->only(['title', 'slug', 'summary', 'content', 'image_path', 'status', 'published_at'])->all());
        $this->syncTaxonomy($item, $type, $snapshot['category'] ?? '', $snapshot['tags'] ?? []);

        return back()->with('adminStatus', 'Versi konten berhasil dipulihkan. Versi sebelumnya tetap tersimpan di riwayat.');
    }

    private function contentModel(string $type): Model
    {
        return match ($type) {
            'berita' => new Berita,
            'artikel' => new Artikel,
            default => abort(404),
        };
    }

    /**
     * @return array<string, mixed>
     */
    private function validateContent(Request $request): array
    {
        return Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:2000'],
            'content' => ['required', 'string', 'max:100000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date_format:Y-m-d\\TH:i'],
            'category' => ['nullable', 'string', 'max:120'],
            'tags' => ['nullable', 'string', 'max:1000'],
        ])->validate();
    }

    private function saveRevision(Model $item, string $type, int $userId): void
    {
        $item->loadMissing(['category', 'tags']);
        ContentRevision::query()->create([
            'content_type' => $type,
            'content_id' => $item->getKey(),
            'created_by' => $userId,
            'snapshot' => [
                'title' => $item->getAttribute('title'),
                'slug' => $item->getAttribute('slug'),
                'summary' => $item->getAttribute('summary'),
                'content' => $item->getAttribute('content'),
                'image_path' => $item->getAttribute('image_path'),
                'status' => $item->getAttribute('status'),
                'published_at' => $item->getAttribute('published_at')?->toISOString(),
                'category' => $item->category?->name ?? '',
                'tags' => $item->tags->pluck('name')->all(),
            ],
        ]);
    }

    private function syncTaxonomy(Model $item, string $type, string $categoryName, array $tagNames): void
    {
        $categoryName = trim($categoryName);
        $category = $categoryName === '' ? null : ContentCategory::query()->firstOrCreate(
            ['type' => $type, 'slug' => Str::slug($categoryName) ?: Str::random(8)],
            ['name' => $categoryName],
        );
        $item->setAttribute('category_id', $category?->getKey());
        $item->save();

        $tagIds = collect($tagNames)
            ->map(fn (string $name) => ContentTag::query()->firstOrCreate(
                ['type' => $type, 'slug' => Str::slug($name) ?: Str::random(8)],
                ['name' => $name],
            )->getKey())
            ->all();
        $item->tags()->sync($tagIds);
    }

    private function parseTags(string|array $tags): array
    {
        return collect(is_array($tags) ? $tags : explode(',', $tags))
            ->map(fn ($tag): string => trim((string) $tag))
            ->filter()
            ->unique(fn (string $tag): string => mb_strtolower($tag))
            ->take(10)
            ->values()
            ->all();
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path !== null && ! Str::startsWith($path, ['http://', 'https://', '/'])) {
            Storage::disk('public')->delete($path);
        }
    }

    private function uniqueSlug(Model $model, string $title, ?Model $ignore = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $suffix = 2;

        while ($model->newQuery()->where('slug', $slug)
            ->when($ignore !== null, fn ($query) => $query->whereKeyNot($ignore->getKey()))
            ->exists()) {
            $slug = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
