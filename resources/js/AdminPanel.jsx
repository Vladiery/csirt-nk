import { useEffect, useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';

const inputClass = 'w-full rounded-lg border border-slate-700 bg-[#0b1220] px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400';
const buttonClass = 'inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60';

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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard detail="Semua status" label="Berita" value={stats.berita ?? 0} />
                <StatCard detail="Semua status" label="Artikel" value={stats.artikel ?? 0} />
                <StatCard detail="Laporan tersimpan" label="Laporan insiden" value={stats.reports ?? 0} />
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

function ReportList({ reports = [] }) {
    return (
        <section>
            <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Penanganan</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">Laporan insiden</h1>
                <p className="mt-2 text-sm text-slate-400">Data pelapor dan detail insiden hanya tersedia di area petugas.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111a2a]">
                {reports.length ? reports.map((item) => (
                    <Link className="flex flex-col gap-3 border-b border-slate-800 p-4 transition last:border-0 hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between" href={`/admin/reports/${item.id}`} key={item.id}>
                        <span><span className="block font-bold text-white">{item.subject}</span><span className="mt-1 block text-xs text-slate-400">{item.category} · {new Date(item.created_at).toLocaleString('id-ID')}</span></span>
                        <span className="w-fit rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold capitalize text-sky-300">{item.status}</span>
                    </Link>
                )) : <p className="p-6 text-sm text-slate-400">Tidak ada laporan yang dapat ditangani saat ini.</p>}
            </div>
        </section>
    );
}

