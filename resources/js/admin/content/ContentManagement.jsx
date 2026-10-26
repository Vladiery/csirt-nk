import { useEffect, useRef, useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import ContentBody from '../../shared/ContentBody';
import { buttonClass, ConfirmDialog, Field, inputClass, labelClass, toDateTimeLocal } from '../shared';

export function ContentForm({ type, initial, onCancel, onSaved, contentCategories = [] }) {
    const editorRef = useRef(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
    const form = useForm({
        title: initial?.title ?? '',
        summary: initial?.summary ?? '',
        content: initial?.content ?? '',
        image: null,
        category: initial?.category?.name ?? '',
        tags: initial?.tags?.map((tag) => tag.name).join(', ') ?? '',
        status: initial?.status ?? 'draft',
        published_at: toDateTimeLocal(initial?.published_at),
    });
    const [data, setData] = [form.data, form.setData];

    function submit(event) {
        event.preventDefault();
        const url = `/admin/content/${type}${initial ? `/${initial.id}` : ''}`;
        form.transform((values) => initial ? { ...values, _method: 'put' } : values);
        form.post(url, {
            onSuccess: () => {
                if (initial) {
                    form.reset('image');
                } else {
                    form.reset();
                }

                onSaved();
            },
        });
    }

    const currentImageUrl = initial?.image_path
        ? initial.image_path.startsWith('http') || initial.image_path.startsWith('/')
            ? initial.image_path
            : `/storage/${initial.image_path}`
        : null;

    useEffect(() => {
        if (!form.data.image) {
            setUploadedImagePreview(null);
            return undefined;
        }
        const previewUrl = URL.createObjectURL(form.data.image);
        setUploadedImagePreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [form.data.image]);

    function wrapSelection(before, after = before) {
        const editor = editorRef.current;
        if (!editor) return;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selection = form.data.content.slice(start, end) || 'teks';
        const next = `${form.data.content.slice(0, start)}${before}${selection}${after}${form.data.content.slice(end)}`;
        setData('content', next);
        requestAnimationFrame(() => {
            editor.focus();
            editor.setSelectionRange(start + before.length, start + before.length + selection.length);
        });
    }

    return (
        <form className="max-h-[85vh] space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-[#111a2a] p-5" onSubmit={submit}>
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-white" id="content-form-title">{initial ? `Ubah ${type === 'berita' ? 'berita' : 'artikel'}` : `Tambah ${type === 'berita' ? 'berita' : 'artikel'}`}</h2><button aria-label="Tutup formulir" className="grid h-9 w-9 place-items-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white" onClick={onCancel} type="button">×</button></div>
            <Field error={form.errors.title} label="Judul" onChange={(event) => setData('title', event.target.value)} value={data.title} />
            <Field error={form.errors.category} label="Kategori (opsional)" list={`category-options-${type}`} onChange={(event) => setData('category', event.target.value)} placeholder="Contoh: Keamanan Akun" value={data.category} />
            <datalist id={`category-options-${type}`}>{contentCategories.map((category) => <option key={category.id} value={category.name} />)}</datalist>
            <Field error={form.errors.tags} label="Tag (pisahkan dengan koma, maksimal 10)" onChange={(event) => setData('tags', event.target.value)} placeholder="phishing, keamanan akun" value={data.tags} />
            <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Gambar sampul (opsional)</span><input accept="image/jpeg,image/png,image/webp" className={inputClass} onChange={(event) => setData('image', event.target.files?.[0] ?? null)} type="file" />{form.errors.image && <span className="mt-1 block text-xs text-rose-400">{form.errors.image}</span>}<span className="mt-1 block text-xs text-slate-400">JPG, PNG, atau WebP, maksimal 5 MB. Rekomendasi rasio gambar 16:9.{initial && currentImageUrl ? ' Pilih gambar baru jika ingin mengganti sampul.' : ''}</span></label>
            {(form.data.image || currentImageUrl) && <div className="flex items-center gap-3 rounded-lg border border-slate-700 p-3">{currentImageUrl && !form.data.image && <img alt="Sampul saat ini" className="h-16 w-24 rounded object-cover" src={currentImageUrl} />}<span className="truncate text-sm text-slate-300">{form.data.image?.name ?? 'Sampul saat ini'}</span></div>}
            <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Ringkasan</span><textarea className={`${inputClass} min-h-20`} onChange={(event) => setData('summary', event.target.value)} value={data.summary} />{form.errors.summary && <span className="mt-1 block text-xs text-rose-400">{form.errors.summary}</span>}</label>
            <div className="block text-sm font-medium text-slate-200"><label className={labelClass} htmlFor="content-markdown">Isi konten</label><span className="mb-2 flex flex-wrap gap-2">
                {[
                    ['Tebal', '**', '**'], ['Miring', '*', '*'], ['Kode', '`', '`'],
                    ['Judul 2', '## ', ''], ['Kutipan', '> ', ''], ['Daftar', '- ', ''],
                ].map(([label, before, after]) => <button className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800" key={label} onClick={() => wrapSelection(before, after)} type="button">{label}</button>)}
                <span className="self-center text-xs text-slate-500">Format Markdown sederhana</span>
            </span><textarea className={`${inputClass} min-h-48`} id="content-markdown" onChange={(event) => setData('content', event.target.value)} ref={editorRef} value={data.content} />{form.errors.content && <span className="mt-1 block text-xs text-rose-400">{form.errors.content}</span>}</div>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Status</span><select className={inputClass} onChange={(event) => setData('status', event.target.value)} value={data.status}><option value="draft">Draft</option><option value="published">Terbit / jadwalkan</option></select>{form.errors.status && <span className="mt-1 block text-xs text-rose-400">{form.errors.status}</span>}</label>
                <div><Field error={form.errors.published_at} label="Waktu terbit (opsional)" onChange={(event) => setData('published_at', event.target.value)} step={60} type="datetime-local" value={data.published_at} /><p className="mt-1 text-xs text-slate-500">Jika waktunya di masa depan, artikel otomatis muncul ke publik pada waktu tersebut.</p></div>
            </div>
            <div className="flex flex-wrap gap-2"><button className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800" onClick={() => setPreviewOpen(true)} type="button">Pratinjau</button><button className={buttonClass} disabled={form.processing} type="submit">{form.processing ? 'Menyimpan...' : 'Simpan konten'}</button>{form.progress && <div className="flex items-center gap-3 text-xs text-slate-400"><progress className="h-2 flex-1 accent-emerald-500" max="100" value={form.progress.percentage} />{form.progress.percentage}%</div>}</div>
            {previewOpen && <div className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-slate-950/85 p-4" role="dialog" aria-modal="true" aria-label="Pratinjau konten"><div className="my-auto max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#111a2a] p-6 sm:p-10"><div className="mb-6 flex justify-end"><button className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300" onClick={() => setPreviewOpen(false)} type="button">Tutup pratinjau</button></div>{uploadedImagePreview ? <img alt="Pratinjau sampul" className="mb-6 max-h-80 w-full object-contain" src={uploadedImagePreview} /> : currentImageUrl && <img alt="Sampul" className="mb-6 max-h-80 w-full object-contain" src={currentImageUrl} />}<p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{data.category || (type === 'berita' ? 'Berita' : 'Artikel')}</p><h1 className="mt-3 text-3xl font-extrabold text-white">{data.title || 'Judul konten'}</h1>{data.summary && <p className="mt-4 text-lg text-slate-300">{data.summary}</p>}<ContentBody className="mt-7 text-base leading-8 text-slate-200" content={data.content || 'Isi konten akan tampil di sini.'} />{data.tags && <p className="mt-8 text-sm text-slate-400">Tag: {data.tags}</p>}</div></div>}
        </form>
    );
}

export function ContentManagement({ type, items = {}, filters = {}, contentCategories = [] }) {
    const [editing, setEditing] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [historyItem, setHistoryItem] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState('');
    const [deletingItem, setDeletingItem] = useState(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const searchForm = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
        category: filters.category ?? '',
        period: filters.period ?? 'all',
        sort: filters.sort ?? 'newest',
    });
    const title = type === 'berita' ? 'Berita' : 'Artikel';
    const singularTitle = type === 'berita' ? 'berita' : 'artikel';

    function search(event) {
        event.preventDefault();
        searchForm.get(`/admin/content/${type}`, { preserveScroll: true, replace: true });
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditing(null);
    }

    async function openHistory(item) {
        setHistoryItem(item);
        setHistory([]);
        setHistoryError('');
        setHistoryLoading(true);
        try {
            const response = await fetch(`/admin/content/${type}/${item.id}/revisions`, { credentials: 'same-origin', headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error('Riwayat revisi gagal dimuat.');
            const result = await response.json();
            setHistory(result.revisions ?? []);
        } catch (error) {
            setHistoryError(error.message || 'Riwayat revisi gagal dimuat.');
        } finally {
            setHistoryLoading(false);
        }
    }

    function restoreRevision(revisionId) {
        if (!window.confirm('Pulihkan versi ini? Kondisi konten saat ini akan disimpan sebagai revisi terlebih dahulu.')) return;
        router.post(`/admin/content/${type}/${historyItem.id}/revisions/${revisionId}/restore`, {}, {
            preserveScroll: true,
            onSuccess: () => setHistoryItem(null),
        });
    }

    function deleteContent() {
        if (!deletingItem) return;
        setDeleteProcessing(true);
        router.delete(`/admin/content/${type}/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingItem(null),
            onFinish: () => setDeleteProcessing(false),
        });
    }

    useEffect(() => {
        if (!isModalOpen) {
            return undefined;
        }

        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
                setEditing(null);
            }
        }

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Publikasi</p><h1 className="mt-2 text-3xl font-extrabold text-white">Kelola {title}</h1><p className="mt-2 text-sm text-slate-400">Buat draft atau terbitkan konten ke halaman publik.</p></div>
                <button className={buttonClass} onClick={() => { setEditing(null); setIsModalOpen(true); }} type="button">Tambah {singularTitle}</button>
            </div>
            <form className="grid gap-3 rounded-2xl border border-slate-800 bg-[#111a2a] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_12rem_12rem_12rem_12rem_auto_auto] xl:items-end" onSubmit={search}>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Cari {singularTitle}</span>
                    <input className={inputClass} maxLength="100" onChange={(event) => searchForm.setData('search', event.target.value)} placeholder="Judul atau isi..." value={searchForm.data.search} />
                </label>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Status</span>
                    <select className={inputClass} onChange={(event) => searchForm.setData('status', event.target.value)} value={searchForm.data.status}><option value="">Semua status</option><option value="draft">Draft</option><option value="published">Terbit</option><option value="scheduled">Terjadwal</option></select>
                </label>
                <label className="block text-sm font-semibold text-slate-300"><span className={labelClass}>Kategori</span><select className={inputClass} onChange={(event) => searchForm.setData('category', event.target.value)} value={searchForm.data.category}><option value="">Semua kategori</option>{contentCategories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</select></label>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Periode dibuat</span>
                    <select className={inputClass} onChange={(event) => searchForm.setData('period', event.target.value)} value={searchForm.data.period}><option value="all">Semua waktu</option><option value="30days">30 hari terakhir</option><option value="year">1 tahun terakhir</option></select>
                </label>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Urutan</span>
                    <select className={inputClass} onChange={(event) => searchForm.setData('sort', event.target.value)} value={searchForm.data.sort}><option value="newest">Terbaru diubah</option><option value="oldest">Terlama diubah</option></select>
                </label>
                <button className={buttonClass} disabled={searchForm.processing} type="submit">Cari</button>
                <Link className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800" href={`/admin/content/${type}`}>Reset</Link>
            </form>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.data?.length ? items.data.map((item) => (
                    <article className="flex h-[28rem] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#111a2a]" key={item.id}>
                        <div className="flex h-56 shrink-0 items-center justify-center overflow-hidden bg-[#0b1220]">{item.image_path ? <img alt={`Sampul ${item.title}`} className="h-full w-full object-contain" src={item.image_path.startsWith('http') || item.image_path.startsWith('/') ? item.image_path : `/storage/${item.image_path}`} /> : <div className="grid h-full place-items-center text-sm text-slate-500">Tidak ada gambar sampul</div>}</div>
                        <div className="flex flex-1 flex-col p-4">
                            <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs capitalize text-slate-300">{item.status === 'published' && item.published_at && new Date(item.published_at) > new Date() ? 'Terjadwal' : item.status === 'published' ? 'Terbit' : 'Draft'}</span>{item.published_at && <time className="text-xs text-slate-500">{new Date(item.published_at).toLocaleString('id-ID')}</time>}</div>
                            {(item.category || item.tags?.length > 0) && <p className="mt-2 text-xs text-slate-400">{item.category?.name}{item.category && item.tags?.length ? ' · ' : ''}{item.tags?.map((tag) => `#${tag.name}`).join(' ')}</p>}
                            <h2 className="mt-3 line-clamp-2 font-bold text-white">{item.title}</h2>
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">{item.summary || item.content}</p>
                            <div className="mt-auto flex gap-2 border-t border-slate-800 pt-4">
                                <button className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" onClick={() => { setEditing(item); setIsModalOpen(true); }} type="button">Ubah</button>
                                <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800" onClick={() => openHistory(item)} type="button">Riwayat</button>
                                <button className="flex-1 rounded-lg border border-rose-500/30 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10" onClick={() => setDeletingItem(item)} type="button">Hapus</button>
                            </div>
                        </div>
                    </article>
                )) : <p className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5 text-sm text-slate-400 sm:col-span-2 xl:col-span-3">Tidak ada {singularTitle} yang cocok dengan pencarian atau filter ini.</p>}
            </div>
            <ConfirmDialog description={deletingItem ? `Konten “${deletingItem.title}” akan dihapus permanen dan tidak dapat dipulihkan.` : ''} onCancel={() => { if (!deleteProcessing) setDeletingItem(null); }} onConfirm={deleteContent} open={Boolean(deletingItem)} processing={deleteProcessing} title={`Yakin ingin menghapus ${singularTitle} ini?`} />
            {items.links?.length > 3 && <div className="flex flex-wrap gap-2">{items.links.map((link, index) => <Link aria-current={link.active ? 'page' : undefined} className={`rounded-lg border px-3 py-2 text-sm ${link.active ? 'border-sky-500 bg-sky-600 text-white' : 'border-slate-700 text-slate-300'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} href={link.url || '#'} key={index} preserveScroll>{link.label.replace(/<[^>]*>/g, '')}</Link>)}</div>}
            {isModalOpen && <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm" onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
                <div aria-labelledby="content-form-title" aria-modal="true" className="my-auto w-full max-w-3xl" role="dialog">
                    <ContentForm contentCategories={contentCategories} initial={editing} key={editing?.id ?? 'new'} onCancel={closeModal} onSaved={closeModal} type={type} />
                </div>
            </div>}
            {historyItem && <div className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-labelledby="revision-title"><section className="my-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#111a2a] p-5"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-white" id="revision-title">Riwayat: {historyItem.title}</h2><button className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300" onClick={() => setHistoryItem(null)} type="button">Tutup</button></div>{historyLoading ? <p className="py-8 text-sm text-slate-400">Memuat riwayat...</p> : historyError ? <p className="py-8 text-sm text-rose-300">{historyError}</p> : history.length === 0 ? <p className="py-8 text-sm text-slate-400">Belum ada revisi tersimpan. Revisi dibuat setiap kali konten diperbarui.</p> : <ul className="mt-4 space-y-3">{history.map((revision) => <li className="rounded-xl border border-slate-800 bg-[#0b1220] p-4" key={revision.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-slate-100">{revision.title}</p><p className="mt-1 text-xs text-slate-400">{new Date(revision.created_at).toLocaleString('id-ID')} · Admin #{revision.created_by ?? 'tidak diketahui'}</p>{revision.summary && <p className="mt-2 line-clamp-2 text-sm text-slate-400">{revision.summary}</p>}</div><button className="rounded-lg border border-orange-500/40 px-3 py-2 text-xs font-semibold text-orange-300 hover:bg-orange-500/10" onClick={() => restoreRevision(revision.id)} type="button">Pulihkan</button></div></li>)}</ul>}</section></div>}
        </section>
    );
}
