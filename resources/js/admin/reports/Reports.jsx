import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { buttonClass, inputClass, labelClass } from '../shared';

export function ReportList({ reports = {}, categories = [], statuses = [], filters = {} }) {
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

export function ReportDetail({ report, statuses = [], assignees = [] }) {
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