function ReportDetail({ report, statuses = [] }) {
    const form = useForm({
        status: report.status,
        handling_notes: report.handling_notes ?? '',
    });
    const { data, setData, processing, errors } = form;

    function submit(event) {
        event.preventDefault();
        form.patch(`/admin/reports/${report.id}`);
    }

    return (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-5">
                <div>
                    <Link className="text-sm font-semibold text-sky-400 hover:text-sky-300" href="/admin/reports">← Kembali ke laporan</Link>
                    <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">{report.subject}</h1>
                    <p className="mt-2 text-sm text-slate-400">{report.category} · {new Date(report.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5">
                    <h2 className="font-bold text-white">Detail laporan</h2>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div><dt className={labelClass}>Nama pelapor</dt><dd className="text-sm text-slate-200">{report.reporter_name || 'Tidak dicantumkan'}</dd></div>
                        <div><dt className={labelClass}>Email pelapor</dt><dd className="break-all text-sm text-slate-200">{report.reporter_email || 'Tidak dicantumkan'}</dd></div>
                        <div><dt className={labelClass}>Waktu kejadian</dt><dd className="text-sm text-slate-200">{report.occurred_at ? new Date(report.occurred_at).toLocaleString('id-ID') : 'Tidak diketahui'}</dd></div>
                        <div><dt className={labelClass}>URL terdampak</dt><dd className="break-all text-sm text-slate-200">{report.affected_url || 'Tidak dicantumkan'}</dd></div>
                    </dl>
                    <div className="mt-5"><h3 className={labelClass}>Uraian</h3><p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{report.description}</p></div>
                    {report.evidence?.length > 0 && <div className="mt-5"><h3 className={labelClass}>Bukti terlampir</h3><ul className="list-inside list-disc text-sm text-slate-300">{report.evidence.map((file) => <li key={file}>{file}</li>)}</ul></div>}
                </div>
            </div>
            <form className="h-fit space-y-5 rounded-2xl border border-slate-800 bg-[#111a2a] p-5" onSubmit={submit}>
                <div><h2 className="text-lg font-bold text-white">Penanganan</h2><p className="mt-1 text-sm text-slate-400">Status dan catatan tersimpan pada riwayat laporan.</p></div>
                <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Status</span><select className={inputClass} onChange={(event) => setData('status', event.target.value)} value={data.status}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>{errors.status && <span className="mt-1 block text-xs text-rose-400">{errors.status}</span>}</label>
                <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Catatan penanganan</span><textarea className={`${inputClass} min-h-40 resize-y`} onChange={(event) => setData('handling_notes', event.target.value)} placeholder="Tuliskan temuan atau tindakan yang telah dilakukan" value={data.handling_notes} />{errors.handling_notes && <span className="mt-1 block text-xs text-rose-400">{errors.handling_notes}</span>}</label>
                <button className={`${buttonClass} w-full`} disabled={processing} type="submit">{processing ? 'Menyimpan...' : 'Simpan penanganan'}</button>
            </form>
        </section>
    );
}

function ContentForm({ type, initial, onCancel, onSaved }) {
    const form = useForm({
        title: initial?.title ?? '',
        summary: initial?.summary ?? '',
        content: initial?.content ?? '',
        image: null,
        status: initial?.status ?? 'draft',
        published_at: initial?.published_at ?? '',
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

    return (
        <form className="max-h-[85vh] space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-[#111a2a] p-5" onSubmit={submit}>
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-white" id="content-form-title">{initial ? `Ubah ${type === 'berita' ? 'berita' : 'artikel'}` : `Tambah ${type === 'berita' ? 'berita' : 'artikel'}`}</h2><button aria-label="Tutup formulir" className="grid h-9 w-9 place-items-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white" onClick={onCancel} type="button">×</button></div>
            <Field error={form.errors.title} label="Judul" onChange={(event) => setData('title', event.target.value)} value={data.title} />
            <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Gambar sampul (opsional)</span><input accept="image/jpeg,image/png,image/webp" className={inputClass} onChange={(event) => setData('image', event.target.files?.[0] ?? null)} type="file" />{form.errors.image && <span className="mt-1 block text-xs text-rose-400">{form.errors.image}</span>}<span className="mt-1 block text-xs text-slate-400">JPG, PNG, atau WebP, maksimal 5 MB. Rekomendasi rasio gambar 16:9.{initial && currentImageUrl ? ' Pilih gambar baru jika ingin mengganti sampul.' : ''}</span></label>
            {(form.data.image || currentImageUrl) && <div className="flex items-center gap-3 rounded-lg border border-slate-700 p-3">{currentImageUrl && !form.data.image && <img alt="Sampul saat ini" className="h-16 w-24 rounded object-cover" src={currentImageUrl} />}<span className="truncate text-sm text-slate-300">{form.data.image?.name ?? 'Sampul saat ini'}</span></div>}
            <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Ringkasan</span><textarea className={`${inputClass} min-h-20`} onChange={(event) => setData('summary', event.target.value)} value={data.summary} />{form.errors.summary && <span className="mt-1 block text-xs text-rose-400">{form.errors.summary}</span>}</label>
            <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Isi konten</span><textarea className={`${inputClass} min-h-48`} onChange={(event) => setData('content', event.target.value)} value={data.content} />{form.errors.content && <span className="mt-1 block text-xs text-rose-400">{form.errors.content}</span>}</label>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-200"><span className={labelClass}>Status</span><select className={inputClass} onChange={(event) => setData('status', event.target.value)} value={data.status}><option value="draft">Draft</option><option value="published">Terbit</option></select>{form.errors.status && <span className="mt-1 block text-xs text-rose-400">{form.errors.status}</span>}</label>
                <Field error={form.errors.published_at} label="Waktu terbit (opsional)" onChange={(event) => setData('published_at', event.target.value)} step={60} type="datetime-local" value={data.published_at} />
            </div>
            <div className="space-y-2"><button className={buttonClass} disabled={form.processing} type="submit">{form.processing ? 'Menyimpan...' : 'Simpan konten'}</button>{form.progress && <div className="flex items-center gap-3 text-xs text-slate-400"><progress className="h-2 flex-1 accent-emerald-500" max="100" value={form.progress.percentage} />{form.progress.percentage}%</div>}</div>
        </form>
    );
}

function ContentManagement({ type, items = [] }) {
    const [editing, setEditing] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const title = type === 'berita' ? 'Berita' : 'Artikel';
    const singularTitle = type === 'berita' ? 'berita' : 'artikel';

    function closeModal() {
        setIsModalOpen(false);
        setEditing(null);
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.data?.length ? items.data.map((item) => (
                    <article className="flex h-[28rem] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#111a2a]" key={item.id}>
                        <div className="flex h-56 shrink-0 items-center justify-center overflow-hidden bg-[#0b1220]">{item.image_path ? <img alt={`Sampul ${item.title}`} className="h-full w-full object-contain" src={item.image_path.startsWith('http') || item.image_path.startsWith('/') ? item.image_path : `/storage/${item.image_path}`} /> : <div className="grid h-full place-items-center text-sm text-slate-500">Tidak ada gambar sampul</div>}</div>
                        <div className="flex flex-1 flex-col p-4">
                            <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs capitalize text-slate-300">{item.status}</span>{item.published_at && <time className="text-xs text-slate-500">{new Date(item.published_at).toLocaleDateString('id-ID')}</time>}</div>
                            <h2 className="mt-3 line-clamp-2 font-bold text-white">{item.title}</h2>
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">{item.summary || item.content}</p>
                            <div className="mt-auto flex gap-2 border-t border-slate-800 pt-4">
                                <button className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800" onClick={() => { setEditing(item); setIsModalOpen(true); }} type="button">Ubah</button>
                                <button className="flex-1 rounded-lg border border-rose-500/30 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10" onClick={() => router.delete(`/admin/content/${type}/${item.id}`)} type="button">Hapus</button>
                            </div>
                        </div>
                    </article>
                )) : <p className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5 text-sm text-slate-400 sm:col-span-2 xl:col-span-3">Belum ada {title.toLowerCase()}.</p>}
            </div>
            {items.links?.length > 3 && <div className="flex flex-wrap gap-2">{items.links.map((link, index) => link.url ? <Link className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300" href={link.url} key={index} preserveScroll>{link.label.replace(/<[^>]*>/g, '')}</Link> : null)}</div>}
            {isModalOpen && <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm" onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
                <div aria-labelledby="content-form-title" aria-modal="true" className="my-auto w-full max-w-3xl" role="dialog">
                    <ContentForm initial={editing} key={editing?.id ?? 'new'} onCancel={closeModal} onSaved={closeModal} type={type} />
                </div>
            </div>}
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
            <div className="flex gap-2"><button className="rounded-lg bg-sky-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-sky-500" type="submit">Simpan</button>{!currentUser && <button className="rounded-lg border border-rose-500/30 px-3 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/10" onClick={() => router.delete(`/admin/staff/${staff.id}`)} type="button">Hapus</button>}</div>
        </form>
    );
}

function StaffManagement({ staff = [], auth, isLightMode }) {
    return (
        <section className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Administrasi</p><h1 className="mt-2 text-3xl font-extrabold text-white">Akun admin</h1><p className="mt-2 text-sm text-slate-400">Kelola akun admin. Minimal satu admin aktif harus dipertahankan.</p></div><StaffCreateForm isLightMode={isLightMode} /><div className="space-y-3">{staff.map((user) => <StaffAccount currentUser={user.id === auth?.user?.id} isLightMode={isLightMode} key={user.id} staff={user} />)}</div></section>
    );
}

function RfcDocumentManagement({ rfcDocument = {}, isLightMode }) {
    const [fileInputKey, setFileInputKey] = useState(0);
    const form = useForm({ document: null, version: rfcDocument.version ?? '1.10' });
    const fileInputClass = isLightMode
        ? 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700'
        : inputClass;

    function submit(event) {
        event.preventDefault();
        form.post('/admin/rfc2350/document', {
            onSuccess: () => {
                form.reset('document');
                setFileInputKey((key) => key + 1);
            },
        });
    }

    return (
        <section className="max-w-3xl space-y-5">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Publikasi resmi</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">Dokumen RFC 2350</h1>
                <p className="mt-2 text-sm text-slate-400">Ganti file PDF dan versi yang ditampilkan pada halaman publik.</p>
            </div>
            <div className={`rounded-2xl border p-5 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#111a2a]'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className={`text-sm font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Dokumen aktif · Versi {rfcDocument.version ?? '1.10'}</p>
                        <p className={`mt-1 text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{rfcDocument.updated_at ? `Diperbarui ${rfcDocument.updated_at}` : 'Menggunakan dokumen bawaan proyek.'}</p>
                    </div>
                    <a className="text-sm font-semibold text-emerald-600 hover:text-emerald-500" href="/rfc2350/download">Unduh dokumen aktif</a>
                </div>
            </div>
            <form className={`space-y-4 rounded-2xl border p-5 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#111a2a]'}`} onSubmit={submit}>
                <Field error={form.errors.version} isLightMode={isLightMode} label="Versi dokumen" onChange={(event) => form.setData('version', event.target.value)} placeholder="Contoh: 1.11" value={form.data.version} />
                <label className={`block text-sm font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                    <span className={isLightMode ? 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600' : labelClass}>File PDF terbaru</span>
                    <input accept="application/pdf,.pdf" className={fileInputClass} key={fileInputKey} onChange={(event) => form.setData('document', event.target.files?.[0] ?? null)} type="file" />
                    {form.errors.document && <span className="mt-1 block text-xs text-rose-400">{form.errors.document}</span>}
                    <span className={`mt-1 block text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>PDF maksimal 20 MB. Sunting dokumen di aplikasi PDF, lalu unggah versi terbarunya di sini.</span>
                </label>
                <div className="space-y-2">
                    <button className={buttonClass} disabled={form.processing || !form.data.document} type="submit">{form.processing ? 'Mengunggah...' : 'Simpan dokumen RFC'}</button>
                    {form.progress && <div className="flex items-center gap-3 text-xs text-slate-400"><progress className="h-2 flex-1 accent-emerald-500" max="100" value={form.progress.percentage} />{form.progress.percentage}%</div>}
                </div>
            </form>
        </section>
    );
}

export default function AdminPanel({ adminSection, auth = {}, contentType, flash = {}, isLightMode, items, report, reports, rfcDocument = {}, staff, stats, statuses = [] }) {
    const sectionKey = adminSection === 'content' ? contentType : adminSection;

    return (
        <section className="admin-panel min-h-[70vh] bg-[#090e1b] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">
                <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">NK-CSIRT · AREA TERBATAS</p><p className="mt-2 text-sm text-slate-400">Masuk sebagai <span className="font-semibold text-slate-200">{auth.user?.name}</span> · <span className="capitalize">{auth.user?.role}</span></p></div>
                    <AdminNavigation section={sectionKey} />
                </header>
                {flash.adminStatus && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{flash.adminStatus}</p>}
                {adminSection === 'dashboard' && <Dashboard stats={stats} />}
                {adminSection === 'reports' && <ReportList reports={reports} />}
                {adminSection === 'reportDetail' && <ReportDetail report={report} statuses={statuses} />}
                {adminSection === 'content' && <ContentManagement items={items} type={contentType} />}
                {adminSection === 'rfcDocument' && <RfcDocumentManagement isLightMode={isLightMode} rfcDocument={rfcDocument} />}
                {adminSection === 'staff' && <StaffManagement auth={auth} isLightMode={isLightMode} staff={staff} />}
            </div>
        </section>
    );
}
