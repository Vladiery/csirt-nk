import { useEffect, useRef, useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import ContentBody from './ContentBody';

const inputClass = 'w-full rounded-lg border border-slate-700 bg-[#0b1220] px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400';
const buttonClass = 'inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60';

function toDateTimeLocal(value) {
    if (!value) return '';

    const valueString = String(value);
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valueString)) return valueString;

    const parsedDate = new Date(valueString);
    if (Number.isNaN(parsedDate.getTime())) return '';

    const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 16);
}

function Field({ label, error, isLightMode = false, ...props }) {
    const fieldInputClass = isLightMode
        ? 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
        : inputClass;
    const fieldLabelClass = isLightMode
        ? 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600'
        : labelClass;

    return (
        <label className={`block text-sm font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
            <span className={fieldLabelClass}>{label}</span>
            <input className={fieldInputClass} {...props} />
            {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
        </label>
    );
}

function AdminNavigation({ section }) {
    const links = [
        { label: 'Ringkasan', href: '/admin/dashboard', key: 'dashboard' },
        { label: 'Berita', href: '/admin/content/berita', key: 'berita' },
        { label: 'Artikel', href: '/admin/content/artikel', key: 'artikel' },
        { label: 'Laporan insiden', href: '/admin/reports', key: 'reports' },
        { label: 'Dokumen RFC', href: '/admin/rfc2350', key: 'rfcDocument' },
        { label: 'Akun admin', href: '/admin/staff', key: 'staff' },
    ];

    return (
        <nav aria-label="Navigasi panel petugas" className="flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => (
                <Link className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${section === link.key ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`} href={link.href} key={link.key}>
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}

function StatCard({ label, value, detail }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{detail}</p>
        </div>
    );
}

function Dashboard({ stats = {} }) {
    return (
        <>
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Admin CSIRT</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">Ringkasan</h1>
                <p className="mt-2 text-sm text-slate-400">Ikhtisar data yang tercatat pada sistem.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard detail="Semua status" label="Berita" value={stats.berita ?? 0} />
                <StatCard detail="Semua status" label="Artikel" value={stats.artikel ?? 0} />
                <StatCard detail="Laporan tersimpan" label="Laporan insiden" value={stats.reports ?? 0} />
                <StatCard detail="Received, triage, dan investigating" label="Laporan belum ditangani" value={stats.unhandledReports ?? 0} />
            </div>
            <section className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5">
                <h2 className="text-lg font-bold text-white">Laporan menurut status</h2>
                {stats.reportsByStatus?.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.reportsByStatus.map((item) => <div className="flex items-center justify-between rounded-xl bg-[#0b1220] px-4 py-3" key={item.status}><span className="capitalize text-sm text-slate-300">{item.status}</span><span className="font-bold text-sky-300">{item.total}</span></div>)}
                    </div>
                ) : <p className="mt-3 text-sm text-slate-400">Belum ada laporan masuk.</p>}
            </section>
        </>
    );
}

