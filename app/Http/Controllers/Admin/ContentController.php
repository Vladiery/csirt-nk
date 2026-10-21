<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Berita;
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
    public function index(string $type): Response
    {
        $model = $this->contentModel($type);

        return Inertia::render('Welcome', [
            'page' => 'admin',
            'adminSection' => 'content',
            'contentType' => $type,
            'items' => $model->newQuery()
                ->latest('updated_at')
                ->paginate(10)
                ->through(fn (Model $item): array => [
                    'id' => $item->getKey(),
                    'title' => $item->getAttribute('title'),
                    'summary' => $item->getAttribute('summary'),
                    'content' => $item->getAttribute('content'),
                    'image_path' => $item->getAttribute('image_path'),
                    'status' => $item->getAttribute('status'),
                    'published_at' => $item->getAttribute('published_at')?->timezone('Asia/Jakarta')->format('Y-m-d\\TH:i'),
                ]),
        ]);
    }

    public function store(Request $request, string $type): RedirectResponse
    {
        $model = $this->contentModel($type);
        $validated = $this->validateContent($request);
        $image = $validated['image'] ?? null;
        unset($validated['image']);

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

        $model->newQuery()->create($validated);

        return back()->with('adminStatus', 'Konten berhasil dibuat.');
    }

    public function update(Request $request, string $type, int $id): RedirectResponse
    {
        $model = $this->contentModel($type);
        $item = $model->newQuery()->findOrFail($id);
        $validated = $this->validateContent($request);
        $image = $validated['image'] ?? null;
        unset($validated['image']);
        $validated['slug'] = $this->uniqueSlug($model, $validated['title'], $item);
        $publishedAt = $validated['published_at'] ?? null;
        $validated['published_at'] = $validated['status'] === 'published'
            ? (filled($publishedAt)
                ? Carbon::createFromFormat('Y-m-d\\TH:i', $publishedAt, 'Asia/Jakarta')->utc()
                : $item->getAttribute('published_at') ?? now())
            : null;

        $previousImagePath = $item->getAttribute('image_path');

        if ($image !== null) {
            $validated['image_path'] = $image->store("content/{$type}", 'public');
        }

        $item->update($validated);

        if ($image !== null) {
            $this->deleteStoredImage($previousImagePath);
        }

        return back()->with('adminStatus', 'Konten berhasil diperbarui.');
    }

    public function destroy(string $type, int $id): RedirectResponse
    {
        $item = $this->contentModel($type)->newQuery()->findOrFail($id);
        $imagePath = $item->getAttribute('image_path');
        $item->delete();
        $this->deleteStoredImage($imagePath);

        return back()->with('adminStatus', 'Konten berhasil dihapus.');
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
        ])->validate();
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