function ReportList({ reports = {}, categories = [], statuses = [], filters = {} }) {
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
        category: filters.category ?? '',
        period: filters.period ?? 'all',
    });

    function search(event) {
        event.preventDefault();
        form.get('/admin/reports', { preserveScroll: true, replace: true });
    }

    const reportItems = reports.data ?? [];

    return (
        <section>
            <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Penanganan</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">Laporan insiden</h1>
                <p className="mt-2 text-sm text-slate-400">Data pelapor dan detail insiden hanya tersedia di area petugas.</p>
            </div>
            <form className="mb-5 grid gap-3 rounded-2xl border border-slate-800 bg-[#111a2a] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_12rem_12rem_12rem_auto_auto] xl:items-end" onSubmit={search}>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Cari laporan</span>
                    <input className={inputClass} maxLength="100" onChange={(event) => form.setData('search', event.target.value)} placeholder="Subjek, kategori, atau kode pelacakan..." value={form.data.search} />
                </label>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Status</span>
                    <select className={inputClass} onChange={(event) => form.setData('status', event.target.value)} value={form.data.status}><option value="">Semua status</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
                </label>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Kategori</span>
                    <select className={inputClass} onChange={(event) => form.setData('category', event.target.value)} value={form.data.category}><option value="">Semua kategori</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
                </label>
                <label className="block text-sm font-semibold text-slate-300">
                    <span className={labelClass}>Periode masuk</span>
                    <select className={inputClass} onChange={(event) => form.setData('period', event.target.value)} value={form.data.period}><option value="all">Semua waktu</option><option value="7days">7 hari terakhir</option><option value="30days">30 hari terakhir</option></select>
                </label>
                <button className={buttonClass} disabled={form.processing} type="submit">Cari</button>
                <Link className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800" href="/admin/reports">Reset</Link>
            </form>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111a2a]">
                {reportItems.length ? reportItems.map((item) => (
                    <Link className="flex flex-col gap-3 border-b border-slate-800 p-4 transition last:border-0 hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between" href={`/admin/reports/${item.id}`} key={item.id}>
                        <span><span className="block font-bold text-white">{item.subject}</span><span className="mt-1 block text-xs text-slate-400">{item.category} · {new Date(item.created_at).toLocaleString('id-ID')}</span></span>
                        <span className="w-fit rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold capitalize text-sky-300">{item.status}</span>
                    </Link>
                )) : <p className="p-6 text-sm text-slate-400">Tidak ada laporan yang dapat ditangani saat ini.</p>}
            </div>
            {reports.links?.length > 3 && <nav aria-label="Navigasi halaman laporan" className="mt-5 flex flex-wrap justify-center gap-2">{reports.links.map((link, index) => <Link aria-current={link.active ? 'page' : undefined} className={`rounded-lg border px-3 py-2 text-sm ${link.active ? 'border-sky-500 bg-sky-600 text-white' : 'border-slate-800 bg-[#111a2a] text-slate-300'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} href={link.url || '#'} key={`${link.label}-${index}`} preserveScroll />)}</nav>}
        </section>
    );
}

function ReportDetail({ report, statuses = [], assignees = [] }) {
    const [copied, setCopied] = useState(false);
    const form = useForm({
        status: report.status,
        handling_notes: report.handling_notes ?? '',
        assigned_to_id: report.assigned_to_id ? String(report.assigned_to_id) : '',
    });
    const { data, setData, processing, errors } = form;

    function submit(event) {
        event.preventDefault();
        form.patch(`/admin/reports/${report.id}`);
    }

    async function copyTrackingCode() {
        try {
            await navigator.clipboard.writeText(report.tracking_code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <section className="grid gap-6 xl:grid-cols-2">
            <div className="flex flex-col gap-5">
                <div>
                    <Link className="text-sm font-semibold text-sky-400 hover:text-sky-300" href="/admin/reports">← Kembali ke laporan</Link>
                    <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">{report.subject}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Kode pelacakan</span><code className="rounded-lg border border-slate-800 bg-[#111a2a] px-3 py-2 text-sm text-sky-300">{report.tracking_code}</code><button className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800" onClick={copyTrackingCode} type="button">{copied ? 'Tersalin' : 'Salin kode'}</button></div>
                    <p className="mt-2 text-sm text-slate-400">{report.category} · {new Date(report.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex-1 rounded-2xl border border-slate-800 bg-[#111a2a] p-5 sm:p-6">
                    <h2 className="font-bold text-white">Detail laporan</h2>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div><dt className={labelClass}>Nama pelapor</dt><dd className="text-sm text-slate-200">{report.reporter_name || 'Tidak dicantumkan'}</dd></div>
                        <div><dt className={labelClass}>Email pelapor</dt><dd className="break-all text-sm text-slate-200">{report.reporter_email || 'Tidak dicantumkan'}</dd></div>
                        <div><dt className={labelClass}>Waktu kejadian</dt><dd className="text-sm text-slate-200">{report.occurred_at ? new Date(report.occurred_at).toLocaleString('id-ID') : 'Tidak diketahui'}</dd></div>
                        <div><dt className={labelClass}>URL terdampak</dt><dd className="break-all text-sm text-slate-200">{report.affected_url || 'Tidak dicantumkan'}</dd></div>
                    </dl>
                    <div className="mt-5"><h3 className={labelClass}>Uraian</h3><p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{report.description}</p></div>
                    {report.evidence?.length > 0 && <div className="mt-5"><h3 className={labelClass}>Bukti terlampir</h3><ul className="list-inside list-disc text-sm text-slate-300">{report.evidence.map((file) => <li key={file.url}><a className="font-semibold text-sky-300 underline decoration-sky-500/40 underline-offset-2 hover:text-sky-200" href={file.url}>{file.name}</a></li>)}</ul></div>}
                </div>
            </div>
            <form className="h-fit space-y-5 rounded-2xl border border-slate-800 bg-[#111a2a] p-5 sm:p-6" onSubmit={submit}>
                <div><h2 className="text-lg font-bold text-white">Penanganan</h2><p className="mt-1 text-sm text-slate-400">Atur status, petugas penanggung jawab, dan catatan tindak lanjut.</p></div>
                <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Status</span><select className={inputClass} onChange={(event) => setData('status', event.target.value)} value={data.status}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>{errors.status && <span className="mt-1 block text-xs text-rose-400">{errors.status}</span>}</label>
                <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Petugas penanggung jawab</span><select className={inputClass} onChange={(event) => setData('assigned_to_id', event.target.value)} value={data.assigned_to_id}><option value="">Belum ditugaskan</option>{assignees.map((person) => <option key={person.id} value={person.id}>{person.name} ({person.role})</option>)}</select>{errors.assigned_to_id && <span className="mt-1 block text-xs text-rose-400">{errors.assigned_to_id}</span>}{report.assigned_to_name && <span className="mt-1 block text-xs text-slate-500">Saat ini: {report.assigned_to_name}</span>}</label>
                <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Catatan penanganan</span><textarea className={`${inputClass} min-h-56 resize-y`} onChange={(event) => setData('handling_notes', event.target.value)} placeholder="Catat hasil pemeriksaan, tindakan, komunikasi, dan langkah berikutnya..." value={data.handling_notes} />{errors.handling_notes && <span className="mt-1 block text-xs text-rose-400">{errors.handling_notes}</span>}<span className="mt-1 block text-xs text-slate-500">Catatan ini hanya terlihat di panel petugas.</span></label>
                <button className={`${buttonClass} w-full`} disabled={processing} type="submit">{processing ? 'Menyimpan...' : 'Simpan penanganan'}</button>
            </form>
        </section>
    );
}

function ContentForm({ type, initial, onCancel, onSaved, contentCategories = [] }) {
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

function ContentManagement({ type, items = {}, filters = {}, contentCategories = [] }) {
    const [editing, setEditing] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [historyItem, setHistoryItem] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState('');
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
                                <button className="flex-1 rounded-lg border border-rose-500/30 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10" onClick={() => {
                                    if (window.confirm(`Hapus ${singularTitle} “${item.title}”? Tindakan ini tidak dapat dibatalkan.`)) {
                                        router.delete(`/admin/content/${type}/${item.id}`);
                                    }
                                }} type="button">Hapus</button>
                            </div>
                        </div>
                    </article>
                )) : <p className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5 text-sm text-slate-400 sm:col-span-2 xl:col-span-3">Tidak ada {singularTitle} yang cocok dengan pencarian atau filter ini.</p>}
            </div>
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

function StaffCreateForm({ isLightMode }) {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '', is_active: true });

    function submit(event) {
        event.preventDefault();
        form.post('/admin/staff', { onSuccess: () => form.reset('name', 'email', 'password', 'password_confirmation') });
    }

    return (
        <form className={`grid gap-4 rounded-2xl border p-5 md:grid-cols-2 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#111a2a]'}`} onSubmit={submit}>
            <div className="md:col-span-2"><h2 className={`text-lg font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Tambah akun admin</h2><p className={`mt-1 text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>Akun admin hanya dibuat dari panel ini. Pengunjung publik tidak dapat mendaftar.</p></div>
            <Field error={form.errors.name} isLightMode={isLightMode} label="Nama" onChange={(event) => form.setData('name', event.target.value)} value={form.data.name} />
            <Field error={form.errors.email} isLightMode={isLightMode} label="Email" onChange={(event) => form.setData('email', event.target.value)} type="email" value={form.data.email} />
            <div className="grid grid-cols-2 gap-3"><Field error={form.errors.password} isLightMode={isLightMode} label="Kata sandi" onChange={(event) => form.setData('password', event.target.value)} type="password" value={form.data.password} /><Field error={form.errors.password_confirmation} isLightMode={isLightMode} label="Ulangi kata sandi" onChange={(event) => form.setData('password_confirmation', event.target.value)} type="password" value={form.data.password_confirmation} /></div>
            <label className={`flex items-center gap-2 text-sm ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}><input checked={form.data.is_active} className="h-4 w-4 accent-sky-500" onChange={(event) => form.setData('is_active', event.target.checked)} type="checkbox" />Aktifkan akun setelah dibuat</label>
            <div><button className={buttonClass} disabled={form.processing} type="submit">Buat akun</button></div>
        </form>
    );
}

function StaffAccount({ staff, currentUser, isLightMode }) {
    const form = useForm({ name: staff.name, email: staff.email, is_active: staff.is_active, password: '', password_confirmation: '' });
    const fieldInputClass = isLightMode
        ? 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
        : inputClass;
    const isLegacyAccount = staff.role === 'analyst';

    function submit(event) {
        event.preventDefault();
        form.patch(`/admin/staff/${staff.id}`, { onSuccess: () => form.reset('password', 'password_confirmation') });
    }

    return (
        <form className={`grid gap-3 rounded-xl border p-4 lg:grid-cols-[1fr_1fr_170px_110px_1fr_auto] lg:items-end ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#0b1220]'}`} onSubmit={submit}>
            <Field error={form.errors.name} isLightMode={isLightMode} label="Nama" onChange={(event) => form.setData('name', event.target.value)} value={form.data.name} />
            <Field error={form.errors.email} isLightMode={isLightMode} label="Email" onChange={(event) => form.setData('email', event.target.value)} type="email" value={form.data.email} />
            <div className={`self-center text-sm font-semibold ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{isLegacyAccount ? 'Akun lama · analis nonaktif' : 'Admin'}</div>
            <label className={`flex h-10 items-center gap-2 text-sm ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}><input checked={form.data.is_active} className="h-4 w-4 accent-sky-500" disabled={currentUser || isLegacyAccount} onChange={(event) => form.setData('is_active', event.target.checked)} type="checkbox" />Aktif</label>
            <div className="grid grid-cols-2 gap-2"><Field error={form.errors.password} isLightMode={isLightMode} label="Sandi baru" onChange={(event) => form.setData('password', event.target.value)} type="password" value={form.data.password} /><Field error={form.errors.password_confirmation} isLightMode={isLightMode} label="Konfirmasi" onChange={(event) => form.setData('password_confirmation', event.target.value)} type="password" value={form.data.password_confirmation} /></div>
            <div className="flex gap-2"><button className="rounded-lg bg-sky-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-sky-500" type="submit">Simpan</button>{!currentUser && <button className="rounded-lg border border-rose-500/30 px-3 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/10" onClick={() => {
                if (window.confirm(`Hapus akun admin ${staff.name} (${staff.email})? Tindakan ini tidak dapat dibatalkan.`)) {
                    router.delete(`/admin/staff/${staff.id}`);
                }
            }} type="button">Hapus</button>}</div>
        </form>
    );
}

function StaffManagement({ staff = [], auth, isLightMode }) {
    return (
        <section className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Administrasi</p><h1 className="mt-2 text-3xl font-extrabold text-white">Akun admin</h1><p className="mt-2 text-sm text-slate-400">Kelola akun admin. Minimal satu admin aktif harus dipertahankan.</p></div><StaffCreateForm isLightMode={isLightMode} /><div className="space-y-3">{staff.map((user) => <StaffAccount currentUser={user.id === auth?.user?.id} isLightMode={isLightMode} key={user.id} staff={user} />)}</div></section>
    );
}

function RfcFileUpload({ accept, fileName, hint, isLightMode, label, path, versionName, versionValue }) {
    const [fileInputKey, setFileInputKey] = useState(0);
    const initialData = { [fileName]: null };
    if (versionName) {
        initialData[versionName] = versionValue ?? '1.10';
    }

    const form = useForm(initialData);

    useEffect(() => {
        if (versionName && versionValue) {
            form.setData(versionName, versionValue);
        }
    }, [versionName, versionValue]);
    const fileInputClass = isLightMode
        ? 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700'
        : inputClass;

    function submit(event) {
        event.preventDefault();
        form.post('/admin/rfc2350/document', {
            onSuccess: () => {
                form.reset(fileName);
                setFileInputKey((key) => key + 1);
            },
        });
    }

    return (
        <form className={`space-y-4 rounded-2xl border p-5 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#111a2a]'}`} onSubmit={submit}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className={`text-lg font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{label}</h2>
                <span className={`text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{path ? 'File tersedia' : 'Belum diunggah'}</span>
            </div>
            {versionName && <Field error={form.errors[versionName]} isLightMode={isLightMode} label="Versi dokumen" onChange={(event) => form.setData(versionName, event.target.value)} placeholder="Contoh: 1.11" value={form.data[versionName]} />}
            <label className={`block text-sm font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                <span className={isLightMode ? 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600' : labelClass}>{label}</span>
                <input accept={accept} className={fileInputClass} key={fileInputKey} onChange={(event) => form.setData(fileName, event.target.files?.[0] ?? null)} type="file" />
                {form.errors[fileName] && <span className="mt-1 block text-xs text-rose-400">{form.errors[fileName]}</span>}
                <span className={`mt-1 block text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</span>
            </label>
            <div className="space-y-2">
                <button className={buttonClass} disabled={form.processing || !form.data[fileName]} type="submit">{form.processing ? 'Mengunggah...' : 'Simpan'}</button>
                {form.progress && <div className="flex items-center gap-3 text-xs text-slate-400"><progress className="h-2 flex-1 accent-emerald-500" max="100" value={form.progress.percentage} />{form.progress.percentage}%</div>}
            </div>
        </form>
    );
}

function RfcDocumentManagement({ rfcDocument = {}, isLightMode }) {
    return (
        <section className="w-full space-y-5">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Publikasi resmi</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">Dokumen RFC 2350 & Kunci PGP</h1>
                <p className="mt-2 text-sm text-slate-400">Setiap formulir menyimpan satu file secara terpisah. Versi RFC Indonesia dan English dikelola masing-masing.</p>
                {rfcDocument.updated_at && <p className="mt-2 text-sm text-slate-500">Terakhir diperbarui {rfcDocument.updated_at}</p>}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
                <RfcFileUpload accept="application/pdf,.pdf" fileName="document" hint="PDF maksimal 20 MB." isLightMode={isLightMode} label="RFC 2350 Bahasa Indonesia" path={rfcDocument.indonesian_path} versionName="version" versionValue={rfcDocument.version} />
                <RfcFileUpload accept="application/pdf,.pdf" fileName="english_document" hint="English PDF, maksimal 20 MB." isLightMode={isLightMode} label="RFC 2350 English" path={rfcDocument.english_path} versionName="english_version" versionValue={rfcDocument.english_version} />
                <RfcFileUpload accept="application/pdf,.pdf" fileName="pgp_key" hint="PDF maksimal 20 MB." isLightMode={isLightMode} label="PGP Public Key (PDF)" path={rfcDocument.pgp_path} />
            </div>
        </section>
    );
}

export default function AdminPanel({ adminSection, assignees = [], auth = {}, categories = [], contentCategories = [], contentType, filters = {}, flash = {}, isLightMode, items, report, reports, rfcDocument = {}, staff, stats, statuses = [] }) {
    const sectionKey = adminSection === 'content' ? contentType : adminSection;

    return (
        <section className="admin-panel min-h-[70vh] bg-[#090e1b] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="w-full space-y-7">
                <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">NK-CSIRT · AREA TERBATAS</p><p className="mt-2 text-sm text-slate-400">Masuk sebagai <span className="font-semibold text-slate-200">{auth.user?.name}</span> · <span className="capitalize">{auth.user?.role}</span></p></div>
                    <AdminNavigation section={sectionKey} />
                </header>
                {flash.adminStatus && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{flash.adminStatus}</p>}
                {adminSection === 'dashboard' && <Dashboard stats={stats} />}
                {adminSection === 'reports' && <ReportList categories={categories} filters={filters} reports={reports} statuses={statuses} />}
                {adminSection === 'reportDetail' && <ReportDetail assignees={assignees} report={report} statuses={statuses} />}
                {adminSection === 'content' && <ContentManagement contentCategories={contentCategories} filters={filters} items={items} type={contentType} />}
                {adminSection === 'rfcDocument' && <RfcDocumentManagement isLightMode={isLightMode} rfcDocument={rfcDocument} />}
                {adminSection === 'staff' && <StaffManagement auth={auth} isLightMode={isLightMode} staff={staff} />}
            </div>
        </section>
    );
}
